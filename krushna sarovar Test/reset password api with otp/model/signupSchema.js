const mongoose = require("mongoose")
// create a schema

const signup=mongoose.Schema({
    email:{type:String},
    otp:{type:String},
    password:{type:String}
   })
    //table/collection


    module.exports = mongoose.model('signup',signup);