require('dotenv').config();
console.log("ENV CLOUD:", process.env.CLOUD_NAME);

const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
// const MONGO_URL = 'mongodb://127.0.0.1:27017/GlobeStay';
const dbUrl=process.env.ATLASDB_URL
const path = require('path');
const methodOverride= require("method-override");
const ejsMate =require("ejs-mate");
const ExpressError =require("./utils/expressError");
const session =require("express-session");
const flash=require("connect-flash");
const passport= require("passport");
const localStrategy=require("passport-local");
const User= require("./models/user.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const MongoStore = require('connect-mongo');
const cookieParser = require("cookie-parser");


// Routes 
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { validateListing } = require('./middleware.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)


console.log("DB URL:", dbUrl);

// Mongo store OPtions
// const store=MongoStore.create({
//    mongoUrl:dbUrl,
//    crypto:{
//     secret:"mySecretKey"
//    },
//    touchAfter:24*3600,

// })

// store.on("error",()=>{
//   console.log("Error in mongo store Session")
// })
// session Option
const sessionOption={
  // store,// this is above store 
  secret:"mySecretKey",
  resave:false,
   saveUninitialized: false,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}
app.use(cookieParser());


app.use(session(sessionOption))
app.use(flash())
// passport authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
  res.locals.listingAddedMessage=req.flash("success");
  res.locals.listingNotExists=req.flash("error");
  res.locals.currUser=req.user;
  next()

})

// Main
main()
  .then(() => {
    console.log("✅ Connected to DB");
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}/listings`);
    });
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// Home Path

app.get('/', (req, res) => {
  res.send('working');
});

// Routerss
// Listings by  Routes
app.use("/listings",listingsRouter);

// Reviews by  Routes
app.use("/listings/:id/reviews",reviewsRouter);

// user by Routes
app.use("/",userRouter)

// Catch-all 404
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
    
  console.log(err);   // <-- ADD THIS
  const { statusCode = 500,message="Something went Wrong "} = err;
  
  res.status(statusCode).render("error.ejs",{message});
});

