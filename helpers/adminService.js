  
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('models/db');
const Admin = db.Admin;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const AdminUser = await Admin.findOne({ username });
    if (AdminUser && bcrypt.compareSync(password, AdminUser.hash)) {
        const { hash, ...AdminUserWithoutHash } = AdminUser.toObject();
        const token = jwt.sign({ sub: AdminUser.id }, config.get('secret'));
        return {
            ...AdminUserWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await Admin.find().select('-hash');
}

async function getById(id) {
    return await Admin.findById(id).select('-hash');
}

async function create(AdminUserParam) {
    // validate
    if (await Admin.findOne({ username: AdminUserParam.username })) {
        throw 'Username "' + AdminUserParam.username + '" is already taken';
    }

    const AdminUser = new Admin(AdminUserParam);

    // hash password
    if (AdminUserParam.password) {
        AdminUser.hash = bcrypt.hashSync(AdminUserParam.password, 10);
    }

    // save user
    await AdminUser.save();
}

async function update(id, AdminUserParam) {
    const AdminUser = await Admin.findById(id);

    // validate
    if (!AdminUser) throw 'Admin User not found';
    if (AdminUser.username !== AdminUserParam.username && await Admin.findOne({ username: AdminUserParam.username })) {
        throw 'Username "' + AdminUserParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (AdminUserParam.password) {
        AdminUserParam.hash = bcrypt.hashSync(AdminUserParam.password, 10);
    }

    // copy AdminUserParam properties to AdminUser
    Object.assign(AdminUser, AdminUserParam);

    await AdminUser.save();
}

async function _delete(id) {
    await Admin.findByIdAndRemove(id);
}