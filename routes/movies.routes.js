//Express to create the router
const express = require("express");

//Importing movies model
const Movie = require("../models/Movies.js");

//Importing Error variable
const createError = require("../utils/errors/create-error.js");

//Importing middleware passport for the role
const isAuthPassportAdmin = require("../utils/middlewares/auth.middleware.js");

//Importing middleware to upload pictures
const upload = require('../utils/middlewares/file.middleware.js');

//Importing file system
const fs = require('fs');

//Importing Cloudinary
const uploadToCloudinary = require('../utils/middlewares/cloudinary.middleware.js');

//Importing cinema model
const Cinema = require("../models/Cinemas.js");

//Importing director model
const Director = require("../models/Directors.js");

//Creating movies router
const moviesRouter = express.Router();

// ------ CRUD ------

//middleware [isAuthPassportAdmin] - with role (for .post, .put and .delete)


//get --> to Read

//all movies
moviesRouter.get("/", async (req, res, next) => {
  try {
    //with .find we recover all movies
    const movies = await Movie.find().populate('director');
    //.json(movies) --> transforms directly to the correct format
    return res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
});

//Pagination
moviesRouter.get("/paginated", async (req, res, next) => {
    try {
      const currentPage = req.query.page;
      /* 1 --> 0 - 4
         2 --> 5 - 8
         3 --> 9 - 12
         n --> start = (n-1)*4 - end = n*4 */
      if(!currentPage) {
          next(createError("Tienes que indicar un número de página válido", 404))
        }
      const findMovies = await Movie.find().populate('director');
      const start = (currentPage - 1) * 4;
      const end = currentPage * 4;
      //with .slice we return a copy with start and end defined previously
      const movies = findMovies.slice(start, end);
      if(currentPage <= 0 || start > findMovies.length - 1 ) {
          next(createError(`La página indicada no existe, la primera página es la 1 y la última es la ${Math.ceil(findMovies.length / 4)}`, 404));
      }
      return res.status(200).json(movies);
    } catch (err) {
      next(err);
    }
  });


//the movie with the indicated id
moviesRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const movie = await Movie.findById(id);
    if (movie) {
      return res.status(200).json(movie);
    } else {
      next(createError("No existe una película con ese id", 404));
    }
  } catch (err) {
    next(err);
  }
});

//title value indicated
moviesRouter.get("/title/:title", async (req, res, next) => {
  const title = req.params.title;
  try {
    const movie = await Movie.find(
      {
        title: { $in: title },
      },
      {
        //To get all information (not only the title) we have to comment this:
        title: 1,
        picture: 1,
        _id: 0,
      }
    );
    if (movie) {
      return res.status(200).json(movie);
    } else {
      next(createError("No existe esa película", 404));
    }
  } catch (err) {
    next(err);
  }
});

//all movies with the indicated genre
moviesRouter.get("/genre/:genre", async (req, res, next) => {
  const genre = req.params.genre;
  try {
    const movie = await Movie.find({
      genre: { $in: [genre] },
    });
    if (movie) {
      return res.status(200).json(movie);
    } else {
      next(createError("No existe ninguna película con ese género", 404));
    }
  } catch (err) {
    next(err);
  }
});

//all movies from 2010 onwards
moviesRouter.get("/year/:year", async (req, res, next) => {
  const year = req.params.year;
  try {
    const movie = await Movie.find({
      year: { $gte: 2010 },
    });
    if (movie) {
      return res.status(200).json(movie);
    } else {
      next(
        createError(
          "No existe ninguna película estrenada en ese año",
          404
        )
      );
    }
  } catch (err) {
    next(err);
  }
});

//post --> to Create

moviesRouter.post("/", [isAuthPassportAdmin], async (req, res, next) => {
  try {
    //with spread operator we create a new copy and we´ll have all properties with all values
    const newMovie = new Movie({ ...req.body });
    //Save the document created in the previous variable
    const createdMovie = await newMovie.save();
    return res.status(201).json(createdMovie);
  } catch (err) {
    next(err);
  }
});

//to create movies with pictures in cloudinary
moviesRouter.post('/to-cloud', [isAuthPassportAdmin], [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
  try {
    //with spread operator we create a new copy and we´ll have all properties with all values
    //req.file_url --> is the property appears in cloudinary.middleware.js to save the cloudinary safe URL
    const newMovie = new Movie({ ...req.body, picture: req.file_url });
    const createdMovie = await newMovie.save();
    return res.status(201).json(createdMovie);
  } catch (err) {
    next(err);
  }
});

//delete --> to Delete

moviesRouter.delete("/:id", [isAuthPassportAdmin], async (req, res, next) => {
  try {
    const id = req.params.id;
    await Movie.findByIdAndDelete(id);
    return res.status(200).json("La película se ha eliminado correctamente");

  } catch (err) {
    next(err);
  }
});

moviesRouter.delete("/cinemas-directors/:id", [isAuthPassportAdmin], async (req, res, next) => {
  try {
    const id = req.params.id;
    const findCinemas = await Cinema.find({ movies: { $in: id } });
    findCinemas.forEach(async (movie) => {
      await Cinema.findByIdAndUpdate(
        movie.id,
        { $pull: { movies: id } },
        { new: true }
      );
    });
    const findDirectors = await Director.find({ movies: {$in: id } });
    findDirectors.forEach(async (movie) => {
      await Director.findByIdAndUpdate(
        movie.id,
        { $pull: {movies: id} },
        { new: true}
      );
    });
    await Movie.findByIdAndDelete(id);
    return res.status(200).json("La película se ha eliminado correctamente");
  } catch (err) {
    next(err);
  }
});

//put --> to Update

moviesRouter.put("/:id", [isAuthPassportAdmin], async (req, res, next) => {
  try {
    const id = req.params.id;
    const modifiedMovie = new Movie({ ...req.body });
    modifiedMovie._id = id;
    const movieUpdated = await Movie.findByIdAndUpdate(
      id,
      //$set - to add new properties, but those properties have to be defined in the Schema
      { $set: { ...modifiedMovie } },
      { new: true }
    );
    return res.status(200).json(movieUpdated);
  } catch (err) {
    next(err);
  }
});

//to update with pictures
moviesRouter.put("/to-cloud-update/:id", [isAuthPassportAdmin], [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
  try {
    const id = req.params.id;
    const modifiedMovie = new Movie({ ...req.body, picture: req.file_url });
    modifiedMovie._id = id;
    const movieUpdated = await Movie.findByIdAndUpdate(
      id,
      //$set - to add new properties, but those properties have to be defined in the Schema
      { $set: { ...modifiedMovie } },
      { new: true }
    );
    return res.status(200).json(movieUpdated);
  } catch (err) {
    next(err);
  }
});

//Exporting
module.exports = moviesRouter;
