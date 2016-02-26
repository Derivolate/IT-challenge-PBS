var position = 0;
var main = function() {
  /* Push the body and the nav over by 285px over */
  if (position = 0){
  $('.icon-menu').click(function() {
    position = 1;
	$('.left-sidebar').animate({
      left: "105px"
    }, 200);

  });
};
els{
  /* Then push them back */
  $('.icon-menu').click(function() {
    position = 0;
	$('.left-sidebar').animate({
      left: "8px"
    }, 200);

  });
 };
};


$(document).ready(main);