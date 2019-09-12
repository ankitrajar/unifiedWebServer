const mongoose = require('mongoose');
var validator = require("email-validator");

const serviceSchema = new mongoose.Schema({
    serviceName:{
        type:String,
        required: 'This field is required'
    },
});

const loginSchema = new mongoose.Schema({
    userName:{
        type:String,
        unique: true
    },
    adminPassword:{
        type: String,
        unique: true
    }
});
// custom validation for email
//serviceSchema.path('email').validate((val) => {
//    return validator.validate(val);
//},'Invalid Email');

mongoose.model('Service',serviceSchema);
mongoose.model('Login',loginSchema);