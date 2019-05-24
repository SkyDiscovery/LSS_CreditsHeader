// ==UserScript==
// @name         CreditsHeader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Anzeige der eingenommen/ausgegebenen Credits in der Kopfzeile
// @author       itsDreyter
// @match        https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // execute it initially at page loading ---------------------
    exec_show_credits();


    // execute it always at a credits update --------------------
    var original_func = creditsUpdate;

    creditsUpdate = function(e){
        original_func.apply(this, arguments);

        exec_show_credits();
    }


    // execute process
    function exec_show_credits()
    {
        // get credits
        var credits = get_credits_daily();

        // calculate incoming credits
        var c_in = calc_credits_in(credits);

        // calculate outgoing credits
        var c_out = calc_credits_out(credits);

        // calculate sum credits
        var c_sum = calc_credits_sum(c_in, c_out);

        // remove elements
        delete_elements();

        // create elements
        create_elements(c_in, c_out, c_sum);

    }

    // get the daily credits + & -
    function get_credits_daily()
    {
        var credits = new Array();

        // read html side for daily credits
        var response = $.ajax({
            type: "GET",
            url: "https://www.leitstellenspiel.de/credits/daily",
            async: false }).responseText.split("<tr>");

        // build array table with values
        for(var i = 0; i < response.length; i++)
        {
            var stop_flg = false;
            var char_at = response[i].match("sortValue");
            var value = '';

            if(char_at == null) continue;

            char_at.index = char_at.index + 11;

            while(stop_flg == false)
            {
                value = value + response[i].charAt(char_at.index);
                char_at.index = char_at.index + 1;

                if(response[i].charAt(char_at.index) == '-') continue;
                if(/^\d+$/.test(response[i].charAt(char_at.index) == false)) stop_flg = true;
                if(response[i].charAt(char_at.index) == '"') stop_flg = true;
            }

            credits.push(value);
        }

        return credits;
    }

    // calculate credits in
    function calc_credits_in(credits)
    {
        var value = 0;

        for(var i = 0; i < credits.length; i++)
        {
            var int = parseInt(credits[i]);

            if (int <= 0) continue;

            value = value + int;
        }

        console.log("IN: " + value);
        return value;
    }

    // calculate credits out
    function calc_credits_out(credits)
    {
        var value = 0;

        for(var i = 0; i < credits.length; i++)
        {
            var int = parseInt(credits[i]);

            if (int >= 0) continue;

            value = value + int;
        }

        console.log("OUT: " + value);
        return value;
    }

    // calculate credits sum
    function calc_credits_sum(c_in, c_out)
    {
        var value = c_in + c_out;
        console.log("SUM: " + value);
        return value;
    }

    // create HTML-Elements
    function create_elements(c_in, c_out, c_sum)
    {
        // create elements
        var navbar = $('#navbar-main-collapse');

        var li_in = create_html(c_in, "in");
        var li_out = create_html(c_out, "out");
        var li_sum = create_html(c_sum, "sum");

        navbar[0].firstElementChild.insertBefore(li_out, navbar[0].firstElementChild.children[0]);
        navbar[0].firstElementChild.insertBefore(li_in, navbar[0].firstElementChild.children[0]);
        navbar[0].firstElementChild.insertBefore(li_sum, navbar[0].firstElementChild.children[0]);
    }

    // create html element out credits
    function create_html(credits, type)
    {
        // create list item
        var li = document.createElement('li');
        li.setAttribute("class", "CreditsHeader");

        // create a
        var a = document.createElement('a');
        a.setAttribute("href", "#");

        // create image
        var img = document.createElement('img');
        img.setAttribute("src", "");
        img.setAttribute("height", "20px");
        img.setAttribute("width", "20px");

        if (type == "in") img.setAttribute("src", "https://github.com/itsexecution/LSS_CreditsHeader/blob/master/arrow_positive.png?raw=true");
        if (type == "out") img.setAttribute("src", "https://github.com/itsexecution/LSS_CreditsHeader/blob/master/arrow_negative.png?raw=true");
        if (type == "sum") img.setAttribute("src", "https://github.com/itsexecution/LSS_CreditsHeader/blob/master/arrow_sum.png?raw=true");

        // create span
        var span = document.createElement('span');
        span.innerHTML = credits.toLocaleString();

        // set childs
        a.appendChild(img);
        a.appendChild(span);
        li.appendChild(a);

        return li;
    }

    // delete html elements
    function delete_elements()
    {
        $('.CreditsHeader').remove();
    }

})();
