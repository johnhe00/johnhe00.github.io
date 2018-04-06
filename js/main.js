"use strict";

(function(window, document) {
    var Joose = window.Joose = window.Joose || {};
    var nav;
    var navOffsetTop;

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

