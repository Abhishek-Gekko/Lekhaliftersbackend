const mongoose = require("mongoose");

const EnquiryScheme = new mongoose.Schema({
    name:{
        type : String,
        require : true
    },
    email:{
        type : String,
        require : true
    },
    phone : {
        type : String,
        require : true
    },

    message : {
        type : String,
        require : true
    },

    createdAt : {
        type : Date,
        default : Date.now
    }
});

const Enquiry = mongoose.model("Enquiry",EnquiryScheme);

module.exports = Enquiry;