const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js")
const Listing = require("../models/listing.js");
require('dotenv').config();


const { isLoggedIn, isOwner, validateListing, isreviewAuthor } = require("../middleware.js");


const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../CloudConfig.js");
const upload = multer({ storage });
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

//new Routez
router.get("/new", isLoggedIn, listingController.RenderNewForm);

router
    .route("/:id")
    .get(isLoggedIn, wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.UpdateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));





//CREATE ROUTE post




//EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.RenderEditform));

//UPDATE ROUTE


//DELETE ROUTE


module.exports = router;