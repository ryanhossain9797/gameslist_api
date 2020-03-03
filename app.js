const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const articleRoutes = require('./api/routes/articles');
const commentRoutes = require('./api/routes/comments');
require('dotenv').config();
const app = express();

const mongoID = process.env.MONGO_ID;
const mongoPass = process.env.MONGO_PASS

mongoose.connect('mongodb+srv://' + mongoID + ':' + mongoPass + '@cluster0-lbdsg.azure.mongodb.net/wikiDB?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).catch(error => {
    console.log(error);
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.status(200).json({});
    }
    next();
})

// Routes to handle requests
app.use('/articles/:article/comments', commentRoutes);
app.use('/articles', articleRoutes);

// Non Exixtent route error
app.use((req, res, next) => {
    console.log('illegal route');
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// All errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    });
});

module.exports = app;