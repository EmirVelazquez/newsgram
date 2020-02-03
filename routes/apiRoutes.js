// Requiring the models
var db = require("../models");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Requiring mongojs
var mongojs = require("mongojs");


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
                res.end();
            });
        });
    });

    // A GET route to grab all of the articles then using an empty filter to delete all of them 
    app.get("/clearArticles", function (req, res) {
        db.Article.deleteMany({})
            .then(function () {
                console.log("All Articles Deleted");
            })
            .catch(function (err) {
                // If an error occurrs, log it
                console.log(err);
            });
        res.end();
    });

    // A POST route for saving an article in the database
    app.post("/savearticle/:id", function (req, res) {
        db.Article.updateOne({ _id: mongojs.ObjectId(req.params.id) }, { $set: { saved: true } })
            .then(function (dbArticle) {
                res.json(dbArticle)
            })
            .catch(function (err) {
                // If an error occurs, send the error back to the client
                res.json(err);
            });
        res.end();
    });

    // A POST route for deleting a saved article from being `saved` in the database
    app.post("/removesaved/:id", function (req, res) {
        db.Article.updateOne({ _id: mongojs.ObjectId(req.params.id) }, { $set: { saved: false } })
            .then(function (dbArticle) {
                res.json(dbArticle)
            })
            .catch(function (err) {
                // If an error occurs, send the error back to the client
                res.json(err);
            });
        res.end();
    });

    // A GET route to grab all of the notes then using an empty filter to delete all of them 
    app.get("/clearNotes", function (req, res) {
        db.Note.deleteMany({})
            .then(function () {
                console.log("All notes Deleted");
            })
            .catch(function (err) {
                // If an error occurrs, log it
                console.log(err);
            });
        res.end();
    });

    // A GET Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articleNotes/:id", function (req, res) {
        // Finds one article using the req.params.id, populates all the notes inside "note" arr
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
    app.post("/newNote/:id", function (req, res) {
        // Save new note to the Notes collection, finds an article from the req.params.id
        // then updates it's "note" property with the _id of the new note
        db.Note.create(req.body)
            .then(function (dbNote) {
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.updateOne({ _id: req.params.id }, { $push: { note: dbNote.id } }, { new: true });
            })
            .then(function (dbArticle) {
                // If the article was updated successfully, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurs, send it back to the client
                res.json(err);
            });
    });
};