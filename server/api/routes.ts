import * as router from './router';
//import * as requireAll from 'require-all';

const controllers = require('require-all')({
    dirname     :  __dirname,
    filter      :  /(.+Controller)\.js$/,
    recursive   : true
});

export default router.default;