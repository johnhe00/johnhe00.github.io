"use strict";

(function(window, document) {
    var Joose = window.Joose = window.Joose || {};
    var headerMenu;
    var headerMenuTop;

    function handleScroll() {
        if (!headerMenu) {
            return;
        }
        console.log(headerMenu.offsetTop);
        console.log(window.pageYOffset);
        console.log('Hi, it\'s Chelsea, and I just want to say hello! :D');
        if (window.pageYOffset >= headerMenuTop-10) {
            headerMenu.classList.add("sticky");
        } else {
            headerMenu.classList.remove("sticky");
        }
    };

    document.addEventListener('DOMContentLoaded',function() {
        headerMenu = document.getElementById("header_menu");
        headerMenuTop = headerMenu.offsetTop;
        window.onscroll = handleScroll;
    });
})(window, document);

