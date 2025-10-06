const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async(req,res,next)=>{
   
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
};

module.exports.renderNewForm = (req,res)=>{
     res.render("listings/new.ejs");
 };

 module.exports.editForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you want to edit does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});

}

module.exports.updateListing = async(req,res)=>{
    // if(!req.body.Listing){
    //     throw new ExpressError(400,"some valid data for listing");
    // }
    let {id} = req.params;
     const updatedListing =  await Listing.findByIdAndUpdate(id,{...req.body.Listing});
     if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url,filename};
        await updatedListing.save();
     }
     console.log(updatedListing);
         req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);

}
module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate("owner")
    .populate({path:"reviews",
    populate:{
        path:"author",
    },
    })

    if(!listing){
        req.flash("error","listing you find does not exist");
       return res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});

}

module.exports.createListing =async (req,res,next)=>{

 let response = await geocodingClient.forwardGeocode({
  
  query: req.body.Listing.location,
  limit: 1
})
  .send()

    let url = req.file.path;
    let filename = req.file.filename;

        const newList = new Listing(req.body.Listing);
    newList.owner =req.user._id;
    newList.image = {url,filename};
    newList.geometry = response.body.features[0].geometry;
    await newList.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
 }

 module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
 const deletedListing  = await Listing.findByIdAndDelete(id);
     req.flash("success"," listing deleted");
 console.log(deletedListing);
 res.redirect("/listings");
}