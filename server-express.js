import Seneca from 'seneca';
import Express from 'express';
import Web from 'seneca-web';

import findPort from './common/findPort';
import Login, { route as LoginRoute } from './services/login';

const PORT = process.argv[2] || process.env.PORT || 4000;

const config = {
  routes: [LoginRoute],
  adapter: require('seneca-web-adapter-express'),
  context: Express(),
};

const seneca = Seneca({
  debug: {
    // undead: process.env.NODE_ENV === 'production',
    undead: false,
  },
})
  .error(function(err) {
    console.error('FATAL ERROR!', err);
  })
  .use(Login)
  .use(Web, config)
  .ready(() => {
    findPort(PORT)
      .then((goodport) => {
        process.env.PORT = goodport;
        const server = seneca.export('web/context')();
        server.listen(goodport, () => {
          console.log(`[?] server started on: ${goodport}`);
        });
      });
  });
