const mongoose = require("mongoose")
// create a schema

const otp=mongoose.Schema({
   
    otp:{type:String},
   
   },{timestamps:true});
otp.index({createdAt: 1},{expireAfterSeconds:30000})
    //table/collection


    module.exports = mongoose.model('otp',otp);