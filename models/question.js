const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    topic :{
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'topic',
        required : true
    },
    name : {
        type : String,
        require : true
    },
    link : {
        type : String,
        required : true
    },
    approved : {
        type : Boolean,
        default : false 
    }

});


const Question = mongoose.model('question', QuestionSchema);

module.exports = Question;