import net from 'net';

var portrange = 45032;

function getPort2(cb) {
  var port = portrange;
  portrange += 1;

  var server = net.createServer();
  server.listen(port, function(err) {
    server.once('close', function() {
      cb(port);
    });
    server.close();
  });
  server.on('error', function(err) {
    getPort(cb);
  });
}

function getPort(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(port, function(err) {
      server.once('close', function() {
        resolve(port);
      });
      server.close();
    });
    server.on('error', function(err) {
      reject(err);
    });
  });
}

async function findPort(port) {
  
  const port = await getPort(port);
}

export default function() {

}
