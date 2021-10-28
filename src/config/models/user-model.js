const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required!'],
        minlength: [5, 'Username must be at least 5 characters long!'],
        validate: [/^[a-zA-Z0-9]+$/, 'Username should consist of english letters and digits only!']
    },
    password: {
        type: String,
        required: true,
        minlength: [5, 'Password must be at least 8 characters long!']
    },
    courses:[
        {
            type: mongoose.Types.ObjectId,
            ref: 'item'
        }
    ]
});

//hashes the password
userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
});

//validates the password
userSchema.method('validatePassword', function (password) {
    return bcrypt.compare(password, this.password);
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;