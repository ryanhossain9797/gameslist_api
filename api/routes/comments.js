const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../models/comment');


const router = express.Router();


//-------------------------ALL COMMENTS
router
    .get('/', (req, res, next) => {
        console.log(req.originalUrl.id)
        Comment.find({ article: req.originalUrl.id }).select(' username comment article _id').exec()
            .then(comments => {
                const response = {
                    count: comments.length,
                    comments: comments.map(comment => {
                        return {
                            _id: comment._id,
                            username: comment.username,
                            comment: comment.comment,
                            request: {
                                type: "GET/:id",
                                url: "/" + comment._id
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
        console.log(req.body.username)
        const comment = new Comment({
            username: req.body.username,
            comment: req.body.comment,
            article: req.body.article
        })
        console.log("comment is" + comment)
        comment
            .save()
            .then(result => {
                res.status(201).json(result)
            })
            .catch(error => {
                res.status(500).json({ error: error })
            })
    });


//-------------------------SINGLE COMMENT
router
    .get('/:id', (req, res, next) => {
        res.status(200).json({
            message: "get comment ok"
        })
    })
    .patch('/:id', (req, res, next) => {
        res.status(200).json({
            message: "patch comment ok"
        })
    })
    .delete('/:id', (req, res, next) => {
        res.status(200).json({
            message: "delete comment ok"
        })
    });

module.exports = router;