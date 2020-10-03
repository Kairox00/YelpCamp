//SETUP
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose =require("mongoose");
const Campground = require("./models/campground");
const seedDB = require("./seeds");
const Comment = require("./models/comment");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const methodOverride = require("method-override");
const flash = require("connect-flash");

const 
    commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// seedDB(); 
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true , useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash()); 


//PASSPORT CONFIG

app.use(require("express-session")({
    secret:"Secter whatev",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


//LISTENER
app.listen(process.env.PORT, process.env.IP, function(){
    console.log(process.env.PORT);
});
