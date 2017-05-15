module.exports = {
  name: 'securityapi',
  script: './server-express.js',
  watch: process.env.NODE_ENV === 'development',
  args: '4000',
  max_memory_restart: '150M',
  interpreter: './node_modules/.bin/babel-node',
  env: {
    'NODE_ENV': process.env.NODE_ENV,
  },
};