import {MongoClient} from 'mongodb';

let co = require('co');

co(function*() {
    let db = yield MongoClient.connect(process.env.MONGODB_URI);
    db.close();
}).catch((err: Error) => {
    console.log(err.stack);
});
