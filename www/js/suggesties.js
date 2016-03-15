                var socket = io();

                function update() {
                    var query = $('#m').val();
                    if (query) {
                        socket.emit('zoek', query);
                    } else {
                        $('#suggestions').empty();
                    }
					
					sessionStorage.setItem("search", query);
                }
				
                socket.on('zoek', function(msg) {
                    var reslist = $('#suggestions');
                    reslist.empty();
                    var item = 0;
                    for (item in msg) {
                        if (item >= 10) {
                            break;
                        }
                        reslist.append($('<button type="button" id="suggestion" class="pr" href="results" onclick="search(' + msg[item].job + ')">').text(msg[item].job));
                    }
                    reslist.append($('<tr>').text(msg.length + " records in totaal"));
                });