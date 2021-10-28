const mongoose = require('mongoose');

const initMongoose = () => mongoose.connect('mongodb://localhost:27017/games');

module.exports = initMongoose;

