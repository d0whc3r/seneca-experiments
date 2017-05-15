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

  seneca.add({ role: 'auth', cmd: 'login' }, ({ request$, response$, args }, done) => {
    let parsed = null;
    try {
      parsed = JSON.parse(args.body, true);
      console.log('parsed', parsed);
    } catch (error) {
      console.error('JSON ERROR', error);
      return done(null, { error });
    }
    let cookie = jwt.getCookie(request$);
    console.log('cookie', cookie);
    let promise = null;
    if (!cookie) {
      // Login
      promise = auth.login(parsed);
      // .then((data) => {
      //   console.log('login data', data, jwt.genCookie(data));
      //   return data;
      // });
      // if (cookie) {
      //   const encrypted = jwt.genCookie(cookie);
      //   response$.setHeader('Cookie', encrypted);
      // }
    } else {
      // Check info
      promise = auth.checkToken(cookie.access_token);
    }
    if (!promise) {
      return done(null, { error: 'Server error username/password' });
    }
    promise
        .then((data) => {
          console.log('resolved promise!', data);
          done(null, data);
        })
        .catch(({ response }) => {
          console.log('catch!', response.data);
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