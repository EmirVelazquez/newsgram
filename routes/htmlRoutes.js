// Requiring the models
var db = require("../models");

module.exports = function (app) {
    // Load the home page
    app.get("/", function (req, res) {
        res.render("index");
    });
    // Render 404 page for any unmatched routes
    app.get("*", function (req, res) {
        res.render("404");
    });
};