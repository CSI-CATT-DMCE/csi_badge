require('dotenv').config();

const express = require('express');
const { appendFileSync } = require('fs');
const app = express();
const mysql = require('mysql');
const port = 3000;
const path = require('path');
const hbs = require('hbs');
const multer = require('multer');
const queries = require('./sqlFun/queries');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
const fs = require('fs');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.set('view engine', 'ejs');

app.set('view engine', 'hbs');
app.use(express.static('images/avatar'));
app.use(express.static('images/badges'));



console.log(process.env.DB_HOST);


app.get('/', async (req, res,next) => {
// leaderboard start
var connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_name,
});

var q =
	'SELECT c.u_id, u.name, count(*) as c_count from c_certificates as c INNER JOIN u_users as u on u.u_id = c.u_id GROUP BY c.u_id ORDER BY 3 DESC Limit 5;';

connection.query(q, async function (error, results, fields) {
	if (error) throw error;
	var userdetails = results;

	var connection2 = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_name,
});
	var q2 =
		'SELECT e.name as event_name, e.badges as badge_link, DATE_FORMAT(e.date, "%d %b %Y") as event_date, e.description as event_description, e.short_description as event_short_description from e_events as e where e.date >= CURRENT_DATE;';
	connection2.query(q2, function (error, results1, fields) {
		if (error) throw error;
		var upcomingeventdetails = results1;
		console.log(upcomingeventdetails);
		
		console.log(userdetails);

		res.render("home",{x:userdetails,y:upcomingeventdetails});
	});
	connection2.end();
});
connection.end();
	





	

	
// Event end
});

app.get('/admin/login', (req, res) => {
	res.render('login');
});

app.post('/admin/login', urlencodedParser, (req, res) => {
	const data = JSON.parse(JSON.stringify(req.body));
	const connection = mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database:process.env.DB_name
	});
	var answer;
	connection.query('SELECT * from a_admins', function (error, results, fields) {
		if (error) throw error;
		for (var i = 0; i < results.length; i++) {
			if (results[i].username === data.email) {
				if (results[i].password === data.password) {
					return res.redirect('/admin');
					console.log('yes');
					break;
				}
			} else {
				console.log('No');
				return res.redirect('/admin/login');
			}
		}
	});

	connection.end();
});

app.get('/admin',(req,res)=>{
	res.render('admin');
})



app.get('/registeruser', (req, res) => {
	res.render('registeruser');
});
const userupload = multer({
	dest: 'images/avatar'
// 	add limit

});
app.post('/registeruser', userupload.single('avatar'), urlencodedParser, (req, res) => {
	const data = JSON.parse(JSON.stringify(req.body));
	console.log(data);

	fs.rename('images/avatar/' + req.file.filename, 'images/avatar/' + req.file.filename + '.png', function (
		err
	) {
		if (err) console.log('ERROR: ' + err);
	});

	console.log(req.file.originalname);
	console.log(req.file.filename);
	var badgeName = req.file.filename + '.png';
	console.log(badgeName);

	var dataObject = {
		name: data.name.toUpperCase(),
		email: data.email.toLowerCase(),
		year:data.year,
		gr_no: data.gr_no,
		avatar: badgeName,
	};
	queries.insertToUsers(dataObject);
	
	res.redirect('/admin');
});

app.get('/registerevents', (req, res) => {
	res.render('registerevents');
});
const upload = multer({
	dest: 'images/badges',
});

app.post('/registerevents', upload.single('badge'), urlencodedParser, async (req, res) => {
	console.log('Helo');
	const data = JSON.parse(JSON.stringify(req.body));
	console.log(data);
	console.log(req.file.filename);
	console.log(req.file.originalname);
	fs.rename(
		'images/badges/' + req.file.filename,
		'images/badges/' + req.file.filename + '.png',
		function (err) {
			if (err) console.log('ERROR: ' + err);
		}
	);
	var badgeName = req.file.filename + '.png';
	console.log(badgeName);
	var dataObject = {
		name: data.name,
		date: data.date,
		badges: badgeName,
		short_description:data.short_description,
		description : data.description
	};
	queries.insertToEvents(dataObject);

	res.redirect('/admin');
});


app.get('/users', (req, res) => {
	var connection = mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database:process.env.DB_name
	});

	var answer;
	connection.query('SELECT * from u_users', function (error, results) {
		if (error) {
			throw error;
		} else {
			answer = results;
			// console.log(results);
		}
		res.render('users', { user: answer });
	});

	connection.end();
});

app.post('/users', urlencodedParser, (req, res) => {
	const data = JSON.parse(JSON.stringify(req.body));
	console.log(data);

	var userId = data.users;
	var connection = mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database:process.env.DB_name
	});

	var q =
		'SELECT u.u_id as u_id, u.avatar as avatar,u.name as username,  e.name as event_name, e.badges as badge_link from u_users as u LEFT JOIN c_certificates as c on c.u_id = u.u_id LEFT JOIN e_events as e on e.e_id = c.e_id where u.u_id = ? ';

	connection.query(q, userId, function (error, results, fields) {
		if (error) {
			console.log('User not found');
		} else {
			answer = results;
		console.log(results);
			}
		res.render('users',{x:answer,y:answer[0].avatar,z:answer[0].username});
	});
	

	connection.end();

});

app.get('/certificates', async (req, res) => {
	var connection = mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database:process.env.DB_name
	});

	var answer;
	await connection.query('SELECT * from e_events', function (error, results, fields) {
		if (error) throw error;
		answer = results;
		res.render('certificate', { events: answer });
	});

	connection.end();
	// return answer;
});

app.post('/certificates', urlencodedParser, (req, res) => {
	const data = JSON.parse(JSON.stringify(req.body));
	console.log(data);
	
	var c = data.users;
	function replaceAll(str, find, replace) {
		return str.replace(new RegExp(find, 'g'), replace);
	}
	c = replaceAll(c, '\r', ' ');
	c = replaceAll(c, '\r\n', ' ');
	c = replaceAll(c, '\n', ' ');
	// console.log(replaceAll('adsdasdasdasd', 'as', '=='));

	var e = c.split(' ');
	var finalarr = e.filter((ele) => {
		return ele != '';
	});
	console.log(finalarr);

	var arr = [];
	for (var i = 0; i < finalarr.length; i++) {
		arr.push([finalarr[i], data.events]);
	}

	console.log(arr);

	for (var i = 0; i < arr.length; i++) {
		console.log('hello');
		queries.sendCertificates(arr[i]);
	}
	console.log('executed');
	res.redirect('/admin');
});

app.listen(port, (req, res) => {
	console.log('Server is listening on port' + port);
});