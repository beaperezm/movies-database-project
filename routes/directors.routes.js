//Express to create the router
const express = require('express');
//Importing director model
const Director = require('../models/Directors.js');
//Importing Error variable
const createError = require('../utils/errors/create-error.js');
//Importing middleware passport for the role
const isAuthPassportAdmin = require("../utils/middlewares/auth.middleware.js");
//Importing middleware to upload pictures
const upload = require('../utils/middlewares/file.middleware.js');
//Importing Cloudinary
const uploadToCloudinary = require('../utils/middlewares/cloudinary.middleware.js');

//Creating director router
const directorsRouter = express.Router();


//------- CRUD --------
//middleware [isAuthPassportAdmin] - with role (for .post, .put and .delete)

//get --> to Read

//all directors
directorsRouter.get('/', async (req, res, next) => {
    try {
        //I use .populate to substitute the id for the name of the movie
        const directors = await Director.find().populate('movies');
        return res.status(200).json(directors);
    } catch (err) {
        next(err); 
    }
});

//Pagination
directorsRouter.get('/paginated-director', async (req, res, next) => {
    try {
        const currentPage = req.query.page;
        if (!currentPage) {
            next(createError("Tienes que indicar un número de página válido", 404))
        }
        const findDirectors = await Director.find();
        /* 1 --> 0 - 4
         2 --> 5 - 8
         3 --> 9 - 12
         n --> start = (n-1)*4 - end = n*4 */
        const start = (currentPage - 1) * 4;
        const end = currentPage * 4;
         //with .slice we return a copy with start and end defined previously
        const directors = findDirectors.slice(start, end);
        if(currentPage <= 0 || start > findDirectors.length - 1) {
            next(createError(`La página indicada no existe, la primera página es la 1 y la última es la ${Math.ceil(findDirectors.length / 4)}`, 404));
        }
        return res.status(200).json(directors);
    } catch (err) {
        next(err);
    }
});

//post --> to create directors with pictures
directorsRouter.post('/to-cloud-director', [isAuthPassportAdmin], [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
    try {
        //with spread operator we create a new copy and we´ll have all properties with all values
         //req.file_url --> is the property appears in cloudinary.middleware.js to save the cloudinary safe URL
        const newDirector = new Director ({ ...req.body, picture: req.file_url });
        //Save the document created in the previous variable
        const createdDirector = await newDirector.save();
        return res.status(201).json(createdDirector);
    } catch (err) {
        next(err); 
    }
});

//delete --> to Delete

directorsRouter.delete("/:id", [isAuthPassportAdmin], async (req, res, next) => {
  try {
    const id = req.params.id;
    await Director.findByIdAndDelete(id);
    return res.status(200).json("El director se ha eliminado correctamente");
  } catch (err) {
    next(err);
  }
});

//to update with pictures
directorsRouter.put("/to-cloud-update-director/:id", [isAuthPassportAdmin], [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
    try {
      const id = req.params.id;
      const modifiedDirector = new Director({ ...req.body, picture: req.file_url });
      modifiedDirector._id = id;
      const directorUpdated = await Movie.findByIdAndUpdate(
        id,
        //$set - to add new properties, but those properties have to be defined in the Schema
        { $set: { ...modifiedDirector } },
        { new: true }
      );
      return res.status(200).json(directorUpdated);
    } catch (err) {
      next(err);
    }
  });

  //To update by Id
  directorsRouter.put("/:id", [isAuthPassportAdmin], async (req, res, next) => {
    try {
      const id = req.params.id;
      const modifiedDirector = new Director({ ...req.body });
      modifiedDirector._id = id;
      const directorUpdated = await Director.findByIdAndUpdate(
        id,
        //$set - to add new properties, but those properties have to be defined in the Schema
        { $set: { ...modifiedDirector } },
        { new: true }
      );
      return res.status(200).json(directorUpdated);
    } catch (err) {
      next(err);
    }
  });

module.exports = directorsRouter;

