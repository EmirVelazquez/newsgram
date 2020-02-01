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
    const homeUrl = "http://localhost:3000/";
    const savedUrl = "http://localhost:3000/saved";
    const homeLink = $("#homeLink");
    const savedLink = $("#savedLink");
    // Call for color links function
    colorLinks();
    //============================NAV LOGIC ABOVE=====================================//

    //=============================MAIN FUNCTIONS START===============================//
    // Global variables for jQuery references
    const fetchBtn = $(".fetchArticles"); // Btns for scraping data
    const deleteBtn = $(".deleteArticles"); // Btns for deleting articles
    const articleBox = $(".articleContainer"); //Div where articles are held
    const saveArticle = $(".saveArticle"); // Btn for saving an article

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
        var articleId = $(this).attr("data-id");
        console.log(articleId);

        $.ajax({
            method: "POST",
            url: "/savearticle/" + articleId
        }).then(function () {
            location.reload();
        });
    });











    //=============================MAIN FUNCTIONS END==================================//

    //============================HELPER FUNCTIONS START===============================//

    function colorLinks() {
        // If statement for coloring the nav links based on the path user is on
        if (urlPath === homeUrl) {
            savedLink.removeClass("activeLink");
            homeLink.addClass("activeLink");
        } else if (urlPath === savedUrl) {
            homeLink.removeClass("activeLink");
            savedLink.addClass("activeLink");
        } else {
            homeLink.removeClass("activeLink");
            savedLink.removeClass("activeLink");
        };
    };



    //============================HELPER FUNCTIONS END=================================//
});