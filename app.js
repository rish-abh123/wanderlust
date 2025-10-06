if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const session = require("express-session");

const MongoStore = require('connect-mongo');
const flash = require("connect-flash"); 
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const userRoutes = require("./routes/user.js");
const Listing = require("../models/listing.js");

const app = express();
app.set("view engine","ejs");
app.engine("ejs",ejsMate);

app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const atlasUrl=process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("connection Successfull");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(atlasUrl);
}
const store = MongoStore.create({
    mongoUrl:atlasUrl,
      crypto: {
    secret: process.env.SECRET_KEY
  },
  touchAfter: 24 * 3600
})

store.on("error",(err)=>{
    console.log("Error in MONGO SESSION STORE",err);
})
const sessionOptions = {
    store,
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true,
   cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
   }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/", async (req, res) => {
  try {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// for all Listings routes
app.use("/listings",listings);
// for all Review routes
app.use("/listings/:id/reviews",reviews);
//for all users routes
app.use("/",userRoutes);
// error-handling middleware
app.use((err,req,res,next)=>{
  let {statusCode = 500,message="something went wrong"} = err;
  
   res.status(statusCode).render("error.ejs",{err});
})

app.listen(8080,()=>{
    console.log("app is listening on port 8080");
})

