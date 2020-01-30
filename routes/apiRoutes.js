// Requiring the models
var db = require("../models");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");


module.exports = function (app) {
    // A GET route for scraping the Dallas Morning News website
    app.get("/scrape", function (req, res) {
        // First we grab all of the articles if there are any, then delete all of them so we prevent duplicates
        db.Article.deleteMany({})
            .then(function () {
                console.log("Any existing articles deleted");
            })
            .catch(function (err) {
                // If an error occurrs, log it
                console.log(err);
            });


        axios.get("https://www.dallasnews.com/").then(function (response) {
            // Load that into cheerio and save it to $ var
            var $ = cheerio.load(response.data);

            // For each article tag execute the following 
            $("article").each(function (i, element) {
                // Crea an empty result object
                var result = {};

                result.title = $(this).children("h2").children("a").text(); // Title Text
                result.link = $(this).children("h2").children("a").attr("href"); // Link to Dallas Morning News article
                result.image = $(this).children("a").children("div").children("img").attr("src"); // Image Source
                result.saved = false;
                console.log(result);
                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });
        });
    });

    // A GET route to grab all of the articles then using an empty document to delete all of them 
    app.get("/clearArticles", function (req, res) {
        db.Article.deleteMany({})
            .then(function () {
                console.log("All Articles Deleted");
            })
            .catch(function (err) {
                // If an error occurrs, log it
                console.log(err);
            });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        // TODO: Finish the route so it grabs all of the articles
        db.Article.find({})
            .then(function (dbArticle) {
                // If all Notes are successfully found, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurs, send the error back to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // TODO
        // ====
        // Finish the route so it finds one article using the req.params.id,
        // and run the populate method with "note",
        // then responds with the article with the note included
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        // TODO
        // ====
        // save the new note that gets posted to the Notes collection
        // then find an article from the req.params.id
        // and update it's "note" property with the _id of the new note
        // Create a new Note in the db
        db.Note.create(req.body)
            .then(function (dbNote) {
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote.id }, { new: true });
            })
            .then(function (dbArticle) {
                // If the User was updated successfully, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurs, send it back to the client
                res.json(err);
            });
    });
};