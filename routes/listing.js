const express = require('express');
const router=express.Router();
const wrapAsync =require("../utils/asyncWrap");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const multer = require('multer');
const { storage } = require('../cloudinaryConfig.js');
const upload = multer({ storage });

const listingController=require('../controller/listing.js')

// index route
router.route("/")
.get(wrapAsync(listingController.index ))
.post(isLoggedIn,upload.array('listing[image]'),wrapAsync(listingController.createNewListing))



 
//new 
router.get("/new",isLoggedIn,listingController.renderNewForm)


// edit

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editDetails))

// show details
//id route 
router.route("/:id")
.get(wrapAsync(listingController.showDetails))
.put(isLoggedIn,isOwner,upload.array('listing[image]'), validateListing, wrapAsync(listingController.updateDetails))  // update
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))       // delete

module.exports= router;