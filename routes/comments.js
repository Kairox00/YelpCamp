const express = require("express");
const router = express.Router({mergeParams: true});
const Comment = require("../models/comment");
const Campground = require("../models/campground");
const middleware = require("../middleware"); 


//NEW COMMENT ROUTE
router.get("/new", middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
       err?console.log(err)
       :res.render("comments/new",{campground: campground});
    })
    
});

//CREATE COMMENT ROUTE
router.post("/", middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        err?console.log(err)
        :Comment.create(req.body.comment,(err,newComment)=>{
           err?console.log(err):
            newComment.author.username = req.user.username;
            newComment.author.id = req.user._id;
            newComment.save();
            campground.comments.push(newComment);
            // console.log(newComment.text);
            campground.save();
            res.redirect("/campgrounds/"+req.params.id);
       });
        
    });
    
});

//EDIT COMMENT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwner,(req,res)=>{
    Comment.findById(req.params.comment_id,(err,foundComment)=>{
        if(err){
            console.log(err);
        }
        else{
            Comment.findById(req)
            res.render("comments/edit",{comment: foundComment, campground_id: req.params.id});
        }
    })
});

//UPDATE COMMENT ROUTE
router.put("/:comment_id",middleware.checkCommentOwner,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,updatedComment)=>{
        if(err){
            res.redirect("back")
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//DELETE COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwner, (req,res)=>{
    Comment.findByIdAndDelete(req.params.comment_id,(err)=>{
        if(err){
            res.redirect("back")
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})


//MIDDLEWARE




module.exports = router;