const mongoose = require('mongoose');

//Creating cinema Schema to be followed by all elements of our collection
const cinemasSchema = new mongoose.Schema(
    {
       name: { type: String, required: true },
       location: { type: String, required: true },
       movies: [{ type: mongoose.Types.ObjectId, ref: 'Movie' } ],
       picture: String
    }, {
        //add the date of creation and editing
        timestamps: true
});

const Cinema = mongoose.model('Cinema', cinemasSchema)

//Exporting
module.exports = Cinema;