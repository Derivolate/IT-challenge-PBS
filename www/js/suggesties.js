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
				
				function choose(job){
					$('#m').val(job);
					sessionStorage.setItem("search", job);
				}
				
                socket.on('zoek', function(msg) {
                    var reslist = $('#suggestions');
                    reslist.empty();
                    var item = 0;
                    for (item in msg) {
                        if (item >= 10) {
                            break;
                        }
                        reslist.append($('<button id="suggestion" class="pr" onmouseover="choose(' + "'" + msg[item].job + "'" + ')">').text(msg[item].job));
                    }
                    reslist.append($('<tr>').text(msg.length + " records in totaal"));
                });