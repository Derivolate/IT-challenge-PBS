             var socket = io();
              /*$('#resultatenzoeken').submit(function(){
                socket.emit('results-beroep', $('#m').val());
                $('#m').val('');
                return false;
              });*/
			  
			  $('form').submit(function() {
				socket.emit('results-beroep', $('#m').val());
				return false;
			  });
            
              socket.on('results', function(msg){
                var results = $('#results-beroep');
				results.empty();
                //$("<tr><td><input type=\"text\">CLIENT ID</td><td>JOB NAME</td></tr>").appendTo($("#functies-table"));
                var item = 0;
				for (item in msg) {
					if (item >= 100) {
						break;
					}
					results.append($('<button type="button" id="resultitem" class="pr">').text(msg[item].id));
				}
				results.append($('<tr>').text(msg.length + " records in totaal"));
              });