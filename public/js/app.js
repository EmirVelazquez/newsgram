$(document).ready(function () {

    const navLink = $("#navBar .navbar-nav li");
    const activeLinks = $("#navBar .navbar-nav");

    //============================NAV LOGIC BELOW=====================================//
    //This block adds and removes active state on links
    navLink.on("click", function () {
        activeLinks.find("a.active").removeClass("active");
        $(this).children("a").addClass("active");
    });

    //This block revomes active state from all links if my name is clicked
    // $("#newsGramLogo").on("click", function () {
    //     $("#navBar .navbar-nav").find("li.active").removeClass("active");
    //     $("#aboutLink").addClass("active");
    // });

    // Enable tooltips on navbar (will work everywhere else too)
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    //============================NAV LOGIC ABOVE=====================================//

});