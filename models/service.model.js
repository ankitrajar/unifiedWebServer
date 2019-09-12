const mongoose = require('mongoose');
var validator = require("email-validator");

const serviceSchema = new mongoose.Schema({
    serviceName:{
        type:String,
        required: 'This field is required'
    },
});

// custom validation for email
//serviceSchema.path('email').validate((val) => {
//    return validator.validate(val);
//},'Invalid Email');

mongoose.model('Service',serviceSchema);