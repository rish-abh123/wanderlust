const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const usersControllers = require("../controllers/users.js")


//signup
router
.route("/signup")
.get(usersControllers.renderSignUp)
.post(wrapAsync(usersControllers.signUp))

//login route
router
.route("/login")
.get((req,res)=>{
  res.render("users/login.ejs");
})
.post(saveRedirectUrl,
  passport.authenticate("local",
    {
      failureRedirect:"/login",
      failureFlash:true
    }
  ),
  usersControllers.login
)
//logout route
router.get("/logout",usersControllers.logout);
module.exports = router;