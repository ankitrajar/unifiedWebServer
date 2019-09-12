const express = require('express');
const mongoose = require('mongoose');
const Service = mongoose.model('Service');
const router = express.Router();

router.get("/",(req,res) => {
    res.render("admin/addOrEdit",{
        viewTitle:"Add Service"
    });
});

router.post("/",async (req,res) => {
    if(req.body._id == ""){
        await insertRecord(req,res);
    }
    else{
        await updateRecord(req,res);
    }
});

async function insertRecord(req,res)
{
   var service = new Service();
   service.serviceName = req.body.serviceName;
    await service.save((err,doc) => {
       if(!err){
        res.redirect('admin/list');
       }
       else{
          if(err.name == "ValidationError"){
              handleValidationError(err,req.body);
              res.render("admin/addOrEdit",{
                  viewTitle:"Add Service",
                  service:req.body
              });
          }
          console.log("Error occured during record insertion" + err);
       }
   });
}

async function updateRecord(req,res)
{
    await Service.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('admin/list');
        }
        else{
            if(err.name == "ValidationError") {
                handleValidationError(err,req.body);
                res.render("admin/addOrEdit",{
                    viewTitle:'Update Service',
                    service:req.body
                });
            }
            else{
                console.log("Error occured in Updating the records" + err);
            }
        }
    });
}

router.get('/list', async (req,res) => {
    await Service.find((err,docs) => {
        if(!err) {
            res.render("admin/list",{
               list:docs
            });
        }
    });
});

router.get('/:id', async (req,res) => {
    await Service.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("admin/addOrEdit",{
                viewTitle: "Update Service",
                admin: doc
            });
        }
    });
});

router.get('/delete/:id', async (req,res) => {
    await Service.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/admin/list');
        }
        else{
            console.log("An error occured during the Delete Process" + err);
        }
    });
});

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

module.exports = router;