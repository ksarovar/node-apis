

require("./connectionDB");

const staticContent = require("./model/staticContent")

const express = require("express");

const app = express();

app.use(express.json());

app.post('/addcontent', async (req, res) => {
    const doc = new staticContent({
        type: req.body.type,
        title: req.body.title,
        description: req.body.description,

    })
    doc.save();
    return res.status(200).send({ status: "Success", message: " Added static content successfully " },
    )
});

app.get('/getstaticcontent', async (req, res) => {
    const staticContentData=await staticContent.find();
    console.log(staticContentData)
});
app.listen(3000, () => {
    console.log(" app is running");
})




