//Express to create the router
const express = require('express');
//Importing cinema model
const Cinema = require('../models/Cinemas.js');
//Importing Error variable
const createError = require('../utils/errors/create-error.js');

//Importing middleware passport for the role
const isAuthPassportAdmin = require("../utils/middlewares/auth.middleware.js");
//Importing middleware to upload pictures
const upload = require('../utils/middlewares/file.middleware.js');
//Importing file system
const fs = require('fs');
//Importing Cloudinary
const uploadToCloudinary = require('../utils/middlewares/cloudinary.middleware.js');

//Creating cinema router
const cinemasRouter = express.Router();

//------- CRUD --------

//middleware [isAuthPassportAdmin] - with role (for .post, .put and .delete)

//get --> to Read

//all cinemas
cinemasRouter.get('/', async (req, res, next) => {
    try {
        //I use .populate to substitute the id for the name of the movie
        const cinemas = await Cinema.find().populate('movies');
        return res.status(200).json(cinemas);
    } catch (err) {
        next(err); 
    }
});

//Pagination
cinemasRouter.get("/paginated-cinemas", async (req, res, next) => {
    try {
      const currentPage = req.query.page;
      if(!currentPage) {
        next(createError("Tienes que indicar un número de página válido", 404))
      }
      /* 1 --> 0 - 4
         2 --> 5 - 8
         3 --> 9 - 12
         n --> start = (n-1)*4 - end = n*4 */
      const findCinemas = await Cinema.find();
      const start = (currentPage - 1) * 4;
      const end = currentPage * 4;
      //with .slice we return a copy with start and end defined previously
      const cinemas = findCinemas.slice(start, end);
      if(currentPage <= 0 || start > findCinemas.length - 1 ) {
        next(createError(`La página indicada no existe, la primera página es la 1 y la última es la ${Math.ceil(findCinemas.length / 4)}`, 404));
      }
      return res.status(200).json(cinemas);
    } catch (err) {
      next(err);
    }
  });

//post --> to Create
cinemasRouter.post('/', [isAuthPassportAdmin], async (req, res, next) => {
    try {
        //with spread operator we create a new copy and we´ll have all properties with all values
        const newCinema = new Cinema ({ ...req.body });
        //Save the document created in the previous variable
        const createdCinema = await newCinema.save();
        return res.status(201).json(createdCinema);
    } catch (err) {
        next(err); 
    }
});

//to create cinemas with pictures in cloudinary
cinemasRouter.post('/to-cloud-cinemas', [isAuthPassportAdmin], [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
    try {
       //req.file_url --> is the property appears in cloudinary.middleware.js to save the cloudinary safe URL
        const newCinema = new Cinema ({ ...req.body, picture: req.file_url });
        const createdCinema = await newCinema.save();
        return res.status(201).json(createdCinema);
    } catch (err) {
        next(err); 
    }
});

//put --> to Update
cinemasRouter.put('/add-movie', [isAuthPassportAdmin], async (req, res, next) => {
    try {
        const { cinemaId, movieId } = req.body;
        if(!cinemaId) {
           return next(createError('Se necesita un id de cine para poder añadir la película'));
        }
        if(!movieId) {
            return next(createError('Se necesita un id de película para poder añadirla'));
        }
        const cinemaUpdated = await Cinema.findByIdAndUpdate(
            cinemaId,
            { $push: { movies: movieId }},
            { new: true }
        );
        return res.status(200).json(cinemaUpdated);
    } catch (err) {
        next(err);  
    }
});

//to update pictures
cinemasRouter.put("/to-cloud-update-cinemas/:id", [isAuthPassportAdmin], [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
    try {
      const id = req.params.id;
      const modifiedCinema = new Cinema({ ...req.body, picture: req.file_url });
      modifiedCinema._id = id;
      const cinemaUpdated = await Cinema.findByIdAndUpdate(
        id,
        //$set - to add new properties, but those properties have to be defined in the Schema
        { $set: { ...modifiedCinema } },
        { new: true }
      );
      return res.status(200).json(cinemaUpdated);
    } catch (err) {
      next(err);
    }
  });

//delete ---> to Delete
cinemasRouter.delete('/:id', [isAuthPassportAdmin], async (req, res, next) => {
    try {
        const id = req.params.id;
        await Cinema.findByIdAndDelete(id);
        return res.status(200).json('El cine ha sido eliminado correctamente');
    } catch (err) {
        next(err);  
    }
});


module.exports = cinemasRouter;