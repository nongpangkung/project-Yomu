const express = require("express");
const router = express.Router();
const Novel = require("../models/novel");
const Comment = require("../models/comment");
const Chapter = require("../models/chapter");
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const checkNovelOwner = require('../utils/checkNovelOwner')

router.get("/", async (req, res) => {
    try {
        function Category(topicname) {
            this.topicname = topicname
            this.show = function () {
              return "" + this.topicname
            }
        }

        function Type(typename) {
            this.typename = typename
            this.showty = function () {
              return "" + this.typename
            }
        }

        var type = new Type(req.params.typeName)
        var cate = new Category(req.params.categoryName);
        const categoryname = cate.show()
        const typename =  type.showty()
        res.render("novels", {novels,categoryname,typename});
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels");
    }
})

//New
router.post("/", ensureAuthenticated , async (req, res) => {
    const newNovel = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        intro: req.body.intro,
        rate: req.body.rate,
        publisher: req.body.publisher,
        date: Date.now(),
        newdate: Date.now(),
        type: req.body.type,
        owner: {
            id: req.user._id,
            name: req.user.name
        },
        upvote: [req.user.name],
        downvotes: []
    }

    try {
        const novel = await Novel.create(newNovel);
        console.log(novel)
        res.redirect("/novels/"+ novel._id);
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels POST");
    }
})

//Search
router.get("/search", async (req, res) => {
    try {
        const novels = await Novel.find({
            $text: {
                $search: req.query.term
            }
        }).exec()
        res.render("novels", {novels});
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/search SEARCH");
    }
})

//Category
router.get("/category/:categoryName", async (req, res) => {
    try {
        function Category(topicname) {
            this.topicname = topicname
            this.show = function () {
              return "" + this.topicname
            }
        }

        function Type(typename) {
            this.typename = typename
            this.showty = function () {
              return "" + this.typename
            }
        }

        var type = new Type(req.params.typeName)
        var cate = new Category(req.params.categoryName);

        const novels = await Novel.find({category: req.params.categoryName}).exec()
        const categoryname = cate.show()
        const typename =  type.showty()
        res.render("novels",{novels,categoryname,typename})
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/:id");
    }
})

//Type
router.get("/type/:typeName", async (req, res) => {
    try {
        const novels = await Novel.find({type: req.params.typeName}).exec()
        const categoryname =  req.params.categoryName;
        const typename =  req.params.typeName;
        res.render("novels",{novels,categoryname,typename})
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/:id");
    }
})

//Show
router.get("/mynovels", ensureAuthenticated , async (req, res) => {
    try {
        function Category(topicname) {
            this.topicname = topicname
            this.show = function () {
              return "" + this.topicname
            }
        }

        function Type(typename) {
            this.typename = typename
            this.showty = function () {
              return "" + this.typename
            }
        }

        var type = new Type(req.params.typeName)
        var cate = new Category(req.params.categoryName);
        const categoryname = cate.show()
        const typename =  type.showty()
        const novel = await Novel.find().exec();
        res.render("mynovel", {novel,categoryname,typename});
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/mynovel POST");
    }
})

//Vote
router.post("/vote", ensureAuthenticated ,async (req, res) => {

    const novel = await Novel.findById(req.body.novelId)
    const alreadyUpvoted = novel.upvote.indexOf(req.user.name)
    const alreadyDownvoted = novel.downvotes.indexOf(req.user.name)
    
    let response = {}
    
    if (alreadyDownvoted === -1 && alreadyDownvoted === -1) {
        if(req.body.voteType === 'up') {
            novel.upvote.push(req.user.name)
            novel.save()
            response = {message : "Upvote tallied!", code: 1}
        } else if (req.body.voteType === 'down' ) {
            novel.downvotes.push(req.user.name)
            novel.save()
            response = {message : "Downvote tallied!", code: -1}
        } else {
            response = {message : "Error 1", code: "err"}
        }
    } else if(alreadyUpvoted >= 0) {
        if (req.body.voteType === 'up') {
            novel.upvote.splice(alreadyUpvoted, 1)
            novel.save()
            response = {message : "Upvote removed", code: 0}
        } else if (req.body.voteType === 'down') {
            novel.upvote.splice(alreadyUpvoted, 1)
            novel.downvotes.push(req.user.name)
            novel.save()
            response ={message : "Changed to downvote", code: -1}
        } else {
            response = {message :"Error 2",code: "err"}
        }
    } else if(alreadyDownvoted >= 0) {
        if (req.body.voteType === 'up') {
            novel.downvotes.splice(alreadyDownvoted, 1)
            novel.upvote.push(req.user.name)
            novel.save()
            response = {message :"Change to upvote",code: 1}
        } else if (req.body.voteType === 'down') {
            novel.downvotes.splice(alreadyDownvoted, 1)
            novel.save()
            response = {message :"Removed downvote", code: 0}
        } else {
            response = {message :"Error 3", code: "err"}
        }

    } else {
        response = {message :"Error 4", code: "err"}
    }

    response.score = novel.upvote.length - novel.downvotes.length;

    res.json(response);
})

