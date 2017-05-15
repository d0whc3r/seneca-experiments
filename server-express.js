import Seneca from 'seneca';
import Express from 'express';
import Web from 'seneca-web';
// import Routes from './common/routes';
import Login, { route as LoginRoute } from './services/login';
// import LoginAdmin from './services/loginadmin';

const PORT = process.argv[2] || 4000;


const config = {
  routes: [LoginRoute],
  adapter: require('seneca-web-adapter-express'),
  context: Express(),
};

const seneca = Seneca({ debug: { undead: true } })
    .error(function(err) {
      console.error('FATAL ERROR!', err);
    })
    .use(Login)
    // .use(LoginAdmin)
    .use(Web, config)
    .ready(() => {
      var server = seneca.export('web/context')();

      server.listen(PORT, () => {
        console.log('port', PORT, process.env.NODE_ENV);
        console.log(`server started on: ${PORT}`);
      });
    });