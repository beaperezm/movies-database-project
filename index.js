//Importing dotenv to prepare the environment and have the variables we have in .env available
require('dotenv').config();

//To connect our server
const express = require('express')

//Importing movies router
const moviesRouter = require ('./routes/movies.routes.js');

//Importing connect
const connect = require ('./utils/db/connect.js');

const cors = require ('cors');
const createError = require('./utils/errors/create-error.js');

//Importing cinemas router
const cinemasRouter = require('./routes/cinemas.routes.js');

//Importing directors router
const directorsRouter = require('./routes/directors.routes.js');

//To initialise passport
const passport = require('passport');

//Importing users router
const userRouter = require('./routes/user.routes.js');

//Importing the session
const session = require('express-session');
const MongoStore = require('connect-mongo');

const path = require("path");

const cloudinary = require("cloudinary");

const DB_URL = process.env.DB_URL;


//To connect our DB
connect();

//Selecting the PORT that I want
const PORT = process.env.PORT || 3000;

//Creating our server
const server = express();

//To use cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_SECRET 
});

//To avoid Cors errors (npm install --save cors)
server.use(cors());

//Middlewares --> to parser bodies in .post and .put (json (first middleware), strings or arrays(second middleware))
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

//To static files (pictures, txt files, excels files, etc)
server.use(express.static(path.join(__dirname, 'public')));

//To initialise and config passport
require('./utils/authentication/passport.js');

//Middleware session
server.use(session({
  //Secret code to encrypt and unencrypt sessions
  secret: process.env.SESSION_SECRET_KEY,
  //Save the session without modification; false: the session will only be saved again if there is some kind of modification.
  resave: false,
  //To logout the session through express session or if the help of a passport; false: passport will help us
  saveUninitialized: false,
  cookie: {
    //in millisecs
    maxAge: 3600000
  },
  store: MongoStore.create({
    mongoUrl: DB_URL
  })
}
));

//Initialise passport
server.use(passport.initialize());

//To use session with passport
server.use(passport.session());

//Creating router
server.use('/user', userRouter);
server.use('/directors', directorsRouter);
server.use('/movies', moviesRouter);
server.use('/cinemas', cinemasRouter);


//To handle errors from routes that don´t exist
server.use('*', (req, res, next) => {
  next(createError('La ruta a la que intentas acceder no existe', 404));
});

//Error handling
server.use((err, req, res, next) => {
  return res.status(err.status || 500).json(err.message || "Unexpected error");
});

//Creating server.listen to listen the PORT
server.listen(PORT, () => {
    console.log(`Listening in http://localhost:${PORT}`);
  });