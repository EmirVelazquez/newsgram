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
    const homeUrl = "http://localhost:3000/" || "https://blooming-beach-68349.herokuapp.com/";
    const savedUrl = "http://localhost:3000/saved" || "https://blooming-beach-68349.herokuapp.com/saved";
    const homeLink = $("#homeLink");
    const savedLink = $("#savedLink");
    console.log(urlPath);
    console.log(homeUrl);
    console.log(savedUrl);
    // Call for color links function
    colorLinks();
    //============================NAV LOGIC ABOVE=====================================//

    //=============================MAIN FUNCTIONS START===============================//
    // Global variables for jQuery references
    const fetchBtn = $(".fetchArticles"); // Btns for scraping data
    const deleteBtn = $(".deleteArticles"); // Btns for deleting articles
    const articleBox = $(".articleContainer"); //Div where articles are held
    const saveArticle = $(".saveArticle"); // Btn for saving an article
    const removeSaved = $(".removeSaved"); // Btn for removing a saved article

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

    //On click event handler deletes all of the articles from the database
    deleteBtn.on("click", function () {
        articleBox.hide();

        $.ajax({
            method: "GET",
            url: "/clearArticles"
        }).then(function () {
            location.reload();
        });
    });

    // On click event handler for saving an article in the database
    saveArticle.on("click", function () {
        // Grabbing the id here associated with the article from the save button
        let articleId = $(this).attr("data-id");
        console.log(articleId);

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
        console.log(articleId);

        $.ajax({
            method: "POST",
            url: "/removesaved/" + articleId
        }).then(function () {
            location.reload();
        });
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



    //============================HELPER FUNCTIONS END=================================//
});