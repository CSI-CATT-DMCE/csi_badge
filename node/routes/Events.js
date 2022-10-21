const express = require("express");
const router = express.Router();
const multer = require("multer");
const Event = require("../../schema/EventSchema");
const fs = require("fs");

const upload = multer({
  dest: "images/badges",
});

router.get("/registerevents", (req, res) => {
  res.render("registerevents");
});

router.post("/registerevents", upload.single("badge"), async (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body));
  try {
    console.log(req.file.filename);
    console.log(req.file.originalname);
    fs.rename(
      "images/badges/" + req.file.filename,
      "images/badges/" + req.file.filename + ".png",
      function (err) {
        if (err) console.log("ERROR: " + err);
      }
    );
    var badgeName = req.file.filename + ".png";
    console.log(badgeName);

    await Event.create({
      name: data.name,
      date: data.date,
      badges: badgeName,
      short_description: data.short_description,
      description: data.description,
    });

    res.redirect("/admin");
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
