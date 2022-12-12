const multer = require('multer');
const path = require('path');
const createError = require('../errors/create-error.js');

//Allowed picture formats
const VALID_FILE_TYPES = ['image/jpg', 'image/png', 'image/jpeg'];

//To filter only certain images to be uploaded
const fileFilter = (req, file, cb) => {
    if (!VALID_FILE_TYPES.includes(file.mimetype)) {
        cb(createError('El formato del archivo que intentas subir no es aceptado'));
    } else {
        cb(null, true);
    }
};

//Store where the images are going to keep
const storage = multer.diskStorage({
    fileName: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads'));
    }
});

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;
