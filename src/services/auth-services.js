const userModel = require('../config/models/user-model');
const util = require('util');
const jwt = require('jsonwebtoken');

const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);
const SECRET = 'E76F271A235932E37DE68AF7E4E3D';

const registerUser = async (userToRegister) => {
    const { password, rePassword } = userToRegister;

    if (password !== rePassword) {
        throw ('Password and Repeat Password must be identical!');
    }

    try {
        await userModel.create(userToRegister);
    } catch (error) {
        throw ('Choose different Username or Passowrd!');
    }
};

const logUser = async (userToLog) => {
    const { username, password } = userToLog;
    const user = await userModel.findOne({ username });
    const isValid = await user.validatePassword(password);

    if (!user) {
        throw ('Username or Password are invalid!');
    }

    if (!isValid) {
        throw ('Username or Password are invalid!');
    }
    return user;
};

const createToken = async (user) => {
    const { _id, username } = user;

    const payload = {
        id: _id,
        username: username
    }

    const token = await jwtSign(payload, SECRET);
    return token;
};

const verifyToken = (token) => jwtVerify(token, SECRET);

const getUser = (id) => userModel.findById(id).populate('likedGames').populate('createdGames').lean();

const addToCreatedGames = (userId, gameId) => userModel.findOneAndUpdate({ _id: userId }, { $push: { createdGames: gameId } });

const addToLikedGames = (userId, gameId) => userModel.findOneAndUpdate({ _id: userId }, { $push: { likedGames: gameId } });

const authServices = {
    registerUser,
    logUser,
    createToken,
    verifyToken,
    getUser,
    addToCreatedGames,
    addToLikedGames
};

module.exports = authServices;