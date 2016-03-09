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
app.get('/login', function(req, res) {
    res.render('../www/login');
});
app.get('/register', function(req, res) {
    res.render('../www/register');
});
});
http.listen(50002, function() {
    console.log('listening on *:50002');
});


io.on('connection', function(socket){
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
  socket.on('gebruiker_nieuw', function(account){
	var username = getSafeQuery(account.username);
	var password = getSafeQuery(account.password);
	
	var q = 'INSERT INTO accounts (username, password) VALUES ("' + username + '", "' + password + '");';
	db.query(q, function(err, rows){});
  });
  socket.on('login', function(account){
	var username = getSafeQuery(account.username);
	var password = getSafeQuery(account.password);
	
	var q = 'SELECT password FROM accounts WHERE username = ' + username + ';';
	db.query(q, function(err, rows){
		if (rows.length == 0){
			socket.emit('geen_account', null);
		}
		else{
			
		}
	});
  });
  socket.on('pform', function(data){
    console.log("swek ingestuurd");
  });
});