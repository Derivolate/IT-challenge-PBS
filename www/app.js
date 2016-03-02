$(document).ready(function() {
	var expanded = false;
	
	$('.icon-menu').click(function() 
	{
		if (expanded === false)
		{
			expanded = true;
			$('.left-sidebar').animate({
				left: "105px"
			}, 200);
		}
		else if (expanded === true)
		{
			expanded = false;
			$('.left-sidebar').animate({
				left: "8px"
			}, 200);
		}
	});
});