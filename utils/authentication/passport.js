const passport = require("passport");
const User = require("../../models/Users.js");

//Importing only strategy part of passport-local
const localStrategy = require("passport-local").Strategy;

const bcrypt = require("bcrypt");

const createError = require('../errors/create-error.js');

//To create register strategy
passport.use(
  "register",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        //To check if the user exists or not with findOne by email
        const previousUser = await User.findOne({ email });

        if (previousUser) {
          return done(createError("Este usuario ya existe, inicia sesión"));
        }
        //To encript the password
        const encPassword = await bcrypt.hash(password, 10);

        //To create new user
        const newUser = new User({
          email,
          password: encPassword,
          role: req.body.role
        });

        //To save the new user in the DB
        const savedUser = await newUser.save();

        //null because everything is right
        return done(null, savedUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

//To create login strategy
passport.use(
    "login", 
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                //To check if the user exists or not with findOne by email
                const currentUser = await User.findOne({ email });
                if(!currentUser) {
                    return done(createError('No existe un usuario con el email indicado, regístrate'));
                }
                //To compare if password - user match use .compare
                const isValidPassword = await bcrypt.compare(
                    //unencrypted password
                    password,
                    //encrypted password
                    currentUser.password
                );

                if(!isValidPassword) {
                    return done(createError('La contraseña es incorrecta'));
                }
                //We don´t want to show the password when the user is login 
                currentUser.password = null;
                //If the password is right
                return done(null, currentUser);
            } catch (err) {
                return done(err); 
            }
        }
    )
);

//To register the user by Id in the DB
passport.serializeUser((user, done) => {
    return done(null, user._id);
});

//To find the user by DB id
passport.deserializeUser(async (userId, done) => {
    try {
        const existingUser = await User.findById(userId);
        return done(null, existingUser);
    } catch (err) {
        return done(err);
    }
});
