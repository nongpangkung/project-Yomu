const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username: String,
    text: String,
    novelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Novel"
    },
    date: Date,
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter"
    },
    owner: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    }
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
