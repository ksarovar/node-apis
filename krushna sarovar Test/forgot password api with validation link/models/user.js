const mongoose = require('mongoose');
const Joi=require("joi")
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, min: 6 },
    email: { type: String, required: true, min: 6, max: 255 },
    password: { type: String, required: true, min: 6},

})

const User = mongoose.model("user", userSchema);

const validate=(user)=>{
    const schema=Joi.object({
        name:Joi.string().required(),
        email:Joi.string().required(),
       password:Joi.string().required(),
    }) 
    return schema.validate(user);
   
}
module.exports={User,validate}