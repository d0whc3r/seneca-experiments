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
    console.log('LOGIN!', options);
    _msg.response$.setHeader('Cookie', 'name=somecookie');
    console.log(_msg.response$._headers);
    // const x = seneca.client({
    //   host: 'localhost',
    //   port: 4001,
    //   type: 'web',
    // });
    // const xx = seneca.act({ role: 'auth', cmd: 'token', data: { user: 'username', pass: 'password' } }, console.log);
    done(null, {});
  });

  // seneca.add({ role: 'auth', cmd: 'token' }, (_msg, done) => {
  //   console.log('LOGINxx!');
  //   console.log(Object.keys(_msg), _msg.data);
  //   done(null, { });
  // });

  return { name };
};