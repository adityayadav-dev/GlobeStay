const Listing = require('../models/listing.js');

//index
module.exports.index=async (req, res) => {
   
        const alllistings = await Listing.find({}); 
        res.render("listing/index", { alllistings });
        console.log("working");
      }


module.exports.renderNewForm=(req,res)=>{
  
  res.render("listing/new.ejs")
}

// create

module.exports.createNewListing=async(req,res)=>{
// let{title,country,location,price,image,description}=req.body;
// let listing= req.body.listing
let url=req.files[0].path
let filename=req.files[0].filename

// console.log(req.body);
const newListing=new Listing(req.body.listing)
newListing.owner= req.user._id
newListing.image={url,filename}

await newListing.save();
req.flash("success","Listing Added  SucessFully !!!")
res.redirect("/listings")

}

module.exports.showDetails=async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author", // This tells Mongoose to swap the ID for the User Object
      },
    })
    .populate("owner");
// console.log("DEBUG REVIEWS:", JSON.stringify(listing.reviews, null, 2));
    if(!listing){
      req.flash("error","Listing You Searched Doesn't exists !! ")
      return  res.redirect("/listings")
    }
    res.render("listing/show.ejs",{listing})
}

//edit form

module.exports.editDetails=async(req,res)=>{
  let {id}=req.params;
  let listing= await Listing.findById(id)
 let OgUrl= listing.image.url
 OgUrl=OgUrl.replace("/upload","/upload/h_150,w_250")
  res.render("listing/edit.ejs",{listing,OgUrl})
}

//update

module.exports.updateDetails=async (req, res) => {
  const { id } = req.params;
  const oldListing = await Listing.findById(id);
  const updatedData = { ...req.body.listing };

  // if user left the image URL blank, keep the old one
  // if (!updatedData.image.url) {
  //   updatedData.image = oldListing.image;
  // }
 

 let listing= await Listing.findByIdAndUpdate(id, updatedData);
if(typeof req.files[0] !=="undefined"){


    let url=req.files[0].path
    let filename=req.files[0].filename

    listing.image={url,filename}
    await listing.save()
}
  req.flash("success","Listing Edited SucessFully !!!")
  res.redirect(`/listings/${id}`);
}

//
module.exports.destroyListing=async(req,res)=>{
  let {id}=req.params;
  let deletedListing= await Listing.findByIdAndDelete(id)
  console.log(deletedListing);
  req.flash("success","Listing Deleted SucessFully !!!")
  res.redirect("/listings")
}