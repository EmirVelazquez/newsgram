var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
    // `title` is required and of type String
    title: {
        type: String,
        required: true
    },
    // `link` is required and of type String
    link: {
        type: String,
        required: true
    },
    // `image` is not required so if the article doesn't have an image it will default to this jpg
    image: {
        type: String,
        default: "https://hck2.com/sites/default/files/styles/large_client_logo/public/_3-Logo%20large%20thumbDMN_0.jpg?itok=KsbsMlFY"
    },
    // `saved` boolean will default to false, used for when a user saves an article
    saved: {
        type: Boolean,
        default: false
    },
    // `note` is an array that stores a Note id and the ref property links the ObjectId of the note and places in this array
    // This allows to populate the Article note modal with all the associated notes
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;