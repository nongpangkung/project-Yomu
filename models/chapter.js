const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    number: String,
    title: String,
    novelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Novel"
    },
    text: String,
    date: Date
});

const Chapter = mongoose.model('chapter', chapterSchema);

module.exports = Chapter;
