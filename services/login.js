import Jwt from '../common/jwt';
import Auth from '../common/auth';

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
  const jwt = new Jwt();
  const auth = new Auth();

  seneca.add({ role: 'auth', cmd: 'login' }, (_msg, done) => {
    const { request$, response$, args } = _msg;
    let parsed = null;
    try {
      parsed = JSON.parse(args.body, true);
    } catch (error) {
      console.error('JSON ERROR', error);
      return done(null, { error: 'Unknown credentials' });
    }
    let cookie = jwt.getCookie(request$.headers.cookie);
    console.log('cookie', cookie);
    let promise = null;
    if (!cookie) {
      // Login
      console.log('try login');
      promise = auth.login(parsed)
          .then((data) => {
            const encrypted = jwt.genCookie(data);
            // console.log('login data', data, encrypted);
            response$.setHeader('Cookie', encrypted);
            return data;
          });
      // if (cookie) {
      //   const encrypted = jwt.genCookie(cookie);
      //   response$.setHeader('Cookie', encrypted);
      // }
    } else {
      // Check info
      console.log('check info');
      promise = auth.checkToken(cookie);
    }
    if (!promise) {
      return done(null, { error: 'Server error username/password' });
    }
    promise
        .then((data) => {
          // console.log('resolved promise!', data);
          done(null, data);
        })
        .catch(({ response }) => {
          // console.log('catch!', response.data);
          done(null, { ...response.data });
        });
  });

  // seneca.add({ role: 'auth', cmd: 'token' }, (_msg, done) => {
  //   console.log('LOGINxx!');
  //   console.log(Object.keys(_msg), _msg.data);
  //   done(null, { });
  // });

  return { name };
};