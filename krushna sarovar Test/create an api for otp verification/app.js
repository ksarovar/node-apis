var nodemailer = require("nodemailer");
const otp = require("otp-generator")

require("./connectionDB");
const otpdb = require("./model/userSchema");
const validator = require("email-validator")

const express=require("express");
const { findOneAndDelete } = require("./model/userSchema");
const app=express();

app.use(express.json());





const getotp = otp.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, digits: true })

console.log(getotp);


var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'krushna.sarovar@indicchain.com',
        pass: 'duitbkcmgbiadosi'
    }
})

//send email

var mailOptions = {
    from: 'krushna.sarovar@indicchain.com',
    to: 'ksarovar5619@gmail.com',
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

const doc = new otpdb({
    email: 'ksarovar5619@gmail.com',
    otp: getotp
})
doc.save();



app.post('/verify', async(req, res) =>{

    const { emailOTP } = req.body
    console.log(emailOTP);
    if (emailOTP) {
        const validUser = await otpdb.findOne({ otp : emailOTP })
        console.log(validUser);
        if (validUser) {
            const deleteOTP = await otpdb.findOneAndDelete({otp : emailOTP})

            return res.status(200).send({ status: "Success" , message : " User Verified Successfully! " })
            
        } else {
            return res.status(400).send({ status: "Error" , message : " Invalid OTP! " })
        }
    } else {
        return res.status(400).send({ status: "Error" , message : " Please Enter OTP! " })
    }

    // if (req.body.otp == getotp) {
       
    //     console.log("You has been successfully registered")
    // }
    // else {
    //     console.log('otp', { msg: 'otp is incorrect' });
    // }
});

app.listen(3000, () => {
    console.log(" app is running");
})




