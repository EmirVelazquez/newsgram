// Requirements/Dependencies
require("dotenv").config();
var logger = require("morgan");
var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools being used
// var axios = require("axios");
// var cheerio = require("cheerio");

// // Requiring all models here
// var db = require("./models");

// Initializing Express
var app = express();
var PORT = process.env.PORT || 3000;

// Configuring Middleware
app.use(logger("dev")); // Use morgan logger for logging requests
app.use(express.urlencoded({ extended: false })); // Parse request body as JSON
app.use(express.json());
app.use(express.static("public")); // Making a public static folder

// Handlebars settings
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// If deployed, use the deployed database. Otherwise use the local 'newsGram' database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsgramDb";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Last two options are for avoiding deprecation

// Starting the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT);
    console.log("http://localhost:" + PORT);
});