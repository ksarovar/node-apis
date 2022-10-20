var nodemailer = require("nodemailer");
const otp = require("otp-generator")

require("./connectionDB");
const otpdb = require("./model/userSchema");
const signupdb = require("./model/signupSchema")
const validator = require("email-validator")
const bcrypt = require("bcrypt")

const express = require("express");
const { findOneAndDelete } = require("./model/userSchema");
const app = express();

app.use(express.json());

app.get('/getdata', async (req, res) => {


    const data = await signupdb.find()
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
        const validemail = await signupdb.findOne({ email: email })
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
                    console.log("emailsent");
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
app.post('/verify', async (req, res) => {

    const { emailOTP, email, mobile } = req.body

    if (mobile) {
        const validmobile = await signupdb.findOne({ mobile: mobile })
        console.log(validmobile);
        if (validmobile) {
            return res.status(400).send({ status: "Error", message: " mobile already exist" })
        }
        else {
            if (emailOTP) {
                const validUser = await otpdb.findOne({ otp: emailOTP })
                if (validUser) {
                    // const deleteOTP = await otpdb.findOneAndDelete({otp : emailOTP})
                    const pass = req.body.password;
                    const salt = await bcrypt.genSalt(10)
                    const hashPass = await bcrypt.hash(pass, salt)
                    const doc = new signupdb({
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mobile,
                        password: hashPass,
                        Address: req.body.Address,
                        DateOfBirth: req.body.DateOfBirth,
                    })
                    doc.save();
                    return res.status(200).send({ status: "Success", message: " User registered Successfully! " },
                    )

                } else {
                    return res.status(400).send({ status: "Error", message: " Invalid OTP! send otp again " })
                }
            } else {
                return res.status(400).send({ status: "Error", message: " Please Enter OTP! " })
            }

        }
    }



});




//edit profile
app.put('/:id', async(req, res, next) => {
    console.log(req.params.id);
    const pass = req.body.password;
    const salt = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(pass, salt)
//email mobile should be unique
const { email,mobile } = req.body

if (email) {
    const validemail = await signupdb.findOne({ email: email })
    console.log(validemail);
    if (validemail) {

        return res.status(400).send({ status: "Error", message: " email already exist" })

    }
    if(mobile) {
        const validmobile = await signupdb.findOne({ mobile: mobile })
        console.log(validmobile);
        if (validmobile) {
            return res.status(400).send({ status: "Error", message: " mobile already exist" })
        }
        else{
            signupdb.findOneAndUpdate({ _id: req.params.id }, {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    password: hashPass,
                    Address: req.body.Address,
                    DateOfBirth: req.body.DateOfBirth,
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
        } 
    }
}
    
  
});


app.listen(3000, () => {
    console.log(" app is running");
})




