// a nodejs server that provides a RESTful API for the web page

// import modules
var express = require("express");
var multer = require("multer");
// import secret API key
import { API_KEY } from "./apikey.js";

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
  var filename = req.file.originalname.toString("utf8");
  fs.writeFileSync(
    __dirname + "/images/" + filename,
    req.file.buffer
  );
  console.log("Received " + filename);
  // get the GPS coordinates from the image file
  var gps = getPlace(__dirname + "/images/" + filename);
  // console.log(gps);
  res.redirect("/");
});

// get the Place Info from the exif data
function getPlace(image) {
  // read the image file
  var fs = require("fs");
  var buffer = fs.readFileSync(image);
  // get the GPS coordinates from the image file
  var ExifImage = require("exif").ExifImage;
  try {
    new ExifImage({ image: buffer }, function (error, exifData) {
      if (error) {
        console.log("Error: " + error.message);
      } else {
        console.log(exifData);
        // get the latitude and longitude coordinates
        var latitude = exifData.gps.GPSLatitude;
        var longitude = exifData.gps.GPSLongitude;
        latitude = latitude[0] + latitude[1] / 60 + latitude[2] / 3600;
        longitude = longitude[0] + longitude[1] / 60 + longitude[2] / 3600;
        console.log(latitude + ", " + longitude);
        // get the place name from the latitude and longitude coordinates
        var request = require("https").request({
          host: "restapi.amap.com",
          path:
            "/v3/geocode/regeo?key=" +
            API_KEY +
            "&location=" +
            longitude +
            "," +
            latitude +
            "&radius=1000&extensions=all",
          method: "GET",
        });
        request.end();
        request.on("response", function (response) {
          var body = "";
          response.on("data", function (chunk) {
            body += chunk;
          });
          response.on("end", function () {
            var data = JSON.parse(body);
            console.log(data);
            // return data;
            var place = data.regeocode.formatted_address;
            console.log(place);
            return place;
          });
        });
      }
    });
  } catch (error) {
    console.log("Error: " + error.message);
  }
}
