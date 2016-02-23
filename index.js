 var express =      require('express');
 var server  =      express();
 var ejs = require('ejs'); 
 ejs.open = '{{'; 
 ejs.close = '}}';

 server.use(express.compress());

 server.configure(function(){
   server.set("view options", {layout: false});  
   server.engine('html', require('ejs').renderFile); 
   server.use(server.router);
   server.set('view engine', 'html');
   server.set('views', __dirname + "/www");
 });


 server.all("*", function(req, res, next) {
     var request = req.params[0];

         if((request.substr(0, 1) === "/")&&(request.substr(request.length - 4) === "html")) {
         request = request.substr(1);
         res.render(request);
     } else {
         next();
     }

 });

 server.use(express.static(__dirname + '/www'));
