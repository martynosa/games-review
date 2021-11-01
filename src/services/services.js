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

const search = async (searchCriteria) => {
    let results = await getAllGames();
    if (searchCriteria) {
        const byTitle = results.filter(g => g.title.toLowerCase().includes(searchCriteria.toLowerCase()))
        const byGanre = results.filter(g => g.ganre.toLowerCase().includes(searchCriteria.toLowerCase()))
        const byYear = results.filter(g => g.releaseYear == Number(searchCriteria));
        results = [...byTitle, ...byGanre, ...byYear];
    };
    return results;
};

const services = {
    getAllGames,
    getSingleGame,
    createGame,
    deleteGame,
    editGame,
    like,
    isLiked,
    search
};

module.exports = services;