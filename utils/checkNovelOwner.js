const { model } = require("mongoose");
const Novel = require("../models/novel");

const checkNovelOwner = async (req, res, next) => {
    if (req.isAuthenticated()) {
        const novel = await Novel.findById(req.params.id).exec();
        if (novel.owner.id.equals(req.user._id)) {
            next();
        } else {
            res.redirect(`back`)
        }
    } else {
        res.redirect("/login")
    }
}

module.exports = checkNovelOwner;