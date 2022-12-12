const mongoose = require('mongoose');

//Creating movie Schema to be followed by all elements of our collection
const movieSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        director: [{ type: mongoose.Types.ObjectId, ref: 'Director' } ],
        year: Number,
        genre: { 
            type: [String], 
            enum: {
                values: ["Acción", "Animación", "Ciencia ficción", "Comedia romántica", "Comedia", "Aventura", "Drama", "Musical", "Fantasía", "Documental", "Terror", "Biográfico", "Western", "Suspense"],
                message: "Este no es un género válido."
            },
            lowercase: true
    },
    //To add pictures
    picture: String
}, {
    //add the date of creation and editing
    timestamps: true
}
);

/*Creating the model/the collection, this model follow the Schemma
'Movie' is the name of our model
movieSchema is the schema*/
const Movie = mongoose.model('Movie', movieSchema);

//Exporting
module.exports = Movie;