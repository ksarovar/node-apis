const mongoose = require("mongoose")
// create a schema

const signUp=mongoose.Schema({
   name:{type:String},
   email:{type:String},
   mobile:{type:String},
   password:{type:String},
   Address:{type:String},
   DateOfBirth:{type:Date},
   
    })
    //table/collection


    module.exports = mongoose.model('signUp',signUp);