const express = require('express');
const router=express.Router();
const wrapAsync =require("../utils/asyncWrap");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userControler=require("../controller/user.js")

// signup 
router.route("/signup")
.get((req,res)=>{   res.render("users/signup.ejs")  })
.post(wrapAsync(userControler.userSignup))

// Show login page
router.route("/login")
.get( (req, res) => {  res.render("users/login.ejs");  })
.post(saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userControler.userlogin
)

// logout

router.get("/logout",userControler.userLogout)
  
module.exports=router;