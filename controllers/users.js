const User = require("../models/user.js");

module.exports.renderSignUp = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async(req,res)=>{
   try{
     let {username,email,password} = req.body;
    const newUser = new User({username,email});
   const registeredUser =  await User.register(newUser,password);
   req.login(registeredUser,(err)=>{
    if(err){
      return next(err);
    }
     req.flash("success","Welcome to wonderlust");
     res.redirect("/listings");
   });
   }
   catch(err){
    req.flash("error",err.message)
   res.redirect("/signup");
   } 
}
 
module.exports.renderLogin = (req,res)=>{
  res.render("users/login.ejs");
}
module.exports.login = (req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
  
  module.exports.logout = (req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","you are logged out");
    res.redirect("/listings");
  })
}