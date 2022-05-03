const mongoose = require('mongoose');

const novelSchema = new mongoose.Schema({
    title: { 
        type: String,
        index: true 
    },
    description: String,
    username: String,
    date: Date,
    category: String,
    tag: String,
    publisher: String,
    intro: String,
    rate: String,
    image: String,
    newdate: Date,
    type: String,
    owner: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    }
});

novelSchema.index({
    title : 'text'
})

const Novel = mongoose.model('novel', novelSchema);

module.exports = Novel;
