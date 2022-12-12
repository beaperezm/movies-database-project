//Express to create the router
const express = require('express');
//To initialise passport
const passport = require('passport');

//Creating user router
const userRouter = express.Router();

//--- Creating enpoint Create (post) to register, login and logout  -----

userRouter.post('/register', (req, res, next) => {
    const done = (err, user) => {
        if (err) {
            return next(err);
        }
        req.logIn(
            user,
            (err) => {
                if (err) {
                    //if there is some error during the login
                    return next(err);
                }
                //if all is right in the login
                return res.status(201).json(user);
            }
        );
    };
    passport.authenticate('register', done)(req);
});

userRouter.post('/login', (req, res, next) => {
    const done = (err, user) => {
        if (err) {
            return next(err);
        }
        req.logIn(
            user,
            (err) => {
                if (err) {
                    //if there is some error during the login
                    return next(err);
                }
                //if all is right in the login
                return res.status(200).json(user);
            }
        );
    };
    passport.authenticate('login', done)(req);
});

userRouter.post('/logout', (req, res, next) => {
    //req.user is the cookie sent by the client; if there is some user connected do logout
    if(req.user) {
        req.logOut(() => {
            //destroy the session
            req.session.destroy(() => {
                //and clear the cookie(name of the cookie)
                res.clearCookie('connect.sid');
                return res.status(200).json('¡Nos vemos pronto!');
            });
        });
    } else {
        //if there isn´t user
        return res.status(304).json();
    }
});


module.exports = userRouter;