import {MongoClient} from 'mongodb';

module MJ.Server.Api {
    let co = require('co');

    co(function*() {
        var db = yield MongoClient.connect(process.env.MONGODB_URI);
        db.close();
    }).catch((err: any) => {
        console.log(err.stack);
    });
}