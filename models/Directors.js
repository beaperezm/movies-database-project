const mongoose = require('mongoose');

//Creating director Schema to be followed by all elements of our collection
const directorSchema = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true },
    age: [Number],
    nationality: {type: String, lowercase: true },
    //movies: { type: [String], required: true, lowecase: true},
    movies: [{ type: mongoose.Types.ObjectId, ref: 'Movie' } ],
    picture: String
}, {
    //add the date of creation and editing
    timestamps: true
});

const Director = mongoose.model('Director', directorSchema)

//Exporting
module.exports = Director;