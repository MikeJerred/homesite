import * as router from './router';

const controllers = require('require-all')({
    dirname     :  __dirname,
    filter      :  /(.+Controller)\.js$/,
    recursive   : true
});

export default router.default;