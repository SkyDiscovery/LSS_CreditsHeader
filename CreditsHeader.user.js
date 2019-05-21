// ==UserScript==
// @name         CreditsHeader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Anzeige der eingenommen/ausgegebenen Credits in der Kopfzeile
// @author       You
// @match        https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // create elements initially
    create_elements();

    // erstellen der HTML-Elemente
    function create_elements()
    {
        delete_elements();

        // create elements
        var navbar = $('#navbar-main-collapse');
        navbar[0].firstElementChild.children;

        var li_out = document.createElement('li');

        var a_out = document.createElement('a');
        a_out.setAttribute("href", "/credits/daily");
        a_out.setAttribute("class", "lightbox-open");

        var img_out = document.createElement('img');
        img_out.setAttribute("src", "https://www.pngfind.com/pngs/m/331-3318088_down-left-arrow-outline-comments-pfeil-nach-links.png");
        img_out.setAttribute("height", "20px");
        img_out.setAttribute("width", "20px");

        var credits_out = document.createElement('span');
        credits_out.innerHTML = '4000';
        credits_out.setAttribute("color", "green");

        a_out.appendChild(img_out);
        a_out.appendChild(credits_out);
        li_out.appendChild(a_out);
        navbar[0].firstElementChild.insertBefore(li_out, navbar[0].firstElementChild.children[0]);
    }

    // entfernen der HTML-Elemente
    function delete_elements()
    {
    }

})();