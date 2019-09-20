/*!
**  jQuery Page -- jQuery Page Transitions for HTML5 Single-Page-Apps
**  Copyright (c) 2016-2019 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* global jQuery: false */
(function ($) {
    /*  internal API class  */
    var Page = function (root) {
        this.root = root;
    };
    Page.prototype = {
        /*  API method: insert new page element  */
        insert: function (pageId, el) {
            var self = this;

            /*  sanity check arguments  */
            if (arguments.length !== 2)
                throw new Error("invalid number of arguments");
            if (typeof pageId !== "string")
                throw new Error("invalid page id argument (string expected)");

            /*  append element  */
            $("> .jquery-page-container", self.root).append(
                $(el)
                    .attr("data-jquery-page-name", pageId)
                    .addClass("jquery-page-disabled")
            );
            return this;
        },

        /*  API method: remove existing page element  */
        remove: function (pageId) {
            var self = this;

            /*  sanity check arguments  */
            if (arguments.length !== 1)
                throw new Error("invalid number of arguments");
            if (typeof pageId !== "string")
                throw new Error("invalid page id argument (string expected)");

            /*  remove element  */
            var page = $("> .jquery-page-container > *", self.root).filter(function (idx, el) {
                return $(el).attr("data-jquery-page-name") === pageId;
            });
            if (page.length === 0)
                throw new Error("no such page \"" + pageId + "\" found");
            if ($(page).hasClass("jquery-page-active")) {
                var others = self.existing().filter(function (id) {
                    return id !== pageId;
                });
                if (others.length > 0)
                    self.transition(others[0], "none");
            }
            $(page).remove();

            return this;
        },

        /*  API method: fetch element of particular page  */
        fetch: function (pageId) {
            var self = this;

            /*  sanity check arguments  */
            if (arguments.length === 0)
                throw new Error("missing page id");
            else if (arguments.length === 1 && typeof pageId !== "string")
                throw new Error("invalid page id argument (string expected)");

            /*  get page element  */
            var pageTo = $("> .jquery-page-container > *", self.root).filter(function (idx, el) {
                return $(el).attr("data-jquery-page-name") === pageId;
            });
            if (pageTo.length > 1)
                throw new Error("more than one page with id \"" + pageId + "\" found");
            if (pageTo.length === 0)
                return null;
            return pageTo.get(0);
        },

        /*  API method: fetch ids of all existing page elements  */
        existing: function () {
            var self = this;

            /*  sanity check arguments  */
            if (arguments.length !== 0)
                throw new Error("invalid number of arguments");

            /*  find all pages  */
            var pages = [];
            $("> .jquery-page-container > *", self.root).each(function () {
                pages.push($(this).attr("data-jquery-page-name"));
            });
            return pages;
        },

        /*  API method: get id of currently active element  */
        active: function () {
            var self = this;

            /*  sanity check arguments  */
            if (arguments.length !== 0)
                throw new Error("invalid number of arguments");

            /*  get id of currently active page element  */
            var pageActive = $("> .jquery-page-container > .jquery-page-active", self.root);
            if (pageActive.length === 0)
                throw new Error("internal error: no active page found");
            if (pageActive.length > 1)
                throw new Error("internal error: more than one active page found");
            return pageActive.attr("data-jquery-page-name");
        },

        /*  API method: shake current page element  */
        shake: function (complete) {
            var self = this;

            /*  sanity check arguments  */
            if (arguments.length < 0 || arguments.length > 1)
                throw new Error("invalid number of arguments (0 or 1 expected)");
            else if (arguments.length === 1 && typeof complete !== "function")
                throw new Error("invalid complete argument (function expected)");

            /*  apply effect  */
            var pageCo = $("> .jquery-page-container", self.root);
            var pageWidth  = $(self.root).width();
            var handler = function (ev) {
                if (ev.target !== this)
                    return;
                $(pageCo)
                    .css("width", "")
                    .removeClass("jquery-page-shake");
                if (typeof complete === "function")
                    complete.call(this);
                $(pageCo).off("animationend", handler);
            };
            $(pageCo)
                .width(pageWidth)
                .addClass("jquery-page-shake")
                .on("animationend", handler);

            return this;
        },

        /*  API method: transition to a particular page element  */
        transition: function (pageId, transition, complete) {
            var self = this;

            /*  sanity check arguments  */
            if (arguments.length < 2 || arguments.length > 3)
                throw new Error("invalid number of arguments (2 or 3 expected)");
            else if (typeof pageId !== "string")
                throw new Error("invalid page id argument (string expected)");
            else if (typeof transition !== "string")
                throw new Error("invalid transition type argument (string expected)");
            else if (arguments.length === 3 && typeof complete !== "function")
                throw new Error("invalid complete argument (function expected)");

            /*  get page container  */
            var pageCo = $("> .jquery-page-container", self.root);

            /*  get from/to pages  */
            var pageFr = $("> .jquery-page-container > .jquery-page-active", self.root);
            if (transition !== "none" && pageFr.length === 0)
                throw new Error("internal error: no active page found");
            if (transition !== "none" && pageFr.length > 1)
                throw new Error("internal error: more than one active page found");
            var pageTo = $("> .jquery-page-container > *", self.root).filter(function (idx, el) {
                return $(el).attr("data-jquery-page-name") === pageId;
            });
            if (pageTo.length === 0)
                throw new Error("no such page \"" + pageId + "\" found");
            if (pageTo.length > 1)
                throw new Error("more than one page with id \"" + pageId + "\" found");

            /*  determine page dimensions  */
            var pageWidth  = $(self.root).width();
            var pageHeight = $(self.root).height();

            /*  dispatch according to transition type  */
            var m, to, handler;
            if (transition === "none") {
                /*  TRANSITION: none at all (just switch instantly)  */
                $(pageFr)
                    .removeClass("jquery-page-active")
                    .addClass("jquery-page-disabled");
                $(pageTo)
                    .removeClass("jquery-page-disabled")
                    .addClass("jquery-page-active");
                if (typeof complete === "function")
                    complete.call(this, pageId);
            }
            else if ((m = transition.match(/^slide-in-from-(left|right)$/)) !== null) {
                /*  TRANSITION: slide in from left/right  */
                to = m[1];
                $(pageCo)
                    .width(pageWidth * 2)
                    .css("left", to === "left" ? -pageWidth : 0)
                    .addClass("jquery-page-horizontal");
                $(pageFr)
                    .width(pageWidth)
                    .addClass(to === "left" ? "jquery-page-right" : "jquery-page-left");
                $(pageTo)
                    .width(pageWidth)
                    .addClass(to === "left" ? "jquery-page-left" : "jquery-page-right")
                    .removeClass("jquery-page-disabled");
                handler = function (ev) {
                    if (ev.target !== this)
                        return;
                    $(pageFr)
                        .addClass("jquery-page-disabled")
                        .removeClass(to === "left" ? "jquery-page-right" : "jquery-page-left")
                        .removeClass("jquery-page-active")
                        .css("width", "");
                    $(pageTo)
                        .removeClass(to === "left" ? "jquery-page-left" : "jquery-page-right")
                        .addClass("jquery-page-active")
                        .css("width", "");
                    $(pageCo)
                        .css("width", "")
                        .css("transform", "")
                        .css("left", "")
                        .removeClass("jquery-page-horizontal")
                        .removeClass("jquery-page-slide");
                    if (typeof complete === "function")
                        complete.call(this, pageId);
                    $(pageCo).off("transitionend", handler);
                };
                $(pageCo)
                    .addClass("jquery-page-slide")
                    .css("transform", "translate(" + (to === "left" ? "" : "-") + pageWidth + "px,0)")
                    .on("transitionend", handler);
            }
            else if ((m = transition.match(/^slide-in-from-(top|bottom)$/)) !== null) {
                /*  TRANSITION: slide in from top/bottom  */
                to = m[1];
                $(pageCo)
                    .height(pageHeight * 2)
                    .css("top", to === "top" ? -pageHeight : 0)
                    .addClass("jquery-page-vertical");
                $(pageFr)
                    .addClass(to === "top" ? "jquery-page-bottom" : "jquery-page-top")
                    .height(pageHeight);
                $(pageTo)
                    .addClass(to === "top" ? "jquery-page-top" : "jquery-page-bottom")
                    .removeClass("jquery-page-disabled")
                    .height(pageHeight);
                handler = function (ev) {
                    if (ev.target !== this)
                        return;
                    $(pageFr)
                        .addClass("jquery-page-disabled")
                        .removeClass(to === "top" ? "jquery-page-bottom" : "jquery-page-top")
                        .removeClass("jquery-page-active")
                        .css("height", "");
                    $(pageTo)
                        .removeClass(to === "top" ? "jquery-page-top" : "jquery-page-bottom")
                        .addClass("jquery-page-active")
                        .css("height", "");
                    $(pageCo)
                        .css("height", "")
                        .removeClass("jquery-page-vertical")
                        .removeClass("jquery-page-slide")
                        .css("transform", "")
                        .css("top", 0);
                    if (typeof complete === "function")
                        complete.call(this, pageId);
                    $(pageCo).off("transitionend", handler);
                };
                $(pageCo)
                    .addClass("jquery-page-slide")
                    .css("transform", "translate(0," + (to === "top" ? "" : "-") + pageHeight + "px)")
                    .on("transitionend", handler);
            }
            else if ((m = transition.match(/^flip-towards-(left|right)$/)) !== null) {
                /*  TRANSITION: flip towards left/right  */
                to = m[1];
                $(pageCo)
                    .addClass("jquery-page-stacked")
                    .width(pageWidth);
                $(pageFr)
                    .addClass("jquery-page-front")
                    .width(pageWidth);
                $(pageTo)
                    .addClass("jquery-page-back")
                    .removeClass("jquery-page-disabled")
                    .width(pageWidth);
                handler = function (ev) {
                    if (ev.target !== this)
                        return;
                    $(pageFr)
                        .addClass("jquery-page-disabled")
                        .removeClass("jquery-page-front")
                        .removeClass("jquery-page-active")
                        .css("width", "");
                    $(pageTo)
                        .removeClass("jquery-page-back")
                        .addClass("jquery-page-active")
                        .css("width", "");
                    $(pageCo)
                        .css("width", "")
                        .removeClass("jquery-page-stacked")
                        .removeClass("jquery-page-flip-" + to);
                    if (typeof complete === "function")
                        complete.call(this, pageId);
                    $(pageCo).off("transitionend", handler);
                };
                $(pageCo)
                    .addClass("jquery-page-flip-" + to)
                    .on("transitionend", handler);
            }
            else
                throw new Error("invalid transition type");

            return this;
        }
    };

    /*  hook into jQuery (locally)  */
    $.fn.extend({
        /*  API method  */
        page: function () {
            var result = null;
            this.each(function () {
                /*  determine attached API  */
                var api = $(this).data("jquery-page-api");
                if (!api) {
                    /*  create new attached API and prepare root element  */
                    api = new Page(this);
                    $(this)
                        .data("jquery-page-api", api)
                        .addClass("jquery-page");

                    /*  sanity check and prepare container element  */
                    var container = $("> *", this);
                    if (container.length === 0) {
                        container = $("<div></div>");
                        $(this).append(container);
                    }
                    else if (container.length !== 1)
                        throw new Error("require a single container element under jQuery Page root element");
                    $(container)
                        .addClass("jquery-page-container");

                    /*  prepare already existing page elements  */
                    $("> *", container)
                        .addClass("jquery-page-disabled");
                    $("> *:first", container)
                        .removeClass("jquery-page-disabled")
                        .addClass("jquery-page-active");
                }
                result = api;
            });
            return result;
        }
    });
})(jQuery);

