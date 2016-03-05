function changeBG(){
  var element = document.getElementById('test');
  element.setAttribute("class", 'newBG'); //For Most Browsers
  element.setAttribute("className", 'newBG'); //For IE; harmless to other browsers.
}