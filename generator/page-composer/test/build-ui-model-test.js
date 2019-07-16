/* eslint-env mocha */
'use strict'

const { expect, expectCalledWith, spy } = require('../../../test/test-utils')
const { buildUiModel, buildSiteUiModel, buildPageUiModel } = require('@antora/page-composer')
const { version: VERSION } = require('@antora/page-composer/package.json')

describe('build UI model', () => {
  let playbook
  let component
  let components
  let contentCatalog
  let file
  let menu
  let navigationCatalog

  beforeEach(() => {
    playbook = {
      site: {
        title: 'Docs Site',
      },
      ui: {
        outputDir: '_/',
      },
    }

    components = [
      {
        name: 'component-c',
        title: 'Component C',
      },
      {
        name: 'the-component',
        title: 'The Component',
        url: '/the-component/1.0/index.html',
        versions: [
          {
            version: '1.0',
            title: 'The Component',
            url: '/the-component/1.0/index.html',
            displayVersion: 'Io',
          },
        ],
      },
      {
        name: 'component-b',
        title: 'Component B',
      },
    ]

    component = components[1]

    contentCatalog = {
      getComponent: spy((name) => component),
      getComponentVersion: (component, version) => {
        if (!component.versions) component = this.getComponent(component)
        return component.versions.find((candidate) => candidate.version === version)
      },
      getComponentMapSortedBy: spy((property) =>
        components
          .slice(0)
          .sort((a, b) => a[property].localeCompare(b[property]))
          .reduce((accum, it) => {
            accum[it.name] = it
            return accum
          }, {})
      ),
      getSiteStartPage: spy(() => undefined),
    }

    menu = []

    navigationCatalog = {
      getNavigation: spy((name, version) => menu),
    }

    file = {
      contents: Buffer.from('contents'),
      src: {
        path: 'modules/ROOT/pages/the-page.adoc',
        component: 'the-component',
        version: '1.0',
        module: 'ROOT',
        relative: 'the-page.adoc',
      },
      pub: {
        url: '/the-component/1.0/the-page.html',
        rootPath: '../..',
      },
    }
  })

  describe('buildSiteUiModel()', () => {
    it('should set title property to value of site.title property from playbook', () => {
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(model.title).to.equal('Docs Site')
    })

    it('should set keys property to an empty object if keys property is missing from the playbook', () => {
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(model.keys).to.exist()
      expect(model.keys).to.eql({})
    })

    it('should populate keys property with non-empty key values in site.keys property from playbook', () => {
      playbook.site.keys = {
        googleAnalytics: 'UA-XXXXXXXX-1',
        swiftype: undefined,
      }
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(model.keys).to.eql({ googleAnalytics: 'UA-XXXXXXXX-1' })
    })

    it('should set components property to map of components from content catalog sorted by title', () => {
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(contentCatalog.getComponentMapSortedBy).to.have.been.called()
      expect(Object.keys(model.components)).to.have.lengthOf(3)
      const componentTitles = Object.values(model.components).map((component) => component.title)
      expect(componentTitles).to.eql(['Component B', 'Component C', 'The Component'])
    })

    it('should be able to access navigation for any component version from UI model', () => {
      const component = contentCatalog.getComponent('the-component')
      menu.push({
        order: 0,
        root: true,
        items: [
          {
            content: 'The Page',
            url: '/the-component/1.0/the-page.html',
            urlType: 'internal',
          },
        ],
      })
      component.versions[0].navigation = navigationCatalog.getNavigation('the-component', '1.0')
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(model.components['the-component'].versions[0].navigation).to.exist()
      expect(model.components['the-component'].versions[0].navigation.length).to.equal(1)
      expect(model.components['the-component'].versions[0].navigation[0]).to.equal(menu[0])
    })

    it('should not set url property if site.url property is not set in playbook', () => {
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(model.url).to.not.exist()
    })

    it('should set url property if site.url property is set in playbook', () => {
      playbook.site.url = 'https://example.com'
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(model.url).to.equal('https://example.com')
    })

    it('should remove trailing slash from site URL before assigning to url property', () => {
      playbook.site.url = 'https://example.com/'
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(model.url).to.equal('https://example.com')
    })

    it('should not set homeUrl property if site start page is not defined', () => {
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(contentCatalog.getSiteStartPage).to.have.been.called()
      expect(model.homeUrl).to.not.exist()
    })

    it('should set homeUrl property to url of site start page', () => {
      const startPage = {
        src: {
          family: 'page',
        },
        pub: { url: '/path/to/home.html' },
      }
      contentCatalog.getSiteStartPage = spy(() => startPage)
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(contentCatalog.getSiteStartPage).to.have.been.called()
      expect(model.homeUrl).to.equal('/path/to/home.html')
    })

    it('should set homeUrl property to url of page to which site start page alias points', () => {
      const startPage = {
        src: {
          family: 'alias',
        },
        rel: {
          pub: { url: '/path/to/home.html' },
        },
      }
      contentCatalog.getSiteStartPage = spy(() => startPage.rel)
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(contentCatalog.getSiteStartPage).to.have.been.called()
      expect(model.homeUrl).to.equal('/path/to/home.html')
    })

    it('should set defaultLayout property on ui property to "default" by default', () => {
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(model.ui.defaultLayout).to.equal('default')
    })

    it('should set defaultLayout property on ui property to value of ui.defaultLayout from playbook', () => {
      playbook.ui.defaultLayout = 'article'
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(model.ui.defaultLayout).to.equal('article')
    })

    it('should set url property on ui property to root relative path (sans trailing slash)', () => {
      const model = buildSiteUiModel(playbook, contentCatalog)
      expect(model.ui.url).to.equal('/_')
    })
  })

  describe('buildPageUiModel()', () => {
    let site

    beforeEach(() => {
      site = {
        title: 'Docs Site',
        ui: {},
      }
    })

    it('should set component property to component from content catalog', () => {
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expectCalledWith(contentCatalog.getComponent, ['the-component'])
      expect(model.component).to.exist()
      expect(model.component.name).to.equal('the-component')
    })

    it('should set componentVersion property to component version from content catalog', () => {
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.componentVersion).to.exist()
      expect(model.componentVersion).to.equal(component.versions[0])
    })

    it('should set the module and version properties to values from file src object', () => {
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.module).to.exist()
      expect(model.module).to.equal('ROOT')
      expect(model.version).to.exist()
      expect(model.version).to.equal('1.0')
      expect(model.displayVersion).to.equal(model.componentVersion.displayVersion)
    })

    it('should set origin property to value from file src object', () => {
      file.src.origin = {
        type: 'git',
        url: 'git@github.com:foo/bar.git',
        branch: 'master',
        editUrlPattern: 'https://github.com/foo/bar/edit/master/%s',
      }
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.origin).to.exist()
      expect(model.origin).to.equal(file.src.origin)
    })

    it('should set url property to pub url of file', () => {
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.url).to.equal('/the-component/1.0/the-page.html')
    })

    it('should set contents property to contents of file', () => {
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.contents).to.equal(file.contents)
    })

    it('should set canonicalUrl property based on pub url of file if file has no versions', () => {
      site.url = 'http://example.com'
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.canonicalUrl).to.equal('http://example.com/the-component/1.0/the-page.html')
    })

    it('should set home property to false if url of page does not match site homeUrl property', () => {
      site.homeUrl = '/path/to/home.html'
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.home).to.be.false()
    })

    it('should set home property to true if url of page matches site homeUrl property', () => {
      site.homeUrl = file.pub.url
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.home).to.be.true()
    })

    it('should set title, description, and keyword based on AsciiDoc attributes', () => {
      file.asciidoc = {
        doctitle: 'The Page Title',
        attributes: {
          description: 'A description of this page',
          keywords: 'keyword-a, keyword-b',
        },
      }
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.title).to.equal(file.asciidoc.doctitle)
      expect(model.description).to.equal(file.asciidoc.attributes.description)
      expect(model.keywords).to.equal(file.asciidoc.attributes.keywords)
    })

    it('should derive value of attributes property based on AsciiDoc attributes prefixed with page-', () => {
      file.asciidoc = {
        attributes: {
          'page-foo': 'bar',
          'page-tags': 'basics,guide',
        },
      }
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.attributes).to.eql({
        foo: 'bar',
        tags: 'basics,guide',
      })
    })

    it('should set layout property to value of page-layout attribute', () => {
      file.asciidoc = {
        attributes: { 'page-layout': 'chapter' },
      }
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.layout).to.equal('chapter')
    })

    it('should set layout property to default layout if the page-layout attribute is not specified', () => {
      site.ui.defaultLayout = 'default'
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.layout).to.equal('default')
    })

    it('should set navigation property to empty array if no navigation is defined for component version', () => {
      menu = undefined
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.navigation).to.exist()
      expect(model.navigation).to.be.empty()
    })

    it('should set navigation property to menu in navigation catalog', () => {
      menu.push({
        order: 0,
        root: true,
        items: [
          {
            content: 'Item',
          },
        ],
      })
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expectCalledWith(navigationCatalog.getNavigation, ['the-component', '1.0'])
      expect(model.navigation).to.exist()
      expect(model.navigation).to.equal(menu)
    })

    it('should set breadcrumbs property to path of page in navigation tree', () => {
      let itemB
      let itemC
      menu.push({
        order: 0,
        root: true,
        content: 'Nav Title',
        url: '/the-component/1.0/index.html',
        urlType: 'internal',
        items: [
          {
            content: 'Page A',
            url: '/the-component/1.0/page-a.html',
            urlType: 'internal',
          },
          (itemB = {
            content: 'Page B',
            url: '/the-component/1.0/page-b.html',
            urlType: 'internal',
            items: [
              (itemC = {
                content: 'The Page',
                url: '/the-component/1.0/the-page.html',
                urlType: 'internal',
              }),
              {
                content: 'Page D',
                url: '/the-component/1.0/page-d.html',
                urlType: 'internal',
              },
            ],
          }),
        ],
      })
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.breadcrumbs).to.exist()
      expect(model.breadcrumbs).to.have.lengthOf(3)
      expect(model.breadcrumbs[0]).to.equal(menu[0])
      expect(model.breadcrumbs[1]).to.equal(itemB)
      expect(model.breadcrumbs[2]).to.equal(itemC)
    })

    it('should include non-link entry in breadcrumbs', () => {
      let category
      menu.push({
        order: 0,
        root: true,
        content: 'Nav Title',
        url: '/the-component/1.0/index.html',
        urlType: 'internal',
        items: [
          {
            content: 'Page A',
            url: '/the-component/1.0/page-a.html',
            urlType: 'internal',
          },
          (category = {
            content: 'Category B',
            items: [
              {
                content: 'The Page',
                url: '/the-component/1.0/the-page.html',
                urlType: 'internal',
              },
              {
                content: 'Page B',
                url: '/the-component/1.0/page-b.html',
                urlType: 'internal',
              },
            ],
          }),
        ],
      })
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.breadcrumbs).to.include(category)
    })

    it('should drop first breadcrumb item if nav tree has no title', () => {
      menu.push({
        order: 0,
        root: true,
        items: [
          {
            content: 'The Page',
            url: '/the-component/1.0/the-page.html',
            urlType: 'internal',
          },
        ],
      })
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.breadcrumbs).to.exist()
      expect(model.breadcrumbs).to.have.lengthOf(1)
      expect(model.breadcrumbs[0]).to.equal(menu[0].items[0])
    })

    it('should create breadcrumb entry for current page if entry not found in any navigation tree', () => {
      file.asciidoc = {
        doctitle: 'The Page Title',
      }
      menu.push({
        order: 0,
        root: true,
        items: [
          {
            content: 'Not The Page',
            url: '/the-component/1.0/not-the-page.html',
            urlType: 'internal',
          },
        ],
      })
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.breadcrumbs).to.exist()
      expect(model.breadcrumbs).to.have.lengthOf(1)
      expect(model.breadcrumbs[0]).to.eql({
        content: 'The Page Title',
        url: file.pub.url,
        urlType: 'internal',
        discrete: true,
      })
    })

    it('should use breadcrumb path of first occurrence of page in nav tree', () => {
      let itemA
      let itemC1
      menu.push({
        order: 0,
        root: true,
        content: 'Nav Title',
        url: '/the-component/1.0/index.html',
        urlType: 'internal',
        items: [
          (itemA = {
            content: 'Page A',
            url: '/the-component/1.0/page-a.html',
            urlType: 'internal',
            items: [
              (itemC1 = {
                content: 'The Page',
                url: '/the-component/1.0/the-page.html',
                urlType: 'internal',
              }),
              {
                content: 'Page B',
                url: '/the-component/1.0/page-b.html',
                urlType: 'internal',
              },
            ],
          }),
          {
            content: 'The Page',
            url: '/the-component/1.0/the-page.html',
            urlType: 'internal',
          },
        ],
      })
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.breadcrumbs).to.exist()
      expect(model.breadcrumbs).to.have.lengthOf(3)
      expect(model.breadcrumbs[0]).to.equal(menu[0])
      expect(model.breadcrumbs[1]).to.equal(itemA)
      expect(model.breadcrumbs[2]).to.equal(itemC1)
    })

    it('should use breadcrumb path of first occurrence of page in any nav tree', () => {
      let itemC1
      menu.push({
        order: 0,
        root: true,
        content: 'First Nav Title',
        url: '/the-component/1.0/index.html',
        urlType: 'internal',
        items: [
          (itemC1 = {
            content: 'The Page',
            url: '/the-component/1.0/the-page.html',
            urlType: 'internal',
          }),
        ],
      })
      menu.push({
        order: 1,
        root: true,
        content: 'Second Nav Title',
        url: '/the-component/1.0/other.html',
        urlType: 'internal',
        items: [
          {
            content: 'The Page',
            url: '/the-component/1.0/the-page.html',
            urlType: 'internal',
          },
        ],
      })
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.breadcrumbs).to.exist()
      expect(model.breadcrumbs).to.have.lengthOf(2)
      expect(model.breadcrumbs[0]).to.equal(menu[0])
      expect(model.breadcrumbs[1]).to.equal(itemC1)
    })

    it('should find entry in navigation tree even when URL of all matching entries contain fragments', () => {
      let item1
      menu.push({
        order: 0,
        root: true,
        items: [
          (item1 = {
            content: 'The Page (top)',
            hash: '#_top',
            url: '/the-component/1.0/the-page.html#_top',
            urlType: 'internal',
            items: [
              {
                content: 'The Page (section)',
                hash: '#_section',
                url: '/the-component/1.0/the-page.html#_section',
                urlType: 'internal',
              },
              {
                content: 'Page B',
                url: '/the-component/1.0/page-b.html',
                urlType: 'internal',
              },
            ],
          }),
          {
            content: 'Page A',
            url: '/the-component/1.0/page-a.html',
            urlType: 'internal',
          },
        ],
      })
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.breadcrumbs).to.exist()
      expect(model.breadcrumbs).to.have.lengthOf(1)
      expect(model.breadcrumbs[0]).to.equal(item1)
    })

    it('should find entry in navigation tree even when URL of first matching entry contains a fragment', () => {
      let item1
      menu.push({
        order: 0,
        root: true,
        items: [
          (item1 = {
            content: 'The Page (section)',
            hash: '#_section',
            url: '/the-component/1.0/the-page.html#_section',
            urlType: 'internal',
            items: [
              {
                content: 'The Page',
                url: '/the-component/1.0/the-page.html',
                urlType: 'internal',
              },
              {
                content: 'Page B',
                url: '/the-component/1.0/page-b.html',
                urlType: 'internal',
              },
            ],
          }),
          {
            content: 'Page A',
            url: '/the-component/1.0/page-a.html',
            urlType: 'internal',
          },
        ],
      })
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.breadcrumbs).to.exist()
      expect(model.breadcrumbs).to.have.lengthOf(1)
      expect(model.breadcrumbs[0]).to.equal(item1)
    })

    it('should set next, previous, and parent references based on location of page in navigation tree', () => {
      let parent
      let previous
      let next
      menu.push({
        order: 0,
        root: true,
        content: 'Nav Title',
        url: '/the-component/1.0/index.html',
        urlType: 'internal',
        items: [
          {
            content: 'Page A',
            url: '/the-component/1.0/page-a.html',
            urlType: 'internal',
          },
          (parent = {
            content: 'Page B',
            url: '/the-component/1.0/page-b.html',
            urlType: 'internal',
            items: [
              (previous = {
                content: 'Page C',
                url: '/the-component/1.0/page-c.html',
                urlType: 'internal',
              }),
              {
                content: 'The Page',
                url: '/the-component/1.0/the-page.html',
                urlType: 'internal',
              },
              (next = {
                content: 'Page D',
                url: '/the-component/1.0/page-d.html',
                urlType: 'internal',
              }),
            ],
          }),
        ],
      })
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.parent).to.exist()
      expect(model.parent).to.equal(parent)
      expect(model.previous).to.exist()
      expect(model.previous).to.equal(previous)
      expect(model.next).to.exist()
      expect(model.next).to.equal(next)
    })

    it('should skip over non-link entries when computing related page references', () => {
      let parent
      let previous
      let next
      menu.push(
        (parent = {
          order: 0,
          root: true,
          content: 'Nav Title',
          url: '/the-component/1.0/index.html',
          urlType: 'internal',
          items: [
            {
              content: 'Page A',
              url: '/the-component/1.0/page-a.html',
              urlType: 'internal',
            },
            {
              content: 'Category B',
              items: [
                (previous = {
                  content: 'Page C',
                  url: '/the-component/1.0/page-c.html',
                  urlType: 'internal',
                }),
                {
                  content: 'Text-only Entry',
                },
                {
                  content: 'The Page',
                  url: '/the-component/1.0/the-page.html',
                  urlType: 'internal',
                },
                {
                  content: 'Text-only Entry',
                },
                (next = {
                  content: 'Page D',
                  url: '/the-component/1.0/page-d.html',
                  urlType: 'internal',
                }),
              ],
            },
          ],
        })
      )
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.parent).to.exist()
      expect(model.parent).to.equal(parent)
      expect(model.previous).to.exist()
      expect(model.previous).to.equal(previous)
      expect(model.next).to.exist()
      expect(model.next).to.equal(next)
    })

    it('should seek upwards in hierarchy to find adjacent related pages if current page has no sibling links', () => {
      let next
      let previous
      menu.push({
        order: 0,
        root: true,
        content: 'Nav Title',
        url: '/the-component/1.0/index.html',
        urlType: 'internal',
        items: [
          {
            content: 'Page A',
            url: '/the-component/1.0/page-a.html',
            urlType: 'internal',
          },
          (previous = {
            content: 'Page B',
            url: '/the-component/1.0/page-b.html',
            urlType: 'internal',
            items: [
              {
                content: 'Text-only Before',
              },
              {
                content: 'The Page',
                url: '/the-component/1.0/the-page.html',
                urlType: 'internal',
              },
              {
                content: 'Text-only After',
              },
            ],
          }),
          (next = {
            content: 'Page C',
            url: '/the-component/1.0/page-c.html',
            urlType: 'internal',
          }),
        ],
      })
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.next).to.exist()
      expect(model.next).to.equal(next)
      expect(model.previous).to.exist()
      expect(model.previous).to.equal(previous)
    })

    it('should not set versions property if component only has one version', () => {
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.versions).to.not.exist()
    })

    it('should set versions property based on versions of page from catalog', () => {
      component.url = '/the-component/2.0/index.html'
      component.versions.unshift({
        version: '2.0',
        title: 'The Component',
        url: '/the-component/2.0/index.html',
      })
      component.versions.push({
        version: '1.0-beta',
        title: 'The Component',
        url: '/the-component/1.0-beta/index.html',
      })
      component.latest = component.versions[0]
      const files = {
        '1.0-beta': {
          src: {
            path: 'modules/ROOT/pages/the-page.adoc',
            component: 'the-component',
            version: '1.0-beta',
            module: 'ROOT',
          },
          pub: {
            url: '/the-component/1.0-beta/the-page.html',
          },
        },
        '1.0': file,
        '2.0': {
          src: {
            path: 'modules/ROOT/pages/the-page.adoc',
            component: 'the-component',
            version: '2.0',
            module: 'ROOT',
          },
          pub: {
            url: '/the-component/2.0/the-page.html',
          },
        },
      }
      contentCatalog.getById = spy((filter) => files[filter.version])
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expectCalledWith(contentCatalog.getById, [
        {
          component: 'the-component',
          module: 'ROOT',
          family: 'page',
          relative: 'the-page.adoc',
          version: '2.0',
        },
      ])
      expectCalledWith(
        contentCatalog.getById,
        [
          {
            component: 'the-component',
            module: 'ROOT',
            family: 'page',
            relative: 'the-page.adoc',
            version: '1.0',
          },
        ],
        1
      )
      expectCalledWith(
        contentCatalog.getById,
        [
          {
            component: 'the-component',
            module: 'ROOT',
            family: 'page',
            relative: 'the-page.adoc',
            version: '1.0-beta',
          },
        ],
        2
      )
      expect(model.versions).to.exist()
      expect(model.versions).to.have.lengthOf(3)
      expect(model.versions).to.eql([
        { latest: true, version: '2.0', title: 'The Component', url: '/the-component/2.0/the-page.html' },
        { version: '1.0', displayVersion: 'Io', title: 'The Component', url: '/the-component/1.0/the-page.html' },
        { version: '1.0-beta', title: 'The Component', url: '/the-component/1.0-beta/the-page.html' },
      ])
      expect(model.latest).to.eql(model.versions[0])
    })

    it('should propogate prerelease and display version from component version to page version', () => {
      component.versions.unshift({
        version: '2.0',
        prerelease: 'Beta',
        displayVersion: '2.0 Beta',
        title: 'The Component',
        url: '/the-component/2.0/index.html',
      })
      component.latest = component.versions[1]
      const files = {
        '1.0': file,
        '2.0': {
          src: {
            path: 'modules/ROOT/pages/the-page.adoc',
            component: 'the-component',
            version: '2.0',
            module: 'ROOT',
          },
          pub: {
            url: '/the-component/2.0/the-page.html',
          },
        },
      }
      contentCatalog.getById = spy((filter) => files[filter.version])
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expectCalledWith(contentCatalog.getById, [
        {
          component: 'the-component',
          module: 'ROOT',
          family: 'page',
          relative: 'the-page.adoc',
          version: '2.0',
        },
      ])
      expectCalledWith(
        contentCatalog.getById,
        [
          {
            component: 'the-component',
            module: 'ROOT',
            family: 'page',
            relative: 'the-page.adoc',
            version: '1.0',
          },
        ],
        1
      )
      expect(model.versions).to.exist()
      expect(model.versions).to.have.lengthOf(2)
      expect(model.versions).to.eql([
        {
          version: '2.0',
          displayVersion: '2.0 Beta',
          prerelease: 'Beta',
          title: 'The Component',
          url: '/the-component/2.0/the-page.html',
        },
        {
          latest: true,
          version: '1.0',
          displayVersion: 'Io',
          title: 'The Component',
          url: '/the-component/1.0/the-page.html',
        },
      ])
      expect(model.latest).to.eql(model.versions[1])
    })

    it('should add sparse entry in value of versions property if page is missing for version', () => {
      component.url = '/the-component/2.0/index.html'
      component.versions.unshift({
        version: '2.0',
        title: 'The Component',
        url: '/the-component/2.0/index.html',
      })
      component.versions.push({
        version: '1.0-beta',
        title: 'The Component',
        url: '/the-component/1.0-beta/index.html',
      })
      const files = {
        '1.0': file,
        '2.0': {
          src: {
            path: 'modules/ROOT/pages/the-page.adoc',
            component: 'the-component',
            version: '2.0',
            module: 'ROOT',
          },
          pub: {
            url: '/the-component/2.0/the-page.html',
          },
        },
      }
      contentCatalog.getById = spy((filter) => files[filter.version])
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expectCalledWith(contentCatalog.getById, [
        {
          component: 'the-component',
          module: 'ROOT',
          family: 'page',
          relative: 'the-page.adoc',
          version: '2.0',
        },
      ])
      expectCalledWith(
        contentCatalog.getById,
        [
          {
            component: 'the-component',
            module: 'ROOT',
            family: 'page',
            relative: 'the-page.adoc',
            version: '1.0',
          },
        ],
        1
      )
      expectCalledWith(
        contentCatalog.getById,
        [
          {
            component: 'the-component',
            module: 'ROOT',
            family: 'page',
            relative: 'the-page.adoc',
            version: '1.0-beta',
          },
        ],
        2
      )
      expect(model.versions).to.exist()
      expect(model.versions).to.have.lengthOf(3)
      expect(model.versions).to.eql([
        { version: '2.0', title: 'The Component', url: '/the-component/2.0/the-page.html' },
        { version: '1.0', displayVersion: 'Io', title: 'The Component', url: '/the-component/1.0/the-page.html' },
        { version: '1.0-beta', title: 'The Component', url: '/the-component/1.0-beta/index.html', missing: true },
      ])
    })

    it('should set canonicalUrl property to url of latest version', () => {
      site.url = 'http://example.com'
      component.versions.unshift({
        version: '2.0',
        prerelease: true,
        title: 'The Component',
        url: '/the-component/2.0/index.html',
      })
      const files = {
        '1.0': file,
        '2.0': {
          src: {
            path: 'modules/ROOT/pages/the-page.adoc',
            component: 'the-component',
            version: '2.0',
            module: 'ROOT',
          },
          pub: {
            url: '/the-component/2.0/the-page.html',
          },
        },
      }
      contentCatalog.getById = spy((filter) => files[filter.version])
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.canonicalUrl).to.exist()
      expect(model.canonicalUrl).to.equal('http://example.com/the-component/1.0/the-page.html')
    })

    it('should not set canonicalUrl property if all versions are prereleases', () => {
      site.url = 'http://example.com'
      component.versions[0].prerelease = true
      component.versions.unshift({
        version: '2.0',
        prerelease: true,
        title: 'The Component',
        url: '/the-component/2.0/index.html',
      })
      const files = {
        '1.0': file,
        '2.0': {
          src: {
            path: 'modules/ROOT/pages/the-page.adoc',
            component: 'the-component',
            version: '2.0',
            module: 'ROOT',
          },
          pub: {
            url: '/the-component/2.0/the-page.html',
          },
        },
      }
      contentCatalog.getById = spy((filter) => files[filter.version])
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.canonicalUrl).to.not.exist()
    })

    it('should not set canonicalUrl property if only versions is a prerelease', () => {
      site.url = 'http://example.com'
      component.versions[0].prerelease = true
      const model = buildPageUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.versions).to.not.exist()
      expect(model.canonicalUrl).to.not.exist()
    })
  })

  describe('buildUiModel()', () => {
    let site

    beforeEach(() => {
      site = {
        ui: {
          url: '/_',
        },
      }
    })

    it('should set site property to provided site model', () => {
      const model = buildUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.site).to.exist()
      expect(model.site).to.equal(site)
    })

    it('should set env property to provided env object', () => {
      const model = buildUiModel(file, contentCatalog, navigationCatalog, site, process.env)
      expect(model.env).to.exist()
      expect(model.env).to.equal(process.env)
    })

    it('should compute and set page property', () => {
      const model = buildUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.page).to.exist()
      expect(model.page.url).to.equal(file.pub.url)
    })

    it('should set antoraVersion property to version of Antora', () => {
      const model = buildUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.antoraVersion).to.exist()
      expect(model.antoraVersion).to.equal(VERSION)
    })

    it('should set siteRootPath property to pub.rootPath of file', () => {
      const model = buildUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.siteRootPath).to.exist()
      expect(model.siteRootPath).to.equal(file.pub.rootPath)
    })

    it('should set uiRootPath property relative to page', () => {
      const model = buildUiModel(file, contentCatalog, navigationCatalog, site)
      expect(model.uiRootPath).to.exist()
      expect(model.uiRootPath).to.equal('../../_')
    })
  })
})
