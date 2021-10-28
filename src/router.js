const express = require('express');

const authController = require('./controllers/auth-controller');
const itemController = require('./controllers/item-controller');

const router = express.Router();

router.use('/auth', authController);
router.use('/item', itemController);
router.get('/', (req, res) => {
    res.redirect('/item/browse');
});
router.get('/about', (req, res) => {
    res.render('about');
});
router.get('*', (req, res) => {
    res.render('404');
});

module.exports = router;