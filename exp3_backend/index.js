// a nodejs server that provides a RESTful API for the web page

// import modules
var express = require("express");
var multer = require("multer");
// create an express application
var app = express();
// listen on port 3000
app.listen(3000);
console.log("Server running at http://localhost:3000/");

// respond to GET requests to the root URL (/)
app.get("/", function (req, res) {
  // respond with the index.html file
  res.sendFile(__dirname + "/index.html");
});

// respond to GET requests to /images
app.get("/images", function (req, res) {
  // respond with a json object that contains the names and URLs of the images in the /images folder
  var images = [];
  var fs = require("fs");
  var files = fs.readdirSync(__dirname + "/images");
  if (files) {
    for (var i = 0; i < files.length; i++) {
      images.push({
        name: files[i],
        url: "http://localhost:3000/images/" + files[i],
      });
    }
    console.log("Sending " + images.length + " images");
    res.json(images);
  } else {
    console.log("No files found");
  }
});

// respond to GET requests to /images/:name
app.get("/images/:name", function (req, res) {
  // respond with the image file
  res.sendFile(__dirname + "/images/" + req.params.name);
});

// parse multipart/form-data
var upload = multer();
// respond to POST requests to /images
app.post("/images", upload.single("image"), function (req, res) {
  // save the image file to the /images folder
  var fs = require("fs");
  fs.writeFileSync(__dirname + "/images/" + req.file.originalname, req.file.buffer);
  console.log("Received " + req.file.originalname);
  res.send("OK");
});
