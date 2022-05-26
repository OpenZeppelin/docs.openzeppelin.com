const ls = require('live-server');
const enableDestroy = require('server-destroy');

export default function serve(root, opts) {
  let server;
  const handleExit = () => server?.destroy();
  process.on('exit', handleExit);
  process.on('SIGTERM', handleExit);
  return {
    writeBundle() {
      if (server) return;
      server = ls.start({ root, open: false, ...opts });
      enableDestroy(server);
    },
    closeWatcher: handleExit,
  };
}
