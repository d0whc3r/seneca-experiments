module.exports = [
  {
    prefix: '/auth',
    pin: 'role:auth,cmd:*',
    // map: {
    //   login: { GET: true },
    // },
  },
  {
    prefix: '/admin',
    pin: 'role:admin,cmd:*',
    // map: {
    //   validate: {
    //     POST: true,
    //     alias: '/manage',
    //   },
    // },
  },
];
