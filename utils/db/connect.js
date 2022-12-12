//To connect out DB to mongoose
const mongoose = require('mongoose');

//Database URL --> is the URL that connects to our database
const DB_URL = process.env.DB_URL;

//To connect to DB
const connect = () => {
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

//Exporting
module.exports = connect;