import proc from 'child_process';
import chokidar from 'chokidar';
import debounce from 'lodash.debounce';

export default function run(cmd, ...args) {
  let watcher;
  let outputPath;
  let opts = {};
  if (typeof args[args.length - 1] === 'object') {
    opts = args.pop();
  }
  const runCmd = () => proc.spawn(cmd, args, { stdio: 'inherit' });
  return {
    renderStart(outputOptions) {
      outputPath = outputOptions.dir || outputOptions.file;
    },
    writeBundle() {
      if (!opts.watch) {
        runCmd();
      } else if (!watcher) {
        watcher = chokidar.watch(opts.watch, {
          ignored: [outputPath].concat(opts.ignored),
        }).on('all', debounce(runCmd, 100));
      }
    },
  };
}
