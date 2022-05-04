const express = require("express");
const { serializeUser } = require("passport");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Novel = require("../models/novel");

// Index Page
router.get('/', (req, res) => {
  res.render('index')
});

// Account Page
router.get("/account", ensureAuthenticated , async (req, res) => {
  try {
      const novels = await Novel.find().exec()
      res.render("account", {novels});
  } catch (err) {
      console.log(err);
      res.send("you broke it... /account");
  }
})

module.exports = router;