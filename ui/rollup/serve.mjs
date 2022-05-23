const ls = require('live-server');
const enableDestroy = require('server-destroy');

export default function serve(root) {
  let server;
  const handleExit = () => server?.destroy();
  process.on('exit', handleExit);
  process.on('SIGTERM', handleExit);
  return {
    writeBundle() {
      if (server) return;
      server = ls.start({ root, open: false });
      enableDestroy(server);
    },
    closeWatcher: handleExit,
  };
}
