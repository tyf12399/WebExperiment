// a nodejs server that provides a RESTful API for the web page

// import modules
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const apikey = require("./apikey.js");
const { get } = require("http");
const ExifImage = require("exif").ExifImage;
console.log("apikey: " + apikey.AMAP_KEY);
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
  // respond with a json object that contains the names, URLs, locations, and dates of all the images
  var images = [];
  var files = fs.readdirSync(__dirname + "/images");
  // wait for all the data to be retrieved
  Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        // get the address and date of the image
        var image = {};
        var data = getData(__dirname + "/images/" + file);
        data.then((result) => {
          image.name = file;
          image.url = "http://localhost:3000/images/" + file;
          image.address = result.address;
          image.date = result.date;
          images.push(image);
          resolve();
        });
      });
    })
  ).then(() => {
    console.log(images);
    res.json(images);
  });
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
  // save the image file
  var filename = Buffer.from(req.file.originalname, "latin1").toString("utf8");
  console.log("Saving " + filename);
  fs.writeFileSync(__dirname + "/images/" + filename, req.file.buffer);
  // respond with the URL of the image file
  res.json({
    url: "http://localhost:3000/images/" + filename,
    name: filename,
  });
});

// get the exif data from the image file
function getEXIF(filename) {
  return new Promise((resolve) => {
    ExifImage(filename, (err, data) => {
      resolve(data);
    });
  });
}

async function getData(filename) {
  var data = {};
  // wait for the exif data to be retrieved
  var exifData = await getEXIF(filename);
  // get the location data from the exif data
  if (exifData.gps) {
    var lon =
      exifData.gps.GPSLongitude[0] +
      exifData.gps.GPSLongitude[1] / 60 +
      exifData.gps.GPSLongitude[2] / 3600;
    var lat =
      exifData.gps.GPSLatitude[0] +
      exifData.gps.GPSLatitude[1] / 60 +
      exifData.gps.GPSLatitude[2] / 3600;
    if (exifData.gps.GPSLongitudeRef == "W") lon = -lon;
    if (exifData.gps.GPSLatitudeRef == "S") lat = -lat;
    location = lon + "," + lat;
    // get the address from the location
    var address = await getAddress(location);
    data.address = address;
  }
  // get the date data from the exif
  if (exifData.exif) {
    data.date = exifData.exif.CreateDate;
  }
  return data;
}

async function getAddress(location) {
  var url =
    "https://restapi.amap.com/v3/geocode/regeo?location=" +
    location +
    "&key=" +
    apikey.AMAP_KEY;
  // get the address data from the url
  var https = require("https");
  var address = await new Promise((resolve) => {
    https.get(url, (res) => {
      var data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        var json = JSON.parse(data);
        resolve(json.regeocode.formatted_address);
      });
    });
  });
  return address;
}
