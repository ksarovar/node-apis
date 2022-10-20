require("dotenv").config();
const express=require("express");
const mongoose=require('mongoose');
// const passwordReset = require("./routes/router");
const users = require("./routes/users");
const app=express();
app.use(express.json());
const port=process.env.PORT||8080;
//connecting db
mongoose.connect('mongodb+srv://krushna:krushna@cluster0.1gsvjxn.mongodb.net/krushnadb?retryWrites=true&w=majority').then(()=>{
    console.log("database connected");
     
}).catch((err)=>{
console.log(err);
})

//routes
app.use("/api/users", users);


app.listen(port,()=>console.log(`listening on port ${port}`));