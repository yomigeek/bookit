var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '164.160.128.116',
  user     : 'testtest',
  password : 'xolatqowb1$',
  database : 'twiidooc_zoro'
});
connection.connect();

connection.query('SELECT * FROM users', function(err, rows, fields) 
{
  if (err) throw err;

  console.log(rows[0]);
});

connection.end();
