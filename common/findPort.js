import net from 'net';

const checkPort = (port) => new Promise((resolve, reject) => {
  const server = net.createServer();

  server.unref();
  server.on('error', reject);

  server.listen(port, () => {
    const port = server.address().port;
    server.close(() => {
      resolve(port);
    });
  });
});

const getPort = (port) => new Promise((resolve, reject) => {
  const MAX_PORT = 65535;
  checkPort(port)
    .then(resolve)
    .catch(() => {
      const nextport = port + 1;
      if (port <= MAX_PORT) {
        getPort(nextport)
          .then(resolve);
      } else {
        reject();
      }
    });
});

export default (preferredPort) => preferredPort ? getPort(preferredPort)
  .catch(() => getPort(0)) : getPort(0);
