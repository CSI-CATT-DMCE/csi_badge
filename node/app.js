require("dotenv").config();

const express = require("express");
const exphbs = require("express-handlebars");
const { appendFileSync } = require("fs");
const app = express();
// const mysql = require("mysql");
const port = 3000;
const path = require("path");
const hbs = require("hbs");
const multer = require("multer");
const queries = require("./sqlFun/queries");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
const fs = require("fs");
const mongoose = require("mongoose");
const Admin = require("./schema/AdminSchema");
const User = require("./schema/UserSchema");
const Certificate = require("./schema/CertificateSchema");
const Event = require("./schema/EventSchema");
const async = require("hbs/lib/async");

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.set('view engine', 'ejs');

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch(() => console.log("Error Connecting to Database"));

app.engine("hbs", exphbs({ defaultLayout: false, extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(__dirname + "/public"));
app.use(express.static("images/assets"));
app.use(express.static("images/avatar"));
app.use(express.static("images/badges"));

// console.log(process.env.DB_HOST);

app.get("/", async (req, res, next) => {
  try {
    const user_response = await User.aggregate([
      {
        $lookup: {
          from: "certificates",
          localField: "_id",
          foreignField: "user_id",
          as: "certificates",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          count: { $size: "$certificates" },
        },
      },
      {
        $limit: 5,
      },
      {
        $sort: { count: -1 },
      },
    ]);
    const event_response = await Event.find().sort({ date: -1 }).limit(5);
    res.render("home", { x: user_response, y: event_response });
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/admin/login", (req, res) => {
  res.render("login");
});

app.put("/admin/create", urlencodedParser, async (req, res) => {
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

app.post("/admin/login", urlencodedParser, async (req, res) => {
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

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/registeruser", (req, res) => {
  res.render("registeruser");
});

const userupload = multer({
  dest: "images/avatar",
  // 	add limit
});

app.post(
  "/registeruser",
  userupload.single("avatar"),
  urlencodedParser,
  async (req, res) => {
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
  }
);

app.get("/registerevents", (req, res) => {
  res.render("registerevents");
});

const upload = multer({
  dest: "images/badges",
});

app.post(
  "/registerevents",
  upload.single("badge"),
  urlencodedParser,
  async (req, res) => {
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
  }
);

app.get("/users", async (req, res) => {
  try {
    const user_response = await User.find();
    res.render("users", { user: user_response });
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/users", urlencodedParser, async (req, res) => {
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
          pipeline: [
            {
              $match: {
                _id: {
                  $in: mongoose.Types.ObjectId("$certificates.event_id"),
                },
              },
            },
          ],
          as: "events",
        },
      },
    ]);
    res.render("users", {
      x: user_response,
      y: user_response[0].avatar,
      z: user_response[0].username,
    });
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/certificates", async (req, res) => {
  try {
    const certificate_response = await Certificate.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "event_id",
          foreignField: "_id",
          as: "events",
        },
      },
    ]);
    res.render("certificate", { events: certificate_response });
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/certificates", urlencodedParser, (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body));
  try {
    var c = data.users;

    function replaceAll(str, find, replace) {
      return str.replace(new RegExp(find, "g"), replace);
    }
    c = replaceAll(c, "\r", " ");
    c = replaceAll(c, "\r\n", " ");
    c = replaceAll(c, "\n", " ");
    // console.log(replaceAll('adsdasdasdasd', 'as', '=='));

    var e = c.split(" ");
    var finalarr = e.filter((ele) => {
      return ele != "";
    });
    console.log(finalarr);

    var arr = [];
    for (var i = 0; i < finalarr.length; i++) {
      arr.push([finalarr[i], data.events]);
    }

    console.log(arr);

    for (var i = 0; i < arr.length; i++) {
      console.log("hello");
      queries.sendCertificates(arr[i]);
    }
    console.log("executed");
    res.redirect("/admin");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(port, (req, res) => {
  console.log("Server is listening on port" + port);
});
