import mongoose from "mongoose";

mongoose.connect("YOUR_MONGODB_URI")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));