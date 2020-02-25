const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    username: { type: String, require: true },
    comment: { type: String, require: true },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', require: true }
});

module.exports = mongoose.model('Comment', commentSchema);