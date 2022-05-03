/*const Novel = require("../models/novel");
const Comment = require("../models/comment");
const Chapter = require("../models/chapter");

const novel_seeds = [
    
]

const seed = async () => {
    await Novel.deleteMany();
    console.log('Deleted All the Novels!')

    await Comment.deleteMany();
    console.log('Deleted All the Comments!')

    await Chapter.deleteMany();
    console.log('Deleted All the Chapter!')

    for (const novel_seed of novel_seeds) {
        console.log("Create a new novel: ", novel.title)
        await Novel.create(novel_seed);
        await Chapter.create();
        await Comment.create({
            text: "Test the comment",
            novelId: novel._id
        })
        console.log("Create a new comment!")
    }
}

module.exports = seed;*/