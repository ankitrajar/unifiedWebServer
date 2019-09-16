const expressJwt = require('express-jwt');
const config = require('config');

module.exports = jwt;

function jwt() {
    const secret = config.get('secret');
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/user/authenticate',
            '/user/register',
            '/admin',
            '/admin/login',
            '/service',
            '/service/list',
            '/delete/:id'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};

function authorize(roles = []) {
    if(typeof roles === 'string') {
        roles = [roles];
    }
    return [
        expressJwt({ secret }),
        (req,res,next) => {
            if(roles.length && !roles.includes(req.user.role)) {
                return res.status(401).json({ message: 'Unauthorized'});
            }
            next();
        }
    ];
}
