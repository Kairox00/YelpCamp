const express=require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");


//ROOT ROUTE

router.get('/',(req,res)=>{
    res.render('landing');
});

//============
//AUTH ROUTES
//============

router.get('/register',(req,res)=>{
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            res.redirect("back");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds"); 
        });
    });
});

var referer;
router.get("/login",(req,res)=>{
    referer = req.get('referer');
    res.render("login");
    
});


router.post("/login",passport.authenticate("local",{
    // successRedirect:  "/campgrounds",
    failureRedirect: "/login"
    
}),(req,res)=>{
    console.log(req.get('referer'));
    var destination;
    if(referer == undefined){
        console.log("done comparing");
        destination = "/campgrounds";
    }
    else{
        console.log("getting back");
        destination = referer;
    }
    res.redirect(destination);
});

router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Successfully Logged Out")
    res.redirect("/");
});


module.exports = router;