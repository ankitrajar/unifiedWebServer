require('./models/db');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const serviceController = require('./controller/serviceController');
const loginController = require('./controller/loginController');

const app = express();

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(bodyParser.json());

app.use(function (error, req, res, next) {
    if(error instanceof SyntaxError){
        return res.status(400).send('ERROR 400: Bad Request!!!');
      } 
    next();
});

app.set('views',path.join(__dirname,'/views/'));
app.engine('hbs',expressHandlebars({
    extname:'hbs',
    defaultLayout:'mainLayout',
    layoutsDir:__dirname + '/views/layouts/'
}));

app.set('view engine','hbs');

const port = process.env.PORT || 5000;
app.listen(port,(err) => {
        console.log(`Server is listening on Port ${port}`);
});

app.use('/admin',serviceController);
app.use('/',loginController);
app.use('/login',loginController);