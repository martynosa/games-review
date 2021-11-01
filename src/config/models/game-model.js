const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required!"],
    },
    ganre: {
        type: String,
        required: [true, 'Ganre is required!'],
    },
    releaseYear: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is required!'],
        validate: [/^https?:\/\//i, 'Invalid ImageUrl']
    },
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    likedBy: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    ],
    rating: {
        type: Number
    }
}, { timestamps: true });

const gameModel = mongoose.model('game', gameSchema);

module.exports = gameModel;