router.get("/addnovel",ensureAuthenticated, (req, res) => {
    res.render("add_novel");
})

router.get("/:id", async (req, res) => {
    try {
        function Category(topicname) {
            this.topicname = topicname
            this.show = function () {
              return "" + this.topicname
            }
        }

        function Type(typename) {
            this.typename = typename
            this.showty = function () {
              return "" + this.typename
            }
        }

        var type = new Type(req.params.typeName)
        var cate = new Category(req.params.categoryName);
        const categoryname = cate.show()
        const typename =  type.showty()
        const novel = await Novel.findById(req.params.id).exec();
        const chapters = await Chapter.find({novelId: req.params.id});
        const comments = await Comment.find({novelId: req.params.id});
        res.render("show_novel",{novel,chapters,comments,categoryname,typename})
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/:id");
    }
})

//Edit
router.get("/:id/edit",checkNovelOwner ,async (req, res) => {
    const novel = await Novel.findById(req.params.id).exec();
    res.render("edit_novel", {novel})
})

router.put("/:id", checkNovelOwner ,async (req, res) => {
    console.log(req.body);
    const novelBody = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        tag: req.body.tag,
        intro: req.body.intro,
        rate: req.body.rate,
        publisher: req.body.publisher,
        newdate: Date.now(),
        type: req.body.type
    }

    try {
        const novel = await Novel.findByIdAndUpdate(req.params.id, novelBody, {new: true}).exec();
        res.redirect(`/novels/${req.params.id}`)
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/:id PUT");
    }
})

//Delete Novel
router.delete("/:id", checkNovelOwner ,async (req, res) => {
    try {
        const deletedNovel = await Novel.findByIdAndDelete(req.params.id).exec();
        console.log("Deleted: ", deletedNovel);
        res.redirect("/novels/mynovels");
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/:id DELETE");
    }
    
})

//Manage Chapter

router.get("/:id/addchapter", (req, res) => {
    res.render("add_chapter", {novelId: req.params.id});
})

router.post("/:id/addchapter", async (req, res) => {
    const newChapter = {
        number: req.body.number,
        title: req.body.title,
        text: req.body.text,
        novelId: req.body.novelId,
        date: Date.now()
    }
    try {
        const chapters = await Chapter.create(newChapter);
        console.log(chapters)
        res.redirect(`/novels/${req.body.novelId}`)
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/:id/addchapter");
    }
})

router.get("/:id/:id", async (req, res) => {
    try {
        const chapters = await Chapter.findById(req.params.id).exec();
        const novel = await Novel.findById(chapters.novelId)
        res.render("show_chapter",{novel,chapters})
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/:id/:id");
    }
})

//edit chapter
router.get("/:id/:id/edit", async (req, res) => {
    try {
        const chapters = await Chapter.findById(req.params.id).exec();
        const novel = await Novel.findById(chapters.novelId)
        res.render("edit_chapter",{novel,chapters})
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/:id/:id/edit ");
    }
})

router.put("/:id/:id", async (req, res) => {
    const ChapterBody = {
        number: req.body.number,
        title: req.body.title,
        text: req.body.text,
        novelId: req.body.novelId,
        date: Date.now()
    }
    try {
        const chapters = await Chapter.findByIdAndUpdate(req.params.id, ChapterBody,{new: true}).exec();
        const novel = await Novel.findById(chapters.novelId)
        res.redirect(`/novels/${chapters.novelId}/${req.params.id}`)
    } catch (err) {

    }
})



//Delete Chap
router.delete("/:id/:id", async (req, res) => {
    try {
        const deletedChapter = await Chapter.findByIdAndDelete(req.params.id).exec();
        console.log("Deleted: ", deletedChapter);
        res.redirect("/novels/mynovel");
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/:id/:id DELETE");
    }
})

module.exports = router;