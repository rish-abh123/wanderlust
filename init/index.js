const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
.then(()=>{
    console.log("successfull connection");
})
.catch((err)=>{
    console.log(err);
})

 const initDB =  async ()=>{
 await Listing.deleteMany({});
 initData.data = initData.data.map((obj)=>({...obj,owner:"68a206fd50de6ba8b42f5eb1"}));
 await Listing.insertMany(initData.data);
 console.log("data was initialized");
}
initDB();
