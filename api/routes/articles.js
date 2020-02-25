const express = require('express');
const mongoose = require('mongoose');
const Article = require('../models/article');


const router = express.Router();


//-------------------------ALL ARTICLES
router
    .get('/', (req, res, next) => {
        Article.find().select(' title content imgurl _id').exec()
            .then(articles => {
                const response = {
                    count: articles.length,
                    articles: articles.map(article => {
                        return {
                            _id: article._id,
                            title: article.title,
                            content: article.content,
                            imgurl: article.imgurl,
                            request: {
                                type: "GET/:id",
                                url: "/" + article._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error: error });
            });
    })
    .post('/', (req, res, next) => {
        const article = new Article({
            title: req.body.title,
            content: req.body.content,
            imgurl: req.body.imgurl
        });
        article.save().then(result => {
            console.log(result.title + " added");
            res.status(201).json({
                message: "articles /POST " + result.title + " ok",
                createdArticle: {
                    _id: result._id,
                    title: result.title,
                    content: result.content,
                    imgurl: result.imgurl,
                    request: {
                        type: "GET/:id",
                        url: "/" + result._id
                    }
                }
            });
        }).catch(error => {
            console.log(error);
            res.status(500).json({ error: error });
        });

    });


//-------------------------SINGLE ARTICLES
router
    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Article.findOne({ _id: id }).select('title content _id imgurl').exec()
            .then(article => {
                if (article) {
                    res.status(200).json({
                        article: {
                            _id: article._id,
                            title: article.title,
                            content: article.content,
                            imgurl: article.imgurl,
                        },
                        request: {
                            type: "GET",
                            url: "/"
                        }
                    });
                } else {
                    res.status(404).json({ message: 'Not Found' })
                }
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error: error });
            });
    })
    .patch('/:id', (req, res, next) => {
        console.log("body is " + req.body);
        const id = req.params.id;
        const updateOps = {};
        for (const ops of req.body) {
            updateOps[ops.key] = ops.value;
        }
        console.log(updateOps);
        Article.updateOne({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "articles /PATCH " + result.title + " ok",
                    createdArticle: {
                        _id: result._id,
                        title: result.title,
                        content: result.content,
                        imgurl: result.imgurl,
                        request: {
                            type: "GET/:id",
                            url: "/" + result._id
                        }
                    }
                });
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error: error });
            });
    })
    .delete('/:id', (req, res, next) => {
        const id = req.params.id;
        Article.deleteOne({ _id: id }).exec()
            .then(result => {
                res.status(200).json({
                    message: "Article deleted",
                    request: {
                        type: "GET",
                        url: "/"
                    }
                });
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error: error });
            });
    });

module.exports = router;
