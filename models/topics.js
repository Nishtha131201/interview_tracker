const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    name : {
        type:String, 
        required : true,
        unique : true

    },
    iconName : {
        type : String
    }
    
})

const Topic = mongoose.model('topic', TopicSchema);

module.exports = Topic;