var nodemailer = require("nodemailer");
const otp = require("otp-generator")

require("./connectionDB");
const otpdb = require("./model/userSchema");
const signup = require("./model/signupSchema")

const validator = require("email-validator")
const bcrypt = require("bcrypt")

const express = require("express");
const { findOneAndDelete } = require("./model/userSchema");
const app = express();

app.use(express.json());
app.get('/getdata', async (req, res) => {


    const data = await signup.find()
    console.log(data);
    res.send(data)
})


app.post('/genotp', async (req, res) => {

    const getotp = otp.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, digits: true })

    // console.log(getotp);

    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'krushna.sarovar@indicchain.com',
            pass: 'duitbkcmgbiadosi'
        }
    })

    //send email
    const { email } = req.body
    if (email) {
        const validemail = await otpdb.findOne({ email: email })
        console.log(validemail);
        if (validemail) {

            return res.status(400).send({ status: "Error", message: " email already exist" })

        }
        else {
            // console.log(validemail);
            var mailOptions = {
                from: 'krushna.sarovar@indicchain.com',
                to: req.body.email,
                subject: 'otp verification',
                text: 'your otp is ' + getotp
            }

            transport.sendMail(mailOptions, function (error, info) {
                if (error) {

                    console.log(error);

                } else {
                    console.log('====================================');
                    console.log("otp send on mail");
                    console.log('====================================');
                }
            })
        }
    }


    const doc = new otpdb({

        otp: getotp,
    })
    doc.save()
})
app.post('/signup', async (req, res) => {

    const { emailOTP } = req.body
    const pass = req.body.password;
    const salt = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(pass, salt)

    const doc = new signup({


        email: req.body.email,
        password: hashPass

    })
    doc.save()
    if (emailOTP) {
        const validUser = await otpdb.findOne({ otp: emailOTP })
        if (validUser) {

            return res.status(200).send({ status: "Success", message: " User registered Successfully! " },
            )

        } else {
            return res.status(400).send({ status: "Error", message: " Invalid OTP! send otp again " })
        }
    } else {
        return res.status(400).send({ status: "Error", message: " Please Enter OTP! " })
    }


}



);

app.put('/reset/:id', async(req, res, next) =>{

    signup.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
          
            password: req.body.password,
            
        }
       
    }) 
    .then(result=>{
        res.status(200).json({
            updated_signupdn:result
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
  
});

app.put('/forgotpass/:id', async(req, res, next) =>{

    signup.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
          
            password: req.body.Password,
            
        }
       
    }) 
    .then(result=>{
        res.status(200).json({
            updated_signupdn:result
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
  
});



app.listen(3000, () => {
    console.log(" app is running");
})




