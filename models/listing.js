const mongoose = require('mongoose');
const Review  = require('./review');
const { ref } = require('joi');
const Schema = mongoose.Schema; 
const listingSchema = new Schema({
    title: { type: String,required: true  },
    location: { type: String, required: true },
    country: { type: String,required: true  },
    price: { type: Number, required: true},
    description: { type: String, required: true },
image: {
    // filename: { type: String, default: "listingimage" },
    // url: { 
    //   type: String, 
    //   default: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=773&auto=format&fit=crop",
    //   set: v => v === "" 
    //     ? "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=773&auto=format&fit=crop"
    //     : v
    // }
    filename:String,
    url:String,
    
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }

    
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
})

module.exports = mongoose.model('Listing', listingSchema);
