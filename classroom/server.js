const express = require("express");
const session = require("express-session");
const  flash = require("connect-flash");
const path = require("path");

// app.set("views",path.join(__dirname,"views"));

const app = express();
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


const sessionOptions = {
    secret:"mysupersecretstring",
    resave:false,
  saveUninitialized :true
}
app.use(session(sessionOptions));
app.use(flash());

app.get("/test",(req,res)=>{
    res.send("test successfull");
})

app.get("/getcount",(req,res)=>{
     if(req.session.count){
        req.session.count ++;
     }else{
        req.session.count = 1;
     }
     res.send(`You send a request ${req.session.count} times`)
})

// storing info and flash msgs and use od locals
app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    req.session.name = name;
   if(name === "anonymous"){
    req.flash("error","user not registered");
   }else{
    req.flash("success","user register successfully");
   }

    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    res.locals.successMsg = req.flash("success");
     res.locals.errorMsg = req.flash("error");
   res.render("page.ejs",{name: req.session.name})
})



app.listen(3000,()=>{
    console.log("app is listening on port 3000");
})