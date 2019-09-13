const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(process.env.MONGODB_URL || config.get('connectionString'), { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../models/user.model'),
    Admin: require('../models/admin.model'),
    Service: require('../models/service.model')
};
