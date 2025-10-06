const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");

const listingSchema = Schema({
    title:{
        type:String,
        required:true
    },
   description:{
        type:String,
    },
    image:{
        filename:String,
        url:String
        },
    
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review"
    }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }

    }
});

listingSchema.post("findOneAndDelete",async (listing)=>{
if(listing){
    await review.deleteMany({_id:{$in:listing.reviews}});
}
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;