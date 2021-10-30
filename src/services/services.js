const itemModel = require('../config/models/item-model');

const getAllGames = () => itemModel.find().lean();

const getSingleGame = (gameId) => itemModel.findById(gameId).lean();

const createGame = (gameToCreate) => itemModel.create(gameToCreate);

const deleteGame = (idToDelete) => itemModel.findByIdAndDelete(idToDelete);

const editGame = (id, editedGame) => itemModel.findByIdAndUpdate(id, editedGame, { runValidators: true });

const like = (userId, gameId) => itemModel.findOneAndUpdate({ _id: gameId }, { $push: { likedBy: userId }, $inc: { rating: 1 } });

const isLiked = async (userId, itemId) => {
    const item = await itemModel.findById(itemId);
    return item.likedBy.some(e => e._id == userId);
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