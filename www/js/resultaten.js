             var socket = io();
              /*$('#resultatenzoeken').submit(function(){
                socket.emit('results-beroep', $('#m').val());
                $('#m').val('');
                return false;
              });*/
			  
			  var search = sessionStorage.getItem("search");
			  
			  if (search !== null){
				socket.emit("results-beroep", search);
			  }
            
              socket.on('results', function(msg){
                var results = $('#beroep-results');
				results.empty();
                //$("<tr><td><input type=\"text\">CLIENT ID</td><td>JOB NAME</td></tr>").appendTo($("#functies-table"));
                var item = 0;
				for (item in msg) {
					if (item >= 100) {
						break;
					}
					results.append($('<button type="button" id="resultitem" class="pr">').text("id: " + msg[item].id + ", username:" + msg[item].username));
				}
				results.append($('<tr>').text(msg.length + " records in totaal"));
              });