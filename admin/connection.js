const express = require('express');
const {default : AdminBro} = require('admin-bro');
const mongoose = require('mongoose');
const buildAdminRouter = require('./admin.router');
const options = require('./admin.options');
const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017/MyProject';

const run = async (MongooseDb) => {
    // const mongooseDb = await mongoose.connect(url, {
    //     useNewUrlParser : true, 
    //     useUnifiedTopology : true
    // })
    // const admin = new AdminBro({
    //     databases : [mongooseDb]
    // });
    // console.log(MongooseDb);
    const admin = new AdminBro(options)
    const router = buildAdminRouter(admin);
    app.use(admin.options.rootPath, router);
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`)
    });
};

module.exports = run;