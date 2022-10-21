require("dotenv").config();

const express = require("express");
const exphbs = require("express-handlebars");
// const { appendFileSync } = require("fs");
const app = express();
// const mysql = require("mysql");
const port = 3000;
const path = require("path");
const hbs = require("hbs");
// const queries = require("./sqlFun/queries");
const bodyParser = require("body-parser");
// const fs = require("fs");
const mongoose = require("mongoose");
const User = require("../schema/UserSchema");
const Event = require("../schema/EventSchema");

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
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require("./routes/Users.js"));
app.use(require("./routes/Admin.js"));
app.use(require("./routes/Events.js"));
app.use(require("./routes/Certificates.js"));

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
    console.log(event_response);
    res.render("home", { x: user_response, y: event_response });
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(port, (req, res) => {
  console.log("Server is listening on port" + port);
});
