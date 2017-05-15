// var seneca = require('seneca')()
//     .use(require('./services/math'))
//     .listen(3000);

var Seneca = require('seneca');
var Express = require('express');
var Web = require('seneca-web');

var Routes = [
  {
    prefix: '/api',
    pin: 'role:api,cmd:*',
    map: {
      home: { GET: true },
    },
  },
  {
    prefix: '/math',
    pin: 'role:math,cmd:*',
    map: {
      sum: { GET: true },
    },
  }];
var seneca = Seneca()
    .use(require('./services/math'));

var config = {
  routes: Routes,
  adapter: require('seneca-web-adapter-express'),
  context: Express(),
};

seneca.client()
    .use(Web, config)
    .ready(() => {
      var server = seneca.export('web/context')();
      server.listen('4000', () => {
        console.log('server started on: 4000');
      });
    });

seneca.add({ role: 'api', cmd: 'home' }, function(args, done) {
  done(null, { response: 'hey' });
});
