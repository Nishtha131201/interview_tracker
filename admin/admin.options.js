const {default : AdminBro} = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');

AdminBro.registerAdapter(AdminBroMongoose);

// const { Company} = require('./Data/company');
const User = require('../models/User');
const Topic = require('../models/topics');
const Question = require('../models/question');
const Company = require('../models/Company');
const Experience = require('../models/experience');

const options = {
    // databases : [mongooseDb]
    resources : [User, Topic, Question, Company, Experience],
    rootPath : '/admin',
};

module.exports = options;