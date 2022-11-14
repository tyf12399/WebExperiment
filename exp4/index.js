// a nodejs server that provides a RESTful API for the web page

// import modules
const express = require("express");

var app = express();
// listen on port 3000
app.listen(3000);
console.log("Server running at http://localhost:3000/");

// respond to GET requests to the root URL (/)
app.get("/", function (req, res) {
  // respond with the index.html file
  res.sendFile(__dirname + "/index.html");
});

// respond to get requests to the / sort ? text =...URL
app.get("/sort", function (req, res) {
  // get the text to sort from the query string
  var text = req.query.text;
  // sort the string
  console.log("Sorting: " + text);
  var sorted = sortString(text);
  console.log("Sorted: " + sorted);
  // respond with the sorted text
  res.send(sorted);
});

// sort a string
function sortString(text) {
  // split the number into an array of characters
  var chars = text.split(",");
  // transform the array of characters into an array of numbers
  var numbers = chars.map(function (c) {
    return parseInt(c);
  });
  // sort the numbers
  numbers.sort(function (a, b) {
    return a - b;
  }
  );
  // transform the array of numbers into an array of characters
  chars = numbers.map(function (n) {
    return n.toString();
  }
  );
  // join the array of characters into a string
  return chars.join(",");
}