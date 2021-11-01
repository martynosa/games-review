const express = require('express');

const services = require('../services/services');
const middlewares = require('../services/middlewares');
const authServices = require('../services/auth-services');

const router = express.Router();

const showAllGames = async (req, res) => {
    try {
        const allGames = await services.getAllGames();
        res.render('browse', { allGames });
    } catch (error) {
        res.render('browse', { error: 'Something is wrong! Try again later...' })
    }
};

const showGameCreate = (req, res) => {
    res.render('create');
};

const gameCreate = async (req, res) => {
    const gameToCreate = { ...req.body, ownerId: req.user.id, rating: 0 };
    try {
        await services.createGame(gameToCreate);
        res.redirect('/');
    } catch (error) {
        res.render('create', { error });
    }
};

const showDetails = async (req, res) => {
    const gameId = req.params.id;
    let isOwner = false;
    let isLiked = false;
    try {
        const game = await services.getSingleGame(gameId);
        if (req.user) {
            const userId = req.user.id;
            isOwner = game.ownerId == userId;
            isLiked = await services.isLiked(userId, gameId);
        }
        res.render('details', { ...game, isOwner, isLiked });
    } catch (error) {
        res.render('details', { error: 'Something is wrong! Try again later...' });
    }
};

const showGameEdit = async (req, res) => {
    const gameId = req.params.id;
    try {
        const gameToEdit = await services.getSingleGame(gameId);
        res.render('edit', { ...gameToEdit });
    } catch (error) {
        res.render('edit', { ...gameToEdit, error });
    }
};

const editGame = async (req, res) => {
    const gameId = req.params.id;
    const editedGame = req.body;
    try {
        await services.editGame(gameId, editedGame);
        res.redirect(`/game/${gameId}`);
    } catch (error) {
        res.redirect(`/game/${gameId}/edit`);
    }
};

const deleteGame = async (req, res) => {
    const idToDelete = req.params.id;
    try {
        await services.deleteGame(idToDelete);
        res.redirect('/game/browse');
    } catch (error) {
        res.redirect(`/game/${idToDelete}/edit`)
    }
};

const like = async (req, res) => {
    const userId = req.user.id;
    const gameId = req.params.id;
    try {
        await services.like(userId, gameId);
        await authServices.addToLikedGames(userId, gameId);
        res.redirect(`/game/${gameId}`);
    } catch (error) {
        res.render('details', { error: 'Something is wrong! Try again later...' });
    }
};

const search = async (req, res) => {
    const searchCriteria = req.query.search;
    try {
        const results = await services.search(searchCriteria);
        res.render('browse', { allGames: results });
    } catch (error) {
        res.render('/browse', { error: 'Something is wrong! Try again later...' });
    }
};

//allGames
router.get('/browse', showAllGames);
//search
router.get('/search', search);
//create
router.get('/create', middlewares.isGuest, showGameCreate);
router.post('/create', middlewares.isGuest, gameCreate);
//details
router.get('/:id', showDetails);
//edit
router.get('/:id/edit', middlewares.isGuest, middlewares.isOwner, showGameEdit);
router.post('/:id/edit', middlewares.isGuest, middlewares.isOwner, editGame);
//delete
router.get('/:id/delete', middlewares.isGuest, middlewares.isOwner, deleteGame);
router.get('/:id/like', middlewares.isGuest, like);

module.exports = router;
