"use strict";

(function(window, document) {
    var Joose = window.Joose = window.Joose || {};
    var dolewhippp = "a baller";
    var headerMenu;
    var headerMenuTop;

    console.log('Hi, it\'s Chelsea, and I just want to say hello! :D');

    function handleScroll() {
        if (!headerMenu) {
            return;
        }
        console.log(headerMenu.offsetTop);
        console.log(window.pageYOffset);
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

