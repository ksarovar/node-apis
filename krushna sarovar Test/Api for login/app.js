var nodemailer = require("nodemailer");
const otp = require("otp-generator")

require("./connectionDB");
const otpdb = require("./model/userSchema");

const validator = require("email-validator")
const bcrypt = require("bcrypt")

const express = require("express");
const { findOneAndDelete } = require("./model/userSchema");
const app = express();

app.use(express.json());


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

    const { emailOTP } = req.body
   
    const doc = new otpdb({

     
        email:req.body.email,
        password:req.body.password

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
app.listen(3000, () => {
    console.log(" app is running");
})




