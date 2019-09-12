const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/serviceDB";

mongoose.connect(url,{useNewUrlParser:true},(err) => {
    if(!err){ console.log("MongoDB Connection Succeeded");}
    else{
        console.log("An Error Occured");
    } 
});

require('./service.model');