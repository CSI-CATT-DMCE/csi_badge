const mysql = require('mysql');

function getUsers() {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_name
    });

    var answer;
    connection.query('SELECT * from u_users', function(error, results) {
        if (error) {
            throw error;
        } else {
            answer = results;
            console.log(results);
        }
    });

    connection.end();
}

function getEvents() {
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_name
    });

    var answer;
    connection.query('SELECT * from e_events', function(error, results, fields) {
        if (error) throw error;
        answer = results;
        console.log(results);
    });

    connection.end();
    return answer;
}

function getAdmins() {
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_name
    });

    var answer;
    connection.query('SELECT * from a_admins', function(error, results, fields) {
        if (error) throw error;

        console.log(results);
    });

    connection.end();
    return results;
}

function checkAdminCredentials(user, pass) {
    admins = getAdmins();
    for (var i = 0; i < admins.length; i++) {
        if (admins[i].username === user) {
            if (admin[i].password === pass) {
                return true;
            }
        }
    }
    return false;
}

function insertToEvents(insertdata) {
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_name
    });

    var end_result = connection.query('INSERT INTO e_events SET ?', insertdata, function(
        err,
        result
    ) {
        if (err) {
            console.log("Events can not be added");
        } else {
            console.log(result);
            console.log('Event added Successfully!');
        }
    });
    connection.end();
}

function insertToUsers(insertdata) {
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_name,
    });

    var end_result = connection.query('INSERT INTO u_users SET ?', insertdata, function(
        err,
        result
    ) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
    connection.end();
}

function insertToCertificates(insertdata) {
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_name,
    });

    var end_result = connection.query('INSERT INTO c_certificates SET ?', [insertdata], function(
        err,
        result
    ) {
        if (err) {
            console.log('certificate is already stored');
        } else {
            console.log(result);
        }
    });
    connection.end();
}

function topFiveUsers() {
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_name,
    });

    var q =
        'SELECT c.u_id, u.name, count(*) as c_count from c_certificates as c INNER JOIN u_users as u on u.u_id = c.u_id GROUP BY c.u_id ORDER BY 3 DESC Limit 5;';

    connection.query(q, function(error, results, fields) {
        if (error) throw error;
        console.log(results);
    });

    connection.end();
}

function sendCertificates(data) {
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_name,
    });

    var q =
        'select ( SELECT u_id FROM u_users WHERE email = ? ) AS u_id, ( select e_id FROM e_events WHERE name = ? ) AS e_id;';
    connection.query(q, data, function(error, results, fields) {
        if (error) {
            console.log('Email/Event does not exist');
        } else {
            answer = results;
            console.log(results);
            insertToCertificates(answer[0]);
        }
    });

    connection.end();
}

function sendBadges(data) {
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_name,
    });

    var q =
        'SELECT u.u_id as u_id,u.avatar as avatar, u.name as username, e.name as event_name, e.badges as badge_link from u_users as u INNER JOIN c_certificates as c on c.u_id = u.u_id INNER JOIN e_events as e on e.e_id = c.e_id where u.u_id = ? ';

    connection.query(q, data, function(error, results, fields) {
        if (error) {
            console.log('User not found');
        } else {
            answer = results;
            console.log(results);
        }
    });

    connection.end();
}

module.exports = {
    getUsers: getUsers,
    getEvents: getEvents,
    getAdmins: getAdmins,
    checkAdmin: checkAdminCredentials,
    insertToEvents: insertToEvents,
    insertToUsers: insertToUsers,
    insertToCertificates: insertToCertificates,
    topFiveUsers: topFiveUsers,
    sendCertificates: sendCertificates,
    sendBadges: sendBadges,
};