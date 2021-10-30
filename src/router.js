const express = require('express');

const authController = require('./controllers/auth-controller');
const gameController = require('./controllers/game-controller');

const router = express.Router();

router.use('/auth', authController);
router.use('/game', gameController);
router.get('/', (req, res) => {
    res.redirect('/game/browse');
});
router.get('/about', (req, res) => {
    res.render('about');
});
router.get('*', (req, res) => {
    res.render('404');
});

module.exports = router;