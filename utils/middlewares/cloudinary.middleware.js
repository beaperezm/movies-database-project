//Importing cloudinary and file system dependencies (fs to delete the picture when it´s in cloudinary)
const cloudinary = require('cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (req, res, next) => {
    //req.file --> because an image uploaded by multer
    if(req.file) {
        const filePath = req.file.path;
        const image = await cloudinary.v2.uploader.upload(filePath);

        await fs.unlinkSync(filePath);

        req.file_url = image.secure_url;
        return next();
    } else {
        return next();
    }
};

module.exports = uploadToCloudinary;



