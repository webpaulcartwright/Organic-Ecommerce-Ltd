require(["jquery", "Magento_Swatches/js/swatch-renderer"], function ($) {
    $(function () {

        //size changes
        function setupSizeGuideEvent(e) {
            var $size = $(e.target);

            setupSizeGuide($size);
        }

        function setupSizeGuide($size) {
            var size_type = $("#size_type").val();

            if ($size.length === 0 || !size_type) {
                return;
            }
            if ($size.hasClass("updated")) {
                return;
            }

            var fr_uk = {
                "32": "EU 32 / UK4",
                "34": "EU 34 / UK6",
                "36": "EU 36 / UK8",
                "38": "EU 38 / UK10",
                "40": "EU 40 / UK12",
                "42": "EU 42 / UK14",
                "44": "EU 44 / UK16",

                "4": "EU 32 / UK4",
                "6": "EU 34 / UK6",
                "8": "EU 36 / UK8",
                "10": "EU 38 / UK10",
                "12": "EU 40 / UK12",
                "14": "EU 42 / UK14",
                "16": "EU 44 / UK16"
            };

            if (size_type === "shoe") {
                fr_uk = {
                    "35": "EU 35 / UK2",
                    "36": "EU 36 / UK3",
                    "37": "EU 37 / UK4",
                    "38": "EU 38 / UK5",
                    "39": "EU 39 / UK6",
                    "40": "EU 40 / UK7",
                    "41": "EU 41 / UK8",

                    "42": "EU 42 / UK9",
                    "43": "EU 43 / UK10",
                    "44": "EU 44 / UK11",
                    "45": "EU 45 / UK12",
                    "46": "EU 46 / UK13",
                    "47": "EU 47 / UK14",
                    "48": "EU 48 / UK15",
                };
            }

            var has_updated = false;

            $size.find("option").each(function () {
                var val = $(this).text();
                if (fr_uk[parseInt(val)]) {
                    $(this).text(fr_uk[parseInt(val)]);
                    has_updated = true;
                }
            });

            if (has_updated) {
                $size.addClass("updated");
                console.log("updated");
            }


        }

        $(document).on("click", ".swatch-select.size", setupSizeGuideEvent);
        $(document).on("click", "#attribute135", setupSizeGuideEvent);

        console.log("loadSize");
        var loadSize = setInterval(function () {
            var swatch = $(".swatch-select.size");

            if (swatch.length === 0) {
                swatch = $("#attribute135");
            }

            if (swatch) {
                if (swatch.hasClass("updated")) {
                    clearInterval(loadSize);
                }
                setupSizeGuide(swatch);
            }
        }, 300);
    });
});

