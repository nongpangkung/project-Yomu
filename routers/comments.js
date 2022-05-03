const express = require("express");
const router = express.Router({mergeParams: true});
const Novel = require("../models/novel");
const Comment = require("../models/comment");
const Chapter = require("../models/chapter");
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const checkCommentOwner = require('../utils/checkCommentOwner')


router.post("/",ensureAuthenticated, async (req, res) => {
    try {
        const comments =  await Comment.create({
            username: req.body.user,
            text: req.body.text,
            novelId: req.body.novelId,
            date: Date.now(),
            chapterId: req.body.chapterId,
            owner: {
                id: req.user._id,
                name: req.user.name
            }
        });
        console.log(comments)
        res.redirect(`/novels/${req.body.novelId}`)
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/:id POST comments");
    }
})

router.delete("/:commentId",checkCommentOwner, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        res.redirect(`/novels/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.send("you broke it... /novels/:id DELETE comments");
    }
})

module.exports = router;