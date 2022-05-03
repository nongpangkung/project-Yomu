const { model } = require("mongoose");
const Comment = require("../models/comment");

const checkCommentOwner = async (req, res, next) => {
    if (req.isAuthenticated()) {
        const comment = await Comment.findById(req.params.commentId).exec();
        if (comment.owner.id.equals(req.user._id)) {
            next();
        } else {
            res.redirect(`back`)
        }
    } else {
        res.redirect("/login")
    }
}

module.exports = checkCommentOwner;