require([
    "jquery"
], function ($) {
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    //cookie
    $(document).ready(function ($) {
        function CookieBar() {
            var $cookie_bar = $("#cookie-law-info-bar");

            var bind_ui = function () {
                $cookie_bar.find("#cookie_action_close_header").click(function (e) {
                    e.preventDefault();
                    $cookie_bar.removeClass("active");
                    setCookie("cookie-accepted", true, 365);
                });
            };

            var open_cookie_bar = function () {
                $cookie_bar.addClass("active");
            };

            this.init = function () {
                var accepted_cookies = getCookie("cookie-accepted");

                if (!accepted_cookies) {
                    bind_ui();
                    open_cookie_bar();
                }
            };
        }

        var cookie_bar = new CookieBar();
        cookie_bar.init();
    });


//mailchimp popup
    $(document).ready(function ($) {
        var ajaxCall = false;


        function NewsLetter() {
            var $npo = $("#newsletters_popup_overlay");

            var bind_ui = function () {
                var $form = $("#newsletters_popup_overlay #newsletter_form");

                $npo.find(".close-btn").click(function () {
                    $npo.fadeOut();
                    setCookie("has_finished_newsletter", true, 15);
                });

                $npo.find(".continue-btn").click(function () {
                    $npo.fadeOut();
                    setCookie("has_finished_newsletter", true, 365);
                });

                $form.find(".newsletter_concent").on("change", function () {
                    console.log("test");
                    if (!$(this).is(':checked')) {
                        $form.removeClass("accepted")
                    } else {
                        $form.addClass("accepted")
                    }
                });

                $form.on("submit", function (e) {
                    e.preventDefault();
                    var fd = new FormData($(this)[0]);

                    //only allow one cool at a time
                    if (ajaxCall) {
                        return;
                    }

                    //concent checkout
                    var $concent_checkbox = $(this).find(".newsletter_concent");

                    if (!$concent_checkbox.is(':checked')) {
                        return;
                    }

                    //add submit marker
                    fd.append('submit', 'submit');

                    //remove errors
                    $(this).find(".error").remove();
                    $(this).addClass("loading");

                    ajaxCall = $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: "/mailchimp/add_subscriber.php",
                        data: fd,
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            console.log(data);
                            ajaxCall = false;

                            if (data.result === true) {
                                $("#newsletters_popup").addClass("success-result");
                            } else {
                                $("#newsletter_form").append($("<span/>").addClass("error").text(data.msg))
                            }
                        },
                        error: function () {
                            console.error("error");
                            ajaxCall = false;
                        },
                        complete: function () {
                            $("#newsletter_form").removeClass("loading");
                        }
                    });
                });
            };

            var open_newsletter = function () {
                $npo.addClass("active");
            };

            this.init = function () {
                if ($(window).width() < 768 || location.pathname.indexOf('/newsletter') >= 0) {
                    return;
                }

                var cname = 'newsletter_page_count';
                var current_count = getCookie(cname);

                if (!current_count) {
                    current_count = 0;
                }

                current_count++;
                setCookie(cname, current_count, 15);

                var has_finished_newsletter = getCookie("has_finished_newsletter");

                if (current_count >= 2 && !has_finished_newsletter) {
                    bind_ui();
                    open_newsletter();
                }
            };
        }

        var news = new NewsLetter();
        news.init();
    });

    $(document).ready(function ($) {
        var $form_cart = $("form.form-cart");

        if ($form_cart.length) {
            var $form_cart_qty = $form_cart.select(".control.qty select");
            $form_cart_qty.on("change", function () {
                $form_cart.trigger("submit");
            });
        }

    });

//mailchimp popup
    $(document).ready(function ($) {
        var ajaxCall = false;

        function NewsLetterSection() {
            var $npo = $("#newsletters_con");
            if ($npo.length === 0) {
                return;
            }

            var $form = $npo.find("form");

            var bind_ui = function () {
                var that = this;

                $form.find(".newsletter_concent").on("change", function () {
                    console.log("test");
                    if (!$(this).is(':checked')) {
                        $form.removeClass("accepted")
                    } else {
                        $form.addClass("accepted")
                    }
                });

                $form.submit(function (e) {
                    e.preventDefault();
                    var fd = new FormData($(this)[0]);

                    //only allow one cool at a time
                    if (ajaxCall) {
                        return;
                    }

                    //concent checkout
                    var $concent_checkbox = $(this).find(".newsletter_concent");

                    if (!$concent_checkbox.is(':checked')) {
                        return;
                    }

                    //add submit marker
                    fd.append('submit', 'submit');

                    //remove errors
                    $(this).find(".error").remove();
                    $(this).addClass("loading");

                    ajaxCall = $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: "/mailchimp/add_subscriber.php",
                        data: fd,
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            ajaxCall = false;

                            if (data.result === true) {
                                $("#newsletters_con").addClass("success-result");
                            } else {
                                $form.append($("<span/>").addClass("error").text(data.msg))
                            }
                        },
                        error: function () {
                            console.error("error");
                            ajaxCall = false;
                        },
                        complete: function () {
                            $form.removeClass("loading");
                        }
                    });
                });
            };

            bind_ui();
        }

        var newsLetter = new NewsLetterSection();
    });

