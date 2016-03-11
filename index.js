var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'NEWPASSWORD',
    database: 'ITC'
});

db.connect(function(err) {
    if (err) console.log(err)
});

function getSafeQuery(inputquery){
	return inputquery.replace("?", "").replace("'", "''").replace("%", "");
}

function userExists(username){
	db.query("SELECT * FROM accounts WHERE username = '" + username + "';", function(err, rows){
		if (err){
			console.log(err);
		}
		return rows.length;
	});
}

app.use(express.static(__dirname + '/www'));
app.set('view engine', 'ejs');



app.get('/', function(req, res) {
    res.render('../www/index');
});
app.get('/index', function(req, res) {
    res.render('../www/index');
});
app.get('/project', function(req, res) {
    res.render('../www/project');
});
app.get('/resource', function(req, res) {
    res.render('../www/resource');
});
app.get('/resultaten', function(req, res) {
    res.render('../www/resultaten');
});
app.get('/results', function(req, res) {
    res.render('../www/results');
});
app.get('/login', function(req, res) {
    res.render('../www/login');
});
app.get('/register', function(req, res) {
    res.render('../www/register');
});
http.listen(50002, function() {
    console.log('listening on *:50002');
});
app.get('/myacc', function(req, res) {
    res.render('../www/myacc');
});



io.on('connection', function(socket){
  var loggedin = false;
  var loginId = null;
  socket.on('zoek', function(msg){
	msg = getSafeQuery(msg);
	var search = "SELECT job FROM jobs WHERE job LIKE '%" + msg + "%' ORDER BY CASE WHEN job LIKE '" + msg + "%' THEN 0 ELSE 1 END, job;";
	db.query(search, function(err, rows){
		if (err) throw err;
		socket.emit('zoek', rows);
	});
  });
  socket.on('beroep', function(msg){
	msg = getSafeQuery(msg);
    var newjobs = msg.split("+");
    var i = 0;
    for (i in newjobs){
    	var q = 'INSERT INTO jobs (job) VALUES ("' + newjobs[i] + '");';
		db.query(q, function(err, rows){});
    }
  });
  socket.on('registreer', function(account){
	var username = getSafeQuery(account.username);
	var password = getSafeQuery(account.password);
	
	console.log(username);
	console.log(password);
	
	console.log(userExists(username));
	
	var q = "SELECT * FROM accounts WHERE username = '" + username + "';";
	db.query(q, function(err, rows){
		if (rows.length == 0){
			var q2 = "INSERT INTO accounts (username, password) VALUES ('" + username + "', '" + password + "');";
			db.query(q2, function(err, rows){});
			db.query("SELECT * FROM accounts WHERE username = '" + username + "';", function(err, rows){
				var q3 = "INSERT INTO loggedin (id, loggedin) VALUES (" + rows[0].id + ", 0);";
				db.query(q3, function(err, rows){});
			});
			socket.emit('registreer', true);
		}
		else{
			socket.emit('registreer', false);
		}
	});
  });
  socket.on('login', function(account){
	var username = getSafeQuery(account.username);
	var password = getSafeQuery(account.password);
	
	console.log(username);
	console.log(password);
	
	var q = "SELECT * FROM accounts WHERE username = '" + username + "';";
	db.query(q, function(err, rows){
		if (rows.length > 0){
			if (rows[0].password == password){
				var loginq = "UPDATE loggedin SET loggedin = 1 WHERE id = " + rows[0].id + ";";
				db.query(loginq, function(err, rows){});
				socket.emit('login', rows[0].id);
				loggedin = true;
				loginId = rows[0].id;
			}
			else{
				socket.emit('login', false);
			}
		}
		else{
			socket.emit('login', false);
		}
	});
  });
  socket.on('logout', function(userId){
	var logoutq = "UPDATE loggedin SET loggedin = 0 WHERE id = " + userId + ";";
	db.query(logoutq, function(err, rows){});
	loggedin = false;
	loginId = null;
  });
  socket.on('is_ingelogd', function(userId){
	var loggedinq = "SELECT * FROM loggedin WHERE id = " + userId + ";";
	console.log(loggedinq);
	db.query(loggedinq, function(err, rows){
		if (rows[0]){
			console.log(rows[0]);
			socket.emit('ingelogd', rows[0].loggedin == 1);
		}
	});
  });
  socket.on('login_username', function(userId){
	socket.emit('login_username', loginUsername);
  });
  socket.on('pform', function(data){
    console.log("swek ingestuurd");
  });
  
  socket.on('disconnect', function(){
	/*if (loggedin){
		var logoutq = "UPDATE loggedin SET loggedin = 0 WHERE id = " + loginId + ";";
		db.query(logoutq, function(err, rows){});
	}*/
  });
});