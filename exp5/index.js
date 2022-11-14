// import modules
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

var app = express();
var db = new sqlite3.Database("address.db");
// listen on port 3000
app.listen(3000);
console.log("Server running at http://localhost:3000/");

// respond to GET requests to the root URL (/)
app.get("/", function (req, res) {
  // respond with the index.html file
  res.sendFile(__dirname + "/index.html");
});

// respond to get requests to the /s?province=...URL
app.get("/s", function (req, res) {
  // get the province parameter from the URL
  var province = req.query.province;
  console.log("Province: " + province);
  // query the database for the province
  db.all("SELECT * FROM city WHERE province = '"+province+"'", function (
    err,
    rows
  ) {
    // send the results as JSON
    console.log(JSON.stringify(rows));
    // traverse the rows and add them to html
    var html = "";
    for (var i = 0; i < rows.length; i++) {
      cityname = rows[i].city_name;
      html +=
        "<option value=" +
        cityname +
        ">" +
        cityname +
        "</option>";
    }
    res.send(html);
  });
});
