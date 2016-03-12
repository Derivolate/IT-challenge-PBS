$(document).ready(function() {
	
	$('.article').click(function() 
	{
			$('.article').removeClass('current');
			$('.article').children('.description').hide();
			$(this).addClass('current');
			$(this).children('.description').show();
	});
});