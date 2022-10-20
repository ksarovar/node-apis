const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")

router.post("/", async (req, res) => {

    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //hash pass
        const pass = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(pass, salt)
        //........

        const user = await new User({
            name : req.body.name,
            email: req.body.email,
            password: hashPass
        }).save();

        res.send(user);
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

module.exports = router;