require([
    "jquery"
    ], function($){

$(document).ready(function($){

    /*Product Vertical Thumbnail SCRIPT*/
!function(a){a.fn.verticalCarousel=function(b){var h,j,k,l,m,c="vc_container",d="vc_list",e="vc_goUp",f="vc_goDown",g={currentItem:1,showItems:1},b=a.extend(g,b),n=function(){var c=0,d=0;if(1==b.showItems)c=a("> :nth-child("+b.currentItem+")",j).outerHeight(!0);else for(i=1;i<=b.showItems;i++)c+=a("> :nth-child("+i+")",j).outerHeight(!0);var e=b.showItems+b.currentItem;d=a("> :nth-child("+e+")",j).css("marginTop"),c-=parseInt(d),a(h).css("height",c)},o=function(){var c=a("> :nth-child("+b.currentItem+")",j).offset(),d=a(j).offset(),e=d.top-c.top;a(j).css({"-ms-transform":"translateY("+e+"px)","-webkit-transform":"translateY("+e+"px)",transform:"translateY("+e+"px)"})},p=function(c){1==b.currentItem?a(k).addClass("isDisabled"):b.currentItem>1&&a(k).removeClass("isDisabled"),b.currentItem==m||b.currentItem+b.showItems>m?a(l).addClass("isDisabled"):b.currentItem<m&&a(l).removeClass("isDisabled")},q=function(a){"up"==a&&(b.currentItem=b.currentItem-1),"down"==a&&(b.currentItem=b.currentItem+1),p(),n(),o()};return this.each(function(){a(this).find("."+d).wrap('<div class="'+c+'"></div>'),h=a(this).find("."+c),j=a(this).find("."+d),k=a(this).find("."+e),l=a(this).find("."+f),m=a(j).children().length,p(),n(),o(),a(k).on("click",function(a){b.currentItem>1&&q("up"),a.preventDefault()}),a(l).on("click",function(a){b.currentItem+b.showItems<=m&&q("down"),a.preventDefault()})})}}(jQuery);
/*End Product Vertical Thumbnail SCRIPT*/
/*NavBar Scripts*/
    $('.menu-icon-ham').on("click", function(){
        $(this).toggleClass('open');
        $('.navMenu-list-container').toggleClass('open');
    });
    $('.main-container').on("click", function(){
        $('.menu-icon-ham').removeClass('open');
        $('.navMenu-list-container').removeClass('open');
    });
/*End NavBar Scripts*/
    
/*Smooth Scroll*/
    $('a[href^="#"].smoothScroll').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if( target.length ) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: parseInt(target.offset().top)-0 //0px space above the section
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
    
    $(".increment-button").on("click", function() {
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
    $('.write-a-review-button').on("click", function(){
        $('.write-a-review-container').slideToggle('fast');
    });
/*End Write a Review Show*/
    
/*Product Vertical Thumbnails*/
//    $(".product-vertical-thumbnail").verticalCarousel({
//        currentItem: 1,
//        showItems: 3,
//    });
    $('.product-vertical-thumbnail .product-image').on("click", function(){
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
$(document).on('DOMNodeInserted', function(e) { 
    
    if ($(e.target).hasClass('post-list') ) { 
            
            $('.background-image > img:first-child').each(function () {
        var imgSrc = $(this).attr('src');
        if (imgSrc != undefined) {
            $(this).parent().css('background-image', 'url("' + imgSrc + '")');
            $(this).hide();
            //$(this).parent().css('background-position', '50% 0%');
        }
    });
        
        } });

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