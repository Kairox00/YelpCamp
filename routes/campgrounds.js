const express=require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

//CAMPGROUNDS GET ROUTE

router.get("/",(req,res)=>{
    Campground.find({},(err, campgrounds)=>{
        if (err){
            console.log(err);
        }
        else {
            // console.log(campgrounds);
            res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user}); 
        }
    });
       
});

//CREATING CAMPGROUND POST ROUTE

router.post("/",middleware.isLoggedIn,(req,res)=>{
    // res.send("post route");
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCamp = {name: name, price: price, image: image, description: description, author:author};
   
    Campground.create(newCamp, (err,newlyCreated)=>{
        if(err){
            console.log(err);
        }
        else{
            
            res.redirect("/campgrounds");
        }
    });
});

//NEW CAMPGROUND GET ROUTE

router.get("/new",middleware.isLoggedIn,(req,res)=>{
    res.render("campgrounds/new");
});

//SHOW INDIVIDUAL CAMPGROUND GET ROUTE

router.get("/:id",(req,res)=>{
    let id = req.params.id;
    Campground.findById(id).populate("comments").exec((err, foundCampground)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show",{campground: foundCampground}); 
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampOwner,(req,res)=>{
    Campground.findById(req.params.id, (err,foundCampground)=>{
        res.render("campgrounds/edit",{campground: foundCampground});       
    })
});



//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampOwner,(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err,updatedCampground)=>{
       if(err){
           console.log(err);
       } 
       else{
           res.redirect("/campgrounds/"+req.params.id)
;       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampOwner, (req,res)=>{
   Campground.findByIdAndDelete(req.params.id,(err)=>{
       if(err){
           res.redirect("/campgrounds");
       }
       else{
           res.redirect("/campgrounds");
       }
   }) 
});

//MIDDLEWARE





module.exports = router;