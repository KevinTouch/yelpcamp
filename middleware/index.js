const middlewareObj = {},
	  Campground	= require("../models/campground.js"),
	  Comment 		= require("../models/comment.js");

middlewareObj.isLoggedIn = (req, res, next) =>{
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}


middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	if(req.isAuthenticated()){	
		Campground.findById(req.params.id, (err, foundCampground)=>{
			if (err || !foundCampground) {
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				if (foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
	if(req.isAuthenticated()){	
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
			if (err || !foundComment) {
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				if (foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

module.exports = middlewareObj;