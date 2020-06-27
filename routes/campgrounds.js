const express 	 = require("express"),
 	  router 	 = express.Router(),
	  Campground = require("../models/campground"),
	  middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", (req, res)=> {
	Campground.find({}, (err, allCampgrounds)=>{
		if(err){
			console.log(err)
		} else {
			res.render("campgrounds/index", 
					   {campgrounds: allCampgrounds,});
		}
	})
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res)=> {
	const name  = req.body.name,
	 	  image = req.body.image,
	 	  desc  = req.body.description,
		  author = {
			  id: req.user._id,
			  username: req.user.username
		  },
	 	  newCampground = {
			  name: name, 
			  image: image, 
			  description: desc,
			  author: author
		  };
	Campground.create(newCampground, (err, newlyCreated)=>{
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	})
});


// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) =>{
	res.render("campgrounds/new");
});


// SHOW - shows more info about one campground
router.get("/:id", (req, res) =>{
	Campground.findById(req.params.id).populate("comments").exec(
		(err, foundCampground)=>{
			if(err|| !foundCampground){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				res.render("campgrounds/show", {campground: foundCampground});
			}
	});
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findById(req.params.id, 
		(err, foundCampground)=>{
			res.render("campgrounds/edit", {campground: foundCampground});	
		});
});


// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	// find and update the correct campgrounds
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, 
		(err, updatedCampground)=>{
			if (err) {
				res.redirect("/campgrounds/");			
			} else {
				res.redirect("/campgrounds/" + req.params.id);
			}
	})
})

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, 
		(err)=>{
			if (err) {
				res.redirect("/campgrounds");			
			} else {
				res.redirect("/campgrounds");
			}
	})
})


module.exports = router;