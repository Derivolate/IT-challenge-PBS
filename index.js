var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

 app.use(express.static(__dirname + '/www'));
io.on('connection', function(socket){
  socket.on('zoek', function(msg){
    socket.emit('zoek', msg);
  });
  socket.on('pform', function(msg){
    console.log("swek ingestuurd")
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

