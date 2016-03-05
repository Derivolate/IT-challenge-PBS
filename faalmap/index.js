
var io = require('socket.io')(http);
var express =      require('express');
var server  =      express();

 
 server.use(express.static(__dirname + '/www'));
 
 io.on('connection', function(socket){
  socket.on('chat message', function(msg){
	 console.log(msg);
    socket.emit('chat message', msg);
  });
});
 
 http.listen(3000, function(){
  console.log('listening on *:3000');
});