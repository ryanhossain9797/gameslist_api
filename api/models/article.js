const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    title: { type: String, require: true },
    content: { type: String, require: true },
    imgurl: { type: String, require: true }
});

module.exports = mongoose.model('Article', articleSchema);