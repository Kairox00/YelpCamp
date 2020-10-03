var Campground = require("../models/campground");
var Comment = require("../models/comment");

const middlewareObj= {};

middlewareObj.isLoggedIn =
    function(req,res,next){
        if (req.isAuthenticated()){
            return next();
        }
        req.flash("error","Please Login First!");
        res.redirect("/login");
    }
    
middlewareObj.checkCommentOwner = 
    function(req,res,next){
             if(req.isAuthenticated()){
                Comment.findById(req.params.comment_id, (err,foundComment)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        if(foundComment.author.id.equals(req.user._id)){
                            // console.log(req.params.id)
                            next();
                        }
                        else{
                            req.flash("error","You don't have permission to do that");
                            res.redirect("/campgrounds/"+req.params.id);
                        }
                    }
                }); 
            }
            else{
                req.flash("error","You need to be logged in");
                res.redirect("/login");
            }
        }
    
middlewareObj.checkCampOwner = 
    function(req,res,next){
             if(req.isAuthenticated()){
                Campground.findById(req.params.id, (err,foundCampground)=>{
                    if(err){
                        req.flash("error", 'Camp not found');
                        res.redirect("back");
                    }
                    else{
                        if(foundCampground.author.id.equals(req.user._id)){
                            next();
                        }
                        else{
                            req.flash("error","You don't have permission to do that");
                            res.redirect("/campgrounds/"+req.params.id);
                        }
                        
                    }
                }); 
            }
            else{
                req.flash("error","You need to be logged in bruh");
                res.redirect("/login");
            }
        }

module.exports = middlewareObj