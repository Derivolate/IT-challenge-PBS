                var socket = io();

                function update() {
                    var query = $('#m').val();
                    if (query) {
                        socket.emit('zoek', query);
                    } else {
                        $('#suggestions').empty();
                    }
                }
                $('form').submit(function() {
                    socket.emit('zoek', $('#m').val());
                    $('#m').val('');
                    return false;
                });
                socket.on('zoek', function(msg) {
                    var reslist = $('#suggestions');
                    reslist.empty();
                    var item = 0;
                    for (item in msg) {
                        if (item >= 10) {
                            break;
                        }
                        reslist.append($('<button type="button" id="suggestion" class="pr">').text(msg[item].job));
                    }
                    reslist.append($('<tr>').text(msg.length + " records in totaal"));
                });