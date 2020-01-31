// Requiring the models
var db = require("../models");

module.exports = function (app) {
    // Load the home page with articles if there are any
    app.get("/", function (req, res) {
        db.Article.find({}).then(function (dbArticle) {
            // Render the index.handlebars page
            res.render("index", {
                // Here we tell handlebars that the data is inside articles
                articles: dbArticle
            });
        });
    });

    // Load the saved page with saved articles if there are any
    app.get("/saved", function (req, res) {
        db.Article.find({ saved: { $eq: true } }).then(function (dbArticle) {
            // Render the saved.handlebars page
            res.render("saved", {
                articles: dbArticle
            });
        });
    });

    // Render 404 page for any unmatched routes
    app.get("*", function (req, res) {
        res.render("404");
    });
};