define ([
    'jquery', 
    'jquery/ui',
	'lekkersapje'
], function($){

    $( document ).ready(function() {
		if ($(window).width() < 768) {
			
		}
		$('.tocart').click(function() {
			
			$("body").prepend("<div class='custom_loader'><img src='/pub/media/loader-1.gif'/><div class='message'>Uw wijn wordt toegevoegd aan uw wijnmandje. Een momentje alstublieft.</div></div>");
			
			var url = $('form[data-role=tocart-form]').attr("action");
			var productId = $("input[name=product]").val();
			var qty = $("input[name=qty]").val();
			$.ajax({
				type:"POST",
				url:url,
				data: productId,
				success: function (html) {
					$( ".custom_loader" ).remove();
				}
			});			
		});
		
		$('.julius_product .rating-summary .first-note').click(function() {
			$(".custom-review").removeClass('display_none');
		});
		$('.custom-review .custom-review-block .close-button').click(function() {
			$(".custom-review").addClass('display_none');
		});
		
		$('.julius_product .rating-summary .recommendation').click(function() {
			console.log("aaa");
		});
	});
});
