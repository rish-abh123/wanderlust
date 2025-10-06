const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingControllers = require("../controllers/listings.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})

// index,create route
router
.route("/")
 .get(wrapAsync(listingControllers.index))   
 .post(isLoggedIn,
    upload.single('Listing[image]'),
    validateListing,
    wrapAsync(listingControllers.createListing)
)

//new route
router.get("/new",isLoggedIn,listingControllers.renderNewForm);

//show,update,delete route
router
.route("/:id")
.get(wrapAsync(listingControllers.showListing))
.put(isLoggedIn,
    isOwner,
     upload.single('Listing[image]'),
    validateListing,
    wrapAsync(listingControllers.updateListing)
)
.delete(isLoggedIn,isOwner,wrapAsync(listingControllers.deleteListing))


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.editForm));

module.exports = router;