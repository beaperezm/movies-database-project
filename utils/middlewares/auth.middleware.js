const createError = require('../errors/create-error.js');

const isAuthPassport = (req, res, next) => {
    //To veryfy if the request is authenticated - it returns true or false (boolean)
    if(req.isAuthenticated()) {
        return next();
    } else {
        return next(createError('No tienes permisos', 401));
    }
};

const isAuthPassportAdmin = (req, res, next) => {
    // req.isAuthenticated --> boolean true si está autenticado o false si no lo está
    if (req.isAuthenticated() && req.user.role === 'administrador') {
        return next();
    } else {
        return next(createError('El role indicado no está autorizado.', 401));
    }
};

module.exports = isAuthPassportAdmin;

