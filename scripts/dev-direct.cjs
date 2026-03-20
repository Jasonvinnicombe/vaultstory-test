const { startServer } = require('../node_modules/next/dist/server/lib/start-server');

startServer({
  dir: process.cwd(),
  port: Number(process.env.PORT || 3000),
  isDev: true,
  hostname: process.env.HOSTNAME || '127.0.0.1',
  allowRetry: true,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
