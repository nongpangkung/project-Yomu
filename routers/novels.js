const express = require("express");
const router = express.Router();
const Novel = require("../models/novel");
const Comment = require("../models/comment");
const Chapter = require("../models/chapter");
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const checkNovelOwner = require('../utils/checkNovelOwner')

router.get("/", async (req, res) => {
    try {
        const novels = await Novel.find().exec();
        const categoryname =  req.params.categoryName;
        const typename =  req.params.typeName;
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
        }
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
              return "This!, " + this.topicname
            }
        }
        var cate = new Category(req.params.categoryName);

        const novels = await Novel.find({category: req.params.categoryName}).exec()
        const categoryname = cate.show()
        const typename =  req.params.typeName;
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
        const novel = await Novel.find().exec();
        res.render("mynovel", {novel});
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/mynovel POST");
    }
})

router.get("/addnovel",ensureAuthenticated, (req, res) => {
    res.render("add_novel");
})

router.get("/:id", async (req, res) => {
    try {
        const novel = await Novel.findById(req.params.id).exec();
        const chapters = await Chapter.find({novelId: req.params.id});
        const comments = await Comment.find({novelId: req.params.id});
        res.render("show_novel",{novel,chapters,comments})
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