const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Login = mongoose.model('Admin');
const adminService = require('../helpers/adminService');

// routes
router.get('/', (req,res) => {
    res.render("login/adminLogin",{
    viewTitle:"Unified Web Service"
    });
    //getAll
});

//router.post("/login",async (req,res) => {
    //await addUser(req,res);
//    authenticate
//});

router.post("/login",authenticate);

async function addUser(req,res) {
   var login = new Login();
   login.username = req.body.userName;
   login.hash = req.body.adminPassword;
   try{
       login.validate();
   }catch(ex){
       console.log(ex.message);
   }
    await login.save((err,doc) => {
       if(!err){
        res.redirect('/service');
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
            res.redirect('service/');
          }
          console.log("Error occured during record insertion" + err);
       }
   });
}

//router.post('/authenticate', authenticate);
//router.post('/register', register);
//router.get('/current', getCurrent);
//router.get('/:id', getById);
//router.put('/:id', update);
//router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    console.log(req.body);
    console.log(adminService.authenticate(req.body));
    adminService.authenticate(req.body)
        .then(user => user ? res.redirect('service/') : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    adminService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    adminService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    adminService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    adminService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    adminService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    adminService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch(err.errors[field].path){
        case 'serviceName':
              body['serviceNameError'] = err.errors[field].message;
              break;
        default:
           break;
        }
    }
}