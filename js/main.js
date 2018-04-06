"use strict";

(function(window, document) {
    var nav;
    var hamburger;

    function handleHamburgerClick() {
        if (!hamburger || !nav) { return; } 
        nav.classList.toggle("open");
    };

    function setup() {
        hamburger = document.getElementById("hamburger_menu");
        nav = document.getElementById("nav");

        hamburger.addEventListener("click", handleHamburgerClick);
    };

    document.addEventListener("DOMContentLoaded", setup);

})(window, document);

