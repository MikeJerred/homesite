const controllers = require('require-all')({
  dirname     :  __dirname,
  filter      :  /(.+Controller)\.js$/,
  recursive   : true
});

const router = require('./router');

export default router.default;