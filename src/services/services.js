const gameModel = require('../config/models/game-model');

const getAllGames = () => gameModel.find().lean();

const getSingleGame = (gameId) => gameModel.findById(gameId).lean();

const createGame = (gameToCreate) => gameModel.create(gameToCreate);

const deleteGame = (idToDelete) => gameModel.findByIdAndDelete(idToDelete);

const editGame = (id, editedGame) => gameModel.findByIdAndUpdate(id, editedGame, { runValidators: true });

const like = (userId, gameId) => gameModel.findOneAndUpdate({ _id: gameId }, { $push: { likedBy: userId }, $inc: { rating: 1 } });

const isLiked = async (userId, gameId) => {
    const game = await gameModel.findById(gameId);
    return game.likedBy.some(e => e._id == userId);
};

const services = {
    getAllGames,
    getSingleGame,
    createGame,
    deleteGame,
    editGame,
    like,
    isLiked,
}

module.exports = services;