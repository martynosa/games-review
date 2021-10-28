const express = require('express');

const authServices = require('../services/auth-services');
const middlewares = require('../services/middlewares');

const router = express.Router();

const showLogin = (req, res) => {
    res.render('auth/login');
};

const showRegister = (req, res) => {
    res.render('auth/register');
};

const registerUser = async (req, res) => {
    const userToRegister = req.body;
    try {
        await authServices.registerUser(userToRegister)
        const loggedUser = await authServices.logUser(userToRegister);
        const token = await authServices.createToken(loggedUser);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        res.render('auth/register', { error })
    }
};

const logUser = async (req, res) => {
    const userToLog = req.body;
    try {
        const loggedUser = await authServices.logUser(userToLog);
        const token = await authServices.createToken(loggedUser);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        res.render('auth/login', { error: 'Username or password are invalid!' });
    }
};

const logout = async (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};

//TODO: the whole thing
const myProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const currentUser = await authServices.getUser(userId);
        let courses = currentUser.courses.map(x => x.name).join(', ');
        res.render('auth/myProfile', { ...currentUser, courses })
    } catch (error) {
        res.render('auth/myProfile', { error });
    }
};

router.get('/login', middlewares.loginRegisterGuard, showLogin);
router.get('/register', middlewares.loginRegisterGuard, showRegister);
router.post('/register', middlewares.loginRegisterGuard, registerUser);
router.post('/login', middlewares.loginRegisterGuard, logUser);
router.get('/logout', logout);
router.get('/myProfile', myProfile);

module.exports = router;