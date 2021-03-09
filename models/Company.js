const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name : {
        type : String, 
        required : true
    },
    link : {
        type : String, 
    },
    img : {
        data : Buffer,
        contentType : String,
    },
    companyDetails : {
        type : String
    }

});


const Company = mongoose.model('company', CompanySchema);

module.exports = Company;