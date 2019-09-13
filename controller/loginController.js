const express = require('express');
const mongoose = require('mongoose');
const Login = mongoose.model('Login');
const router = express.Router();

router.get("/",(req,res) => {
    res.render("login/adminLogin",{
        viewTitle:"Unified Web Service"
    });
});

router.post("/",async (req,res) => {
    await addUser(req,res);
});

async function addUser(req,res) {
   var login = new Login();
   login.userName = req.body.userName;
   login.adminPassword = req.body.adminPassword;
   try{
       login.validate();
   }catch(ex){
       console.log(ex.message);
   }
    await login.save((err,doc) => {
       if(!err){
        res.redirect('admin/');
       }
       else{
        
          if(err.name == "ValidationError" ){
              handleValidationError(err,req.body);
              res.render("login/adminLogin",{
                  viewTitle:"Unified Web Service",
                  login:req.body
              });
          }
          else if(err.name == "MongoError"){
            res.redirect('admin/');
          }
          console.log("Error occured during record insertion" + err);
       }
   });
}

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch(err.errors[field].path){
        case 'userName':
              body['userNameError'] = err.errors[field].message;
              break;
        default:
           break;
        }
    }
}

module.exports = router;