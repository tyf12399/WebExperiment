const express = require("express");

const app = express();
app.listen(8888);
console.log("Server is running on http://localhost:8888");

app.use("/index.html", express.static("index.html"));
