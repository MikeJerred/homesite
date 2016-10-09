var settings = require('../settings/task-settings.js');
var exec = require('child_process').exec;

var command = 'cd ./bower_components/highlight-js'
    + ' && npm install'
    + ' && node tools/build ' + settings.highlightLanguages;
    //+ ' && cd ../..');

exec(command, (err, stdout, stderr) => {
    console.log(stderr);
    console.log(stdout);

    if (err !== null) {
        console.log(err);
    }
});
