const express = require('express');

const services = require('../services/services');
const middlewares = require('../services/middlewares');
const authServices = require('../services/auth-services');

const router = express.Router();

const showAllItems = async (req, res) => {
    try {
        const allItems = await services.getAllItems();
        res.render('browse', { allItems });
    } catch (error) {
        res.render('browse', { error: 'Something is wrong! Try again later...' })
    }
};

const showItemCreate = (req, res) => {
    res.render('create');
};

const itemCreate = async (req, res) => {
    const itemToCreate = { ...req.body, ownerId: req.user.id };
    try {
        await services.createItem(itemToCreate);
        res.redirect('/');
    } catch (error) {
        res.render('create', { error });
    }
};

const showDetails = async (req, res) => {
    const itemId = req.params.id;
    let isOwner = false;
    let isLiked = false;
    try {
        const item = await services.getSingleItem(itemId);
        if (req.user) {
            const userId = req.user.id;
            isOwner = item.ownerId == userId;
            isLiked = await services.isLiked(userId, itemId);
        }
        res.render('details', { item, isOwner, isLiked });
    } catch (error) {
        res.render('details', { error: 'Something is wrong! Try again later...' });
    }
};

const showEdit = async (req, res) => {
    const itemId = req.params.id;
    try {
        const itemToEdit = await services.getSingleItem(itemId);
        res.render('edit', { itemToEdit });
    } catch (error) {
        res.render('edit', { itemToEdit, error });
    }
};

const editItem = async (req, res) => {
    const id = req.params.id;
    const editedItem = req.body;
    try {
        await services.editItem(id, editedItem);
        res.redirect(`/item/${id}`);
    } catch (error) {
        res.redirect(`/item/${id}/edit`);
    }
};

const deleteItem = async (req, res) => {
    const idToDelete = req.params.id;
    try {
        await services.deleteItem(idToDelete);
        res.redirect('/item/browse');
    } catch (error) {
        res.redirect(`/item/${idToDelete}/edit`)
    }
};

const like = async (req, res) => {
    const userId = req.user.id;
    const itemId = req.params.id;
    try {
        await services.like(userId, itemId);
        await authServices.addToLikedGames(userId, itemId);
        res.redirect(`/item/${itemId}`);
    } catch (error) {
        res.render('details', { error: 'Something is wrong! Try again later...' });
    }
};

//allItems
router.get('/browse', showAllItems);
//create
router.get('/create', middlewares.isGuest, showItemCreate);
router.post('/create', middlewares.isGuest, itemCreate);
//details
router.get('/:id', showDetails);
//edit
router.get('/:id/edit', middlewares.isGuest, middlewares.isOwner, showEdit);
router.post('/:id/edit', middlewares.isGuest, middlewares.isOwner, editItem);
//delete
router.get('/:id/delete', middlewares.isGuest, middlewares.isOwner, deleteItem);
router.get('/:id/like', middlewares.isGuest, like);

module.exports = router;
