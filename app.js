// NPM Imports
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('cookie-session');
const expressLayouts = require('express-ejs-layouts');

// Passport Config
require('./config/passport')(passport);

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

  

app.listen(process.env.PORT || 3000)

/*const seed = require('./utils/seed');
seed();*/


app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(morgan('tiny'));

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Route Import
const novelRoutes = require('./routers/novels');
const commentRoutes = require('./routers/comments');
const indexRoutes = require('./routers/index');
const userRoutes = require('./routers/users');

// Current User Middleware Config
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
})

// test

// Use Routes
app.use("/",indexRoutes)
app.use("/",userRoutes)
app.use("/novels",novelRoutes)
app.use("/novels/:id",commentRoutes)

// Connect DB
mongoose.connect('mongodb+srv://Pangkung:290543Pang@yomu.en6v6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true});






