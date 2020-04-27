'use strict'

const escapeStringForRx = require('escape-string-regexp')
const { expand: expandBraces } = require('braces')
const flattenDeep = require('./flatten-deep')
const fs = require('fs-extra')
const git = require('isomorphic-git')
const invariably = { true: () => true, false: () => false, void: () => {}, emptyArray: () => [] }
const { makeRe: makePicomatchRx } = require('picomatch')

const RX_ESCAPED_GLOB = /\\\*/g
const RX_MAGIC_DETECTOR = /[*{]/
const RX_QUESTION_MARK = /\?/g
const PICO_OPTS = { nobracket: true, noextglob: true, noglobstar: true, noquantifiers: true }
const PICO_NEGATED_OPTS = { nobracket: true, noextglob: true, noquantifiers: true }

function resolvePathGlobs (base, patterns, listDirents, retrievePath, tree = { path: '' }) {
  return patterns.reduce((paths, pattern) => {
    if (pattern.charAt() === '!') {
      return paths.then((resolvedPaths) => {
        if (resolvedPaths.length) {
          if (~pattern.indexOf('?')) pattern = pattern.replace(RX_QUESTION_MARK, '\\?')
          const rx = makePicomatchRx(pattern, PICO_NEGATED_OPTS)
          return resolvedPaths.filter(rx.test.bind(rx))
        } else {
          return resolvedPaths
        }
      })
    } else if (RX_MAGIC_DETECTOR.test(pattern)) {
      return glob(base, pattern.split('/'), listDirents, retrievePath, tree).then((nestedPaths) =>
        paths.then((resolvedPaths) => resolvedPaths.concat(nestedPaths))
      )
    }
    return paths.then((resolvedPaths) => resolvedPaths.concat(pattern))
  }, Promise.resolve([]))
}

async function glob (base, patternSegments, listDirents, retrievePath, { oid, path, globbed }) {
  let patternSegment = patternSegments[0]
  patternSegments = patternSegments.slice(1)
  if (RX_MAGIC_DETECTOR.test(patternSegment)) {
    let isMatch
    let explicit
    if (patternSegment === '*') {
      isMatch = (it) => it.charAt() !== '.'
    } else if (~patternSegment.indexOf('{')) {
      if (globbed) {
        if (patternSegment.charAt() === '!') patternSegment = '\\' + patternSegment
        if (~patternSegment.indexOf('?')) patternSegment = patternSegment.replace(RX_QUESTION_MARK, '\\?')
        isMatch = (isMatch = makePicomatchRx(patternSegment, PICO_OPTS)).test.bind(isMatch)
      } else if (~patternSegment.indexOf('*')) {
        const [wildPatterns, literals] = expandBraces(patternSegment).reduce(
          ([wild, literal], it) => (~it.indexOf('*') ? [wild.concat(it), literal] : [wild, literal.concat(it)]),
          [[], []]
        )
        isMatch = (isMatch = makeAlternationMatcherRx(wildPatterns)).test.bind(isMatch)
        explicit = new Set(literals)
      } else {
        return expandBraces(patternSegment).map((it) => joinPath(path, it))
      }
    } else {
      isMatch = (isMatch = makeMatcherRx(patternSegment)).test.bind(isMatch)
    }
    let dirents = await listDirents(base, oid || path)
    if (explicit) dirents = dirents.filter((dirent) => !explicit.has(dirent.name))
    const discovered = flattenDeep(
      await Promise.all(
        dirents.map((dirent) =>
          dirent.isDirectory() && isMatch(dirent.name)
            ? patternSegments.length
              ? glob(base, patternSegments, listDirents, retrievePath, {
                oid: dirent.oid,
                path: joinPath(path, dirent.name),
                globbed: true,
              })
              : joinPath(path, dirent.name)
            : []
        )
      )
    )
    return explicit ? [...explicit].map((it) => joinPath(path, it)).concat(discovered) : discovered
  } else {
    const [magicBase, nextSegment] = extractMagicBase(patternSegments, patternSegment)
    patternSegment = magicBase
    if (nextSegment) {
      const obj = await retrievePath(base, { oid, path }, patternSegment)
      if (obj) {
        return glob(base, patternSegments, listDirents, retrievePath, {
          oid: obj.oid,
          path: joinPath(path, patternSegment),
        })
      } else if ((patternSegment += '/' + patternSegments.join('/')).indexOf('{')) {
        return expandBraces(patternSegment).map((it) => joinPath(path, it))
      } else {
        return [joinPath(path, patternSegment)]
      }
    } else if (globbed) {
      return (await retrievePath(base, { oid, path }, patternSegment)) ? [joinPath(path, patternSegment)] : []
    } else {
      return [joinPath(path, patternSegment)]
    }
  }
}

function extractMagicBase (patternSegments, base) {
  let nextSegment
  if (patternSegments.length) {
    while ((nextSegment = patternSegments[0])) {
      if (RX_MAGIC_DETECTOR.test(nextSegment)) break
      base += '/' + patternSegments.shift()
    }
  }
  return [base, nextSegment]
}

function isDirectory (path) {
  return fs
    .stat(path)
    .then((stat) => stat.isDirectory())
    .catch(invariably.false)
}

function listDirentsFs (base, path) {
  return readdirWithFileTypes(base + '/' + path)
}

function listDirentsGit (repo, treeOid) {
  return git
    .readObject({ ...repo, oid: treeOid, filepath: '' })
    .catch(() => ({ object: {} }))
    .then(({ object: { entries } }) =>
      entries
        ? entries.map(({ type, oid, path: name }) => ({ name, oid, isDirectory: invariably[type === 'tree'] }))
        : []
    )
}

function makeAlternationMatcherRx (patterns) {
  return new RegExp('^(?:' + patterns.map(patternToRx).join('|') + ')$')
}

function makeMatcherRx (pattern) {
  return new RegExp('^' + patternToRx(pattern) + '$')
}

function patternToRx (pattern) {
  return (pattern.charAt() === '.' ? '' : '(?!\\.)') + escapeStringForRx(pattern).replace(RX_ESCAPED_GLOB, '.*')
}

const readdirWithFileTypes = fs.Dirent
  ? (dir) => fs.readdir(dir, { withFileTypes: true }).catch(invariably.emptyArray)
  : (dir) =>
    fs
      .readdir(dir)
      .catch(invariably.emptyArray)
      .then((names) =>
        Promise.all(
          names.map((name) =>
            isDirectory(dir + '/' + name).then((result) => ({ name, isDirectory: invariably[result] }))
          )
        )
      )

function retrievePathFs (base, { path }, subpath) {
  return fs
    .access(base + '/' + joinPath(path, subpath))
    .then(invariably.true)
    .catch(invariably.false)
}

function retrievePathGit (repo, { oid }, filepath) {
  return git.readObject({ ...repo, oid, filepath, format: 'deflated' }).catch(invariably.void)
}

function joinPath (parent, child) {
  return parent ? parent + '/' + child : child
}

module.exports = {
  fs: (baseDir, patterns) => resolvePathGlobs(baseDir, patterns, listDirentsFs, retrievePathFs),
  git: (repo, oid, patterns) => resolvePathGlobs(repo, patterns, listDirentsGit, retrievePathGit, { oid }),
}
