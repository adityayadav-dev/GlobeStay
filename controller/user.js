const User=require("../models/user.js");



module.exports.userSignup= async(req,res,next)=>{
    try {

        let {email,username,password}=req.body;
        const newUser= new User({email,username})
        let registeredUser= await User.register(newUser,password);
        // console.log(registeredUser)
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }else{
                req.flash("success","Welcome To GlobeStay ")
                res.redirect("/listings")
            }
        })
        
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}


module.exports.userlogin=async (req, res) => {
        req.flash("success", "Welcome back to GlobeStay!");
        let redirectUrl=res.locals.redirectUrl||"/listings"
        res.redirect(redirectUrl);   // redirect to homepage or dashboard
    }

module.exports.userLogout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
          return  next(err)
        }else{
            req.flash("success","Logged Out Sucessfully!!! ")
            res.redirect("/listings")
        }
    })
}