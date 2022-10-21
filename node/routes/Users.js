const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../../schema/UserSchema");
const fs = require("fs");

const userupload = multer({
  dest: "images/avatar",
  // 	add limit
});

router.get("/registeruser", (req, res) => {
  res.render("registeruser");
});

router.post("/registeruser", userupload.single("avatar"), async (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body));
  try {
    fs.rename(
      "images/avatar/" + req.file.filename,
      "images/avatar/" + req.file.filename + ".png",
      function (err) {
        if (err) console.log("ERROR: " + err);
      }
    );

    console.log(req.file.originalname);
    console.log(req.file.filename);
    var badgeName = req.file.filename + ".png";
    console.log(badgeName);

    await User.create({
      name: data.name,
      email: data.email,
      year: data.year,
      gr_no: data.gr_no,
      avatar: badgeName,
    });

    res.redirect("/admin");
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/users", async (req, res) => {
  try {
    const user_response = await User.find();
    res.render("users", { user: user_response });
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/users", async (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body));
  try {
    var userId = data.users;
    const user_response = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "certificates",
          localField: "_id",
          foreignField: "user_id",
          as: "certificates",
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "certificates.event_id",
          foreignField: "_id",
          as: "events",
        },
      },
    ]);
    res.render("users", {
      x: user_response,
      y: user_response[0].user.avatar,
      z: user_response[0].user.name,
    });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
