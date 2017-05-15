// module.exports = function(options) {
//   var seneca = this;
//   var name = 'math-service';
//
//   seneca.add({ role: 'math', cmd: 'sum' }, function(_msg, respond) {
//     var msg = _msg.args.query;
//     console.log('math msg:', _msg.args);
//     var sum = msg.left + msg.right;
//     respond(null, { answer: sum });
//   });
//
//   return { name };
// };

export const route = {
  prefix: '/auth',
  pin: 'role:auth,cmd:*',
  map: {
    login: {
      GET: true,
      POST: true,
    },
  },
};

export default function(options) {
  const seneca = this;
  const name = 'login-service';

  seneca.add({ role: 'auth', cmd: 'login' }, (_msg, done) => {
    console.log('LOGIN!');
    console.log(Object.keys(_msg), _msg.args);
    const x = seneca.client({
      host: 'localhost',
      port: 4001,
      type: 'web',
    });
    const xx = seneca.act({ role: 'auth', cmd: 'token', data: { user: 'username', pass: 'password' } }, console.log);
    done(null, { x, xx });
  });

  // seneca.add({ role: 'auth', cmd: 'token' }, (_msg, done) => {
  //   console.log('LOGINxx!');
  //   console.log(Object.keys(_msg), _msg.data);
  //   done(null, { });
  // });

  return { name };
};