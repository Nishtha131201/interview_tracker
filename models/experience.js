const mongoose = require('mongoose');
const Company = require('./Company');

const ExperienceSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'user',
        required : true
    },
    branch : {
        type : String,
    },
    year : {
        type : Number,
    },
    company : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'company',
        required : true
    },
    experience : {
        type : String
    },
    approved : {
        type : Boolean
    }

});


const Experience = mongoose.model('experience', ExperienceSchema);

module.exports = Experience;