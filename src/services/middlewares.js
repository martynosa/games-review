const authServices = require('./auth-services');
const services = require('./services');

//checks if user is logged(verify token, navbar variable, and sets the user in the req down the chain)
const auth = async (req, res, next) => {
    const token = req.cookies['token'];

    if (!token) {
        //set variable that we can use in main.hbs for the navbar
        res.locals.isGuest = true;
        return next();
    }

    try {
        const decodedToken = await authServices.verifyToken(token)
        req.user = decodedToken;
        //set variable that we can use in main.hbs for the navbar
        res.locals.isGuest = false;
        res.locals.user = decodedToken;
        next();
    } catch (error) {
        res.clearCookie('token');
        res.redirect('/auth/login')
    }

};

// blocks non logged users from modifying the created item and redirects them to login
const isGuest = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    next();
};

//blocks non owners from modifying the created item and redirects them back to the details page of the same item
const isOwner = async (req, res, next) => {
    const gameId = req.params.id;
    const gameToEdit = await services.getSingleGame(gameId);
    if (req.user.id != gameToEdit.ownerId) {
        return res.redirect(`/item/${gameId}`);
    }
    next()
};

//blocks logged users from accessing login/register page manually and redirects them to the home page
const loginRegisterGuard = async (req, res, next) => {
    if (!res.locals.isGuest) {
        return res.redirect('/');
    }
    next();
};

const middlewares = {
    auth,
    isGuest,
    isOwner,
    loginRegisterGuard
};

module.exports = middlewares;