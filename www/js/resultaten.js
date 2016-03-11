             var socket = io();
              $('#resultatenzoeken').submit(function(){
                socket.emit('results', $('#m').val());
                $('#m').val('');
                return false;
              });
            
              socket.on('results', function(msg){
                $('#results-beroep').append($('<li>').text(msg));   
                $("<tr><td><input type=\"text\">CLIENT ID</td><td>JOB NAME</td></tr>").appendTo($("#functies-table")); return false;
                var item = 0;
                    for (item in msg) {
                        if (item >= 100) {
                            break;
                        }
                        reslist.append($('<button type="button" id="suggestion" class="pr">').text(msg[item].job));
                    }
                    reslist.append($('<tr>').text(msg.length + " records in totaal"));
                });