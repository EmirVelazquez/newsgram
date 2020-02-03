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
    const noteRow = $(".noteRow"); // Div where notes are displayed
    var noteInProgress = []; // Flag var set here, being used to submit notes to an article by it's ID

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
        noteInProgress.push(articleId);

        // On click event handler for submitting article note to the database
        yesSave.on("click", function () {
            newNoteEntered();
        });
    });

    // Clears out the articleId flag being used to push new notes for an article when modal is closed
    $("#noteModal").on("hidden.bs.modal", function (event) {
        // Empty the flag var being used
        noteInProgress = [];
        // Empty the notes from the note modal
        noteRow.empty();
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
        let noteData = $(".form-control").val()
        // If statement to verify there is text in the box before posting data
        if (noteData === "") {
            formWarning.text("Please make sure your form is not empty.");
        } else {
            $.ajax({
                method: "POST",
                url: "/newNote/" + noteInProgress,
                data: {
                    body: noteData
                }
            }).then(function (data) {
                console.log(data);
                // After the note is pushed, request all of the notes and append only the newest
                $.ajax({
                    method: "GET",
                    url: "/articleNotes/" + noteInProgress
                }).then(function (dbArticle) {
                    let newNote = dbArticle.note[dbArticle.note.length - 1];
                    console.log(newNote);
                    // Place new note text inside note row
                    noteRow.append(
                        "<p>" + newNote.body + "<button type='button' data-id='" + newNote._id + "' class='btn float-right deleteNote'><i class='far fa-trash-alt'></i></button ></p>");
                    formWarning.text("");
                });
            });
            // Empty the text box
            $(".form-control").val("");
        }
    }


    //============================HELPER FUNCTIONS END=================================//
});