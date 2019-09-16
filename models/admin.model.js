const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Admin = mongoose.model('Admin', new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
}).set('toJSON', { virtuals: true }));

exports.Admin = Admin;