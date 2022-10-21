const express = require("express");
const router = express.Router();
const Admin = require("../../schema/AdminSchema");
const User = require("../../schema/UserSchema");

router.get("/admin", async (req, res) => {
  const user_response = await User.find();
  res.render("admin", { users: user_response });
});

router.get("/admin/login", (req, res) => {
  res.render("login");
});

router.put("/admin/create", async (req, res) => {
  try {
    await Admin.create({
      username: "admin@gmail.com",
      password: "admin",
      name: "admin",
    });
    await Admin.create({
      username: "root@gmail.com",
      password: "root",
      name: "root",
    });
    res.send("Admin Created");
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/admin/login", async (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body));
  try {
    const admin = await Admin.findOne({
      username: data.email,
    });
    if (admin.password === data.password) {
      return res.redirect("/admin");
    }
    res.redirect("/admin/login");
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
