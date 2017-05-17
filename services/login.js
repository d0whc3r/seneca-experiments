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
      if (args.body) {
        parsed = JSON.parse(args.body, true);
      }
    } catch (error) {
      console.error('JSON ERROR', error);
      // return done(null, { error: 'Unknown credentials' });
    }
    let cookie = jwt.getCookie(request$.headers.cookie);
    let promise = null;
    if (!cookie) {
      // Login
      console.log('Login user', username);
      promise = auth.login(parsed)
        .then((data) => {
          const encrypted = jwt.genCookie(data);
          response$.setHeader('Cookie', encrypted);
          return data;
        });
    } else {
      // Check info
      console.log('check info', cookie);
      promise = auth.checkToken(cookie);
    }
    if (!promise) {
      return done(null, { error: 'Server error username/password' });
    }
    promise
      .then((data) => {
        done(null, data);
      })
      .catch(({ response }) => {
        done(null, { ...response.data });
      });
  });

  return { name };
};
