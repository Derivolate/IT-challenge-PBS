var main = function() {
  /* Push the body and the nav over by 285px over */
  $('.icon-menu').click(function() {
    $('.menu').animate({
      left: "10px"
    }, 200);

  });

  /* Then push them back */
  $('.icon-close').click(function() {
    $('.menu').animate({
      left: "-105px"
    }, 200);

  });
};


$(document).ready(main);