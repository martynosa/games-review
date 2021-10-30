const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const initHandlebars = require('./config/handlebars-config');
const initMongoose = require('./config/mongoose-config');
const middlewares = require('./services/middlewares');
const router = require('./router');

const PORT = 5000;

const app = express();
initHandlebars(app);

app.use(express.static(path.resolve(__dirname, './static')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(middlewares.auth);
app.use(router);

initMongoose()
    .then(() => app.listen(PORT, () => console.log(`running on ${PORT}...`)))
    .catch(error => console.log('initializing failed:' + error));