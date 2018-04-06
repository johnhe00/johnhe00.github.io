"use strict";

(function(window, document) {
    var Joose = window.Joose = window.Joose || {};
    var dolewhippp = "a baller";
    var headerMenu;
    var headerMenuTop;
    var nav;
    var navOffsetTop;

    console.log('Hi, it\'s Chelsea, and I just want to say hello! :D');

    function handleScroll() {
        if (!nav) {
            return;
        }
        if (window.pageYOffset >= navOffsetTop) {
            nav.classList.add("sticky");
        } else {
            nav.classList.remove("sticky");
        }
    };

    document.addEventListener('DOMContentLoaded',function() {
        nav = document.getElementById("nav");
        navOffsetTop = nav.offsetTop;
        window.onscroll = handleScroll;
    });
})(window, document);