//footer newsletter
    $(document).ready(function ($) {
        function FooterNewsLetter() {
            var $npo = $(".footer-newsletter");
            if ($npo.length === 0) {
                return;
            }

            var $form = $npo.find("form");

            var bind_ui = function () {
                var that = this;

                $form.find(".newsletter_concent").on("change", function () {
                    if (!$(this).is(':checked')) {
                        $form.removeClass("accepted")
                    } else {
                        $form.addClass("accepted")
                    }
                });
            };

            bind_ui();
        }

        var newsLetter = new FooterNewsLetter();
    });

    $(document).ready(function ($) {
        if ($('.mobile-banner').length !== 0 && is_touch_device()) {
            $("body").addClass("has-banner");
        }

        //check if the device has a touch screen
        function is_touch_device() {
            return 'ontouchstart' in window        // works on most browsers
                || navigator.maxTouchPoints;       // works on IE10/11 and Surface
        };


        if (is_touch_device()) {
            $('body').addClass("is-touch");
        }


        $('#product-addtocart-button').on('click', function () {
            setTimeout(function () {
                $('.quantity_section').removeClass('size_error');
                $('.quantity_section').removeClass('color_error');

                $('div.mage-error:visible').each(function () {
                    var error_elem = $(this).parent().attr('attribute-code');
                    var error_elem_extra = error_elem + '_error';
                    $('.quantity_section').addClass(error_elem_extra);
                });


            }, 200);

        });
//$('.filter-options-item').removeClass('active');
        /*Product Vertical Thumbnail SCRIPT*/
        !function (a) {
            a.fn.verticalCarousel = function (b) {
                var h, j, k, l, m, c = "vc_container", d = "vc_list", e = "vc_goUp", f = "vc_goDown", g = {currentItem: 1, showItems: 1},
                    b = a.extend(g, b), n = function () {
                        var c = 0, d = 0;
                        if (1 == b.showItems) c = a("> :nth-child(" + b.currentItem + ")", j).outerHeight(!0); else for (i = 1; i <= b.showItems; i++) c += a("> :nth-child(" + i + ")", j).outerHeight(!0);
                        var e = b.showItems + b.currentItem;
                        d = a("> :nth-child(" + e + ")", j).css("marginTop"), c -= parseInt(d), a(h).css("height", c)
                    }, o = function () {
                        var c = a("> :nth-child(" + b.currentItem + ")", j).offset(), d = a(j).offset(), e = d.top - c.top;
                        a(j).css({
                            "-ms-transform": "translateY(" + e + "px)",
                            "-webkit-transform": "translateY(" + e + "px)",
                            transform: "translateY(" + e + "px)"
                        })
                    }, p = function (c) {
                        1 == b.currentItem ? a(k).addClass("isDisabled") : b.currentItem > 1 && a(k).removeClass("isDisabled"), b.currentItem == m || b.currentItem + b.showItems > m ? a(l).addClass("isDisabled") : b.currentItem < m && a(l).removeClass("isDisabled")
                    }, q = function (a) {
                        "up" == a && (b.currentItem = b.currentItem - 1), "down" == a && (b.currentItem = b.currentItem + 1), p(), n(), o()
                    };
                return this.each(function () {
                    a(this).find("." + d).wrap('<div class="' + c + '"></div>'), h = a(this).find("." + c), j = a(this).find("." + d), k = a(this).find("." + e), l = a(this).find("." + f), m = a(j).children().length, p(), n(), o(), a(k).on("click", function (a) {
                        b.currentItem > 1 && q("up"), a.preventDefault()
                    }), a(l).on("click", function (a) {
                        b.currentItem + b.showItems <= m && q("down"), a.preventDefault()
                    })
                })
            }
        }(jQuery);
        /*End Product Vertical Thumbnail SCRIPT*/
        /*NavBar Scripts*/
        $('.menu-icon-ham, .menu-icon-right .search-button').on("click", function () {
            $(this).toggleClass('open');
            $('.navMenu-list-container').toggleClass('open');
        });
        $('.main-container').on("click", function () {
            $('.menu-icon-ham').removeClass('open');
            $('.navMenu-list-container').removeClass('open');
        });
        /*End NavBar Scripts*/

        /*Smooth Scroll*/
        $('a[href^="#"].smoothScroll').on('click', function (event) {
            var target = $(this.getAttribute('href'));
            if (target.length) {
                event.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: parseInt(target.offset().top) - 0 //0px space above the section
                }, 500);
            }
        });
        /*End Smooth Scroll*/

        /* Sticky Nav*/
        $(window).scroll(function () {
            if ($(window).scrollTop() > 0 && !$('.mobile-toggle').is(":visible")) {
                $('.top-bar').addClass('nav-sticky');
            } else {
                $('.top-bar').removeClass('nav-sticky');
            }
        });
        /*var lastScrollTop = 0;
        $(window).scroll(function(event){
           var st = $(this).scrollTop();
           if (st > lastScrollTop || st == 0){
               $('.top-bar').removeClass('nav-sticky');
           } else {
              $('.top-bar').addClass('nav-sticky');
           }
           lastScrollTop = st;
        });*/
        /*End Sticky Nav*/

        /* Append .background-image <img>'s as CSS backgrounds*/
        $('.background-image > img:first-child').each(function () {
            var imgSrc = $(this).attr('src');
            if (imgSrc != undefined) {
                $(this).parent().css('background-image', 'url("' + imgSrc + '")');
                $(this).hide();
                //$(this).parent().css('background-position', '50% 0%');
            }
        });
        /* End Append .background-image <img>'s as CSS backgrounds*/

        /*Quantity Increment Decrement Button*/
        $(".incrementer").prepend('<div class="dec increment-button">-</div>').append('<div class="inc increment-button">+</div>');

        $(".increment-button").on("click", function () {
            var $button = $(this);
            var oldValue = $button.parent().find("input").val();
            if ($button.text() == "+") {
                var newVal = parseFloat(oldValue) + 1;
            } else {
                // Don't allow decrementing below zero
                if (oldValue > 0) {
                    var newVal = parseFloat(oldValue) - 1;
                } else {
                    newVal = 0;
                }
            }
            $button.parent().find("input").val(newVal);
        });
        /*End Quantity Increment Decrement Button*/

        /*Write a Review Show*/
        $('.write-a-review-button').on("click", function () {
            $('.write-a-review-container').slideToggle('fast');
        });
        /*End Write a Review Show*/

        /*Product Vertical Thumbnails*/
        /* $(".product-vertical-thumbnail").verticalCarousel({
            currentItem: 1,
            showItems: 3,
        }); */
        $(document).on('DOMNodeInserted', function (e) {

            if ($(e.target).hasClass('post-list')) {

                $('.background-image > img:first-child').each(function () {
                    var imgSrc = $(this).attr('src');
                    if (imgSrc != undefined) {
                        $(this).parent().css('background-image', 'url("' + imgSrc + '")');
                        $(this).hide();
                        //$(this).parent().css('background-position', '50% 0%');
                    }
                });

            }
        });
        $('.product-vertical-thumbnail .product-image').on("click", function () {
            var $imgSrc = $(this).attr('src');
            $('.product-actual-images .product-image').attr('src', $imgSrc);
        });

        /*Height Fix For Safari*/
        $(window).load(function () {
            "use strict";
            $('.vc_goDown').click();
            $('.vc_goUp').click();
        });
        /*End Product Vertical Thumbnails*/
    });


// Align Elements Vertically
    $(window).load(function () {
        "use strict";
        alignVertical();
        alignBottom();
        $(window).resize(function () {
            alignVertical();
            alignBottom();
        });
    });

    function alignVertical() {

        $('.align-vertical').each(function () {
            var that = $(this);
            var height = that.height();
            var parentHeight = that.parent().height();
            var padAmount = (parentHeight / 2) - (height / 2);
            that.css('padding-top', padAmount);
        });

    }

    function alignBottom() {
        $('.align-bottom').each(function () {
            var that = $(this);
            var height = that.height();
            var parentHeight = that.parent().height();
            var padAmount = (parentHeight) - (height) - 32;
            that.css('padding-top', padAmount);
        });
    }


});