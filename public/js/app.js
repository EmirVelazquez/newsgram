$(document).ready(function () {
    //========================BOOTSTRAP TOOLTIP START=================================//
    // Enable tooltips on navbar (will work everywhere else too)
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    //=========================BOOTSTRAP TOOLTIP END==================================//

    //============================NAV LOGIC BELOW=====================================//
    // Global variables
    const urlPath = window.location.href;
    // Make sure to update on production version
    const homeUrl = "https://blooming-beach-68349.herokuapp.com/"; // "http://localhost:3000/";  
    const savedUrl = "https://blooming-beach-68349.herokuapp.com/saved"; // "http://localhost:3000/saved";  
    const homeLink = $("#homeLink");
    const savedLink = $("#savedLink");
    // Call for color links function
    colorLinks();
    //============================NAV LOGIC ABOVE=====================================//

    //=============================MAIN FUNCTIONS START===============================//
    // Global variables with jQuery references, and flags
    const fetchBtn = $(".fetchArticles"); // Btns for scraping data
    const deleteBtn = $(".deleteArticles"); // Btns for deleting articles
    const articleBox = $(".articleContainer"); // Div where articles are held
    const saveArticle = $(".saveArticle"); // Btn for saving an article
    const removeSaved = $(".removeSaved"); // Btn for removing a saved article
    const noteButton = $(".noteButton") // Btn for opening the note modal for an article
    const formWarning = $(".formWarning"); // P tag to hold form warning
    const yesSave = $(".yesSave"); // Btn for saving a note for an article
    const noteBox = $(".noteBox"); // Div where notes are displayed
    var artInProgress = []; // Flag var set here, being used to submit notes to an article by it's ID

    // On click event handler scrapes data from DMN website
    fetchBtn.on("click", function () {
        articleBox.show();

        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function (data) {
            location.reload();
        });
    });

    //On click event handler deletes all of the articles and associated notes from the database
    deleteBtn.on("click", function () {
        articleBox.hide();

        $.ajax({
            method: "GET",
            url: "/clearArticles"
        }).then(function () {
            // Once the articles are deleted from db, delete all of the articles' notes too
            $.ajax({
                method: "GET",
                url: "/clearNotes"
            }).then(function () {
                // window reload to display html changes
                location.reload();
            });
        });
    });

    // On click event handler for saving an article in the database
    saveArticle.on("click", function () {
        // Grabbing the id here associated with the article from the save button
        let articleId = $(this).attr("data-id");

        $.ajax({
            method: "POST",
            url: "/savearticle/" + articleId
        }).then(function () {
            location.reload();
        });
    });

    // On click event handler for removing a saved article from being saved
    removeSaved.on("click", function () {
        // Grabbing the id here associated with the article from the save button
        let articleId = $(this).attr("data-id");

        $.ajax({
            method: "POST",
            url: "/removesaved/" + articleId
        }).then(function () {
            location.reload();
        });
    });

    // On click event handler for opening an articles note modal
    noteButton.on("click", function () {
        // Open the note modal
        $("#noteModal").modal();
        // Get the article's _id from the note button data-id, then push into the flag being used
        let articleId = $(this).attr("data-id");
        artInProgress.push(articleId);

        // Function call for displaying any existing notes associated with this article
        existingNotes();

        // On click event handler for submitting article note to the database
        yesSave.on("click", function () {
            newNoteEntered();
        });
    });


    // Clears out the articleId flag being used to push new notes for an article when modal is closed
    $("#noteModal").on("hidden.bs.modal", function (event) {
        // Empty the flag var being used
        artInProgress = [];
        // Empty the notes from the note modal
        noteBox.empty();
        // Empty the text from the form warning div
        formWarning.text("");
    });







    //=============================MAIN FUNCTIONS END==================================//

    //============================HELPER FUNCTIONS START===============================//

    function colorLinks() {
        // If statement for coloring the nav links based on the path user is on
        if (homeUrl === urlPath) {
            savedLink.removeClass("activeLink");
            homeLink.addClass("activeLink");
        } else if (savedUrl === urlPath) {
            homeLink.removeClass("activeLink");
            savedLink.addClass("activeLink");
        } else {
            homeLink.removeClass("activeLink");
            savedLink.removeClass("activeLink");
        };
    };

    function newNoteEntered() {
        // Local 
        let noteData = $(".form-control").val();
        // If statement to verify there is text in the box before posting data
        if (noteData === "") {
            formWarning.text("Please make sure your form is not empty.");
        } else {
            $.ajax({
                method: "POST",
                url: "/newNote/" + artInProgress,
                data: {
                    body: noteData
                }
            }).then(function (data) {
                // After the note is pushed, request all of the notes and append only the newest
                $.ajax({
                    method: "GET",
                    url: "/articleNotes/" + artInProgress
                }).then(function (dbArticle) {
                    let newNote = dbArticle.note[dbArticle.note.length - 1];

                    // Place new note text inside note row
                    let noteRow = $("<p></p>");
                    noteRow.text(newNote.body);
                    let noteButton = $("<button></button>");
                    noteButton.addClass("btn float-right deleteNote");
                    noteButton.attr("data-id", newNote._id);
                    noteButton.append("<i class='far fa-trash-alt'></i>");
                    noteRow.append(noteButton);
                    noteBox.append(noteRow);
                    // Clear out text box after submission
                    formWarning.text("");

                    // Calling the delete function, in case user wants to delete an existing note or the new one
                    deleteOneNote();

                });
            });
            // Empty the text box
            $(".form-control").val("");
        };

    };

    function existingNotes() {

        $.ajax({
            method: "GET",
            url: "/articleNotes/" + artInProgress
        }).then(function (articleData) {
            // For loop to iterate through any existing note, if any does exist. then append into the modal
            for (var i = 0; i < articleData.note.length; i++) {

                // Place existing note text inside note row
                let noteRow = $("<p></p>");
                noteRow.text(articleData.note[i].body);
                let noteButton = $("<button></button>");
                noteButton.addClass("btn float-right deleteNote");
                noteButton.attr("data-id", articleData.note[i]._id);
                noteButton.append("<i class='far fa-trash-alt'></i>");
                noteRow.append(noteButton);
                noteBox.append(noteRow);
            }

            // Calling the delete function, in case user wants to delete an existing note
            deleteOneNote();

        });
    };

    function deleteOneNote() {
        // On click event handler for deleting one note for an article
        $(".deleteNote").on("click", function () {
            // Local grab of the _id for this note
            let noteId = $(this).attr("data-id");



            // First we make a call to delete the note only from the notes collection
            $.ajax({
                method: "GET",
                url: "/deleteNote/" + noteId
            }).then(function (noteData) {

                // Empty the notes from the note modal
                noteBox.empty();
            });

            // Lastly, call to delete the note from the article collection where the noteId matches an Id from all each documents `note ` array
            $.ajax({
                method: "GET",
                url: "/deleteArticleNote/" + noteId
            }).then(function (data) {

                // Empty the notes from the note modal
                noteBox.empty();
                // Display the update list of notes 
                existingNotes();
            });
        });
    };
    //============================HELPER FUNCTIONS END=================================//
});