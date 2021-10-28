const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
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
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    ]
}, { timestamps: true });

const itemModel = mongoose.model('item', itemSchema);

module.exports = itemModel;