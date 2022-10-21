const express = require("express");
const router = express.Router();
const Event = require("../../schema/EventSchema");

router.get("/certificates", async (req, res) => {
  try {
    const event_response = await Event.find();
    res.render("certificate", { events: event_response });
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/certificates", (req, res) => {
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

module.exports = router;
