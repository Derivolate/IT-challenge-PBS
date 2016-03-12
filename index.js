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
  
  function newValidation(userId){
	var q2 = "UPDATE loggedin SET sessionid = '" + socket.id + "' WHERE id = " + userId + ";";
	db.query(q2, function(err, rows){});
	socket.emit('validate', socket.id);
  }
	
  socket.on('zoek', function(msg){
	msg = getSafeQuery(msg);
	var search = "SELECT job FROM jobs WHERE job LIKE '%" + msg + "%' ORDER BY CASE WHEN job LIKE '" + msg + "%' THEN 0 ELSE 1 END, job;";
	db.query(search, function(err, rows){
		if (err) throw err;
		socket.emit('zoek', rows);
	});
  });
  socket.on('results-beroep', function(msg){
	var fakeResults =[
		{id: 1, naam: "test1", beschrijving: "jsdfljsdlkfja;lehrfk;sdjf;skdfjksdjf;lsdfjlkejfl;kd"},
		{id: 2, naam: "test1", beschrijving: "jsdfljsdlkfja;lehrfk;sdjf;skdfjksdjf;lsdfjlkejfl;kd"},
		{id: 3, naam: "test1", beschrijving: "jsdfljsdlkfja;lehrfk;sdjf;skdfjksdjf;lsdfjlkejfl;kd"},
		{id: 4, naam: "test1", beschrijving: "jsdfljsdlkfja;lehrfk;sdjf;skdfjksdjf;lsdfjlkejfl;kd"},
		{id: 5, naam: "test1", beschrijving: "jsdfljsdlkfja;lehrfk;sdjf;skdfjksdjf;lsdfjlkejfl;kd"},
		{id: 6, naam: "test1", beschrijving: "jsdfljsdlkfja;lehrfk;sdjf;skdfjksdjf;lsdfjlkejfl;kd"},
		{id: 7, naam: "test1", beschrijving: "jsdfljsdlkfja;lehrfk;sdjf;skdfjksdjf;lsdfjlkejfl;kd"},
		{id: 8, naam: "test1", beschrijving: "jsdfljsdlkfja;lehrfk;sdjf;skdfjksdjf;lsdfjlkejfl;kd"},
		{id: 9, naam: "test1", beschrijving: "jsdfljsdlkfja;lehrfk;sdjf;skdfjksdjf;lsdfjlkejfl;kd"},
		{id: 10, naam: "test1", beschrijving: "jsdfljsdlkfja;lehrfk;sdjf;skdfjksdjf;lsdfjlkejfl;kd"},
		{id: 11, naam: "test1", beschrijving: "jsdfljsdlkfja;lehrfk;sdjf;skdfjksdjf;lsdfjlkejfl;kd"},
		{id: 12, naam: "test1", beschrijving: "jsdfljsdlkfja;lehrfk;sdjf;skdfjksdjf;lsdfjlkejfl;kd"},
		{id: 13, naam: "test1", beschrijving: "jsdfljsdlkfja;lehrfk;sdjf;skdfjksdjf;lsdfjlkejfl;kd"},
	];
	console.log('results-beroep');
	socket.emit('results', fakeResults);
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
				var q3 = "INSERT INTO loggedin (id, loggedin, sessionid) VALUES (" + rows[0].id + ", 0, '');";
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
				var loginq = "UPDATE loggedin SET loggedin = 1, sessionId = '" + socket.id + "' WHERE id = " + rows[0].id + ";";
				db.query(loginq, function(err, rows){});
				socket.emit('login', rows[0].id);
				socket.emit('validate', socket.id);
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
  socket.on('logout', function(data){
	var logoutq = "UPDATE loggedin SET loggedin = 0 WHERE id = " + data.userId + " AND sessionid = '" + data.sessionId + "';";
	db.query(logoutq, function(err, rows){});
	loggedin = false;
	loginId = null;
  });
  socket.on('is_ingelogd', function(data){
	var loggedinq = "SELECT * FROM loggedin WHERE id = " + data.userId + " AND sessionid = '" + data.sessionId + "';";
	console.log(loggedinq);
	db.query(loggedinq, function(err, rows){
		if (rows[0]){
			console.log(rows[0]);
			socket.emit('ingelogd', rows[0].loggedin == 1);
			newValidation(rows[0].id);
		}
	});
  });
  socket.on('login_username', function(userId){
	
  });
  socket.on('nieuw_project', function(project){
    var q = "INSERT INTO projects (projectid, projectnaam, omschrijving, plaats, startdatum, einddatum, functie, omschrijvingwerkzaamheden, vaardigheden, skills, functieomvang, aantaluren, startdatum, einddatum, bestandsnaam) VALUES (";
	var i = 0;
	for (i in project){
		q += "'" + project[i] + "'";
		if (i < project.length){
			q += ", ";
		}
	}
	q += ");";
	db.query(q, function(err, rows){});
  });
  socket.on('validate', function(sessionId){
	var q = "SELECT * FROM loggedin WHERE sessionid = '" + sessionId + "';";
	db.query(q, function(err, rows){
		if (rows.length > 0){
			newValidation(rows[0].id);
		}
	});
  });
  
  socket.on('disconnect', function(){
	/*if (loggedin){
		var logoutq = "UPDATE loggedin SET loggedin = 0 WHERE id = " + loginId + ";";
		db.query(logoutq, function(err, rows){});
	}*/
  });
});