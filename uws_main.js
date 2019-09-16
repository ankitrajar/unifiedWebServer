require('./models/db');
require('rootpath')();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('helpers/error-handler');
const expressHandlebars = require('express-handlebars');
const serviceController = require('./controller/serviceController');
const adminController = require('./controller/adminController');
const jwt = require('./helpers/jwt');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
//app.use(jwt());

app.set('views',path.join(__dirname,'/views/'));
app.engine('hbs',expressHandlebars({
    extname:'hbs',
    defaultLayout:'mainLayout',
    layoutsDir:__dirname + '/views/layouts/'
}));

app.set('view engine','hbs');

app.use('/service',serviceController);
app.use('/admin',adminController);


//Global error handler
app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? 80 : 5000;
app.listen(port,(err) => {
        console.log(`Server is listening on Port ${port}`);
});

