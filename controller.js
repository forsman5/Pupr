var http = require('http');
var url = require('url');
var path = require('path');
var mysql = require('mysql');
const express = require('express'); // for hosting
var fs = require('fs'); //file system

var app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/resources')));

console.log("Server starting...");

//establish database connection
var con = mysql.createConnection({
  host: "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "password",
  database: "petland"
});

//homepage
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/about/', function(req, res) {
    res.render('pages/about');
});

app.get('/breeds/', function(req, res) {
  var sql = "SELECT * FROM Breeds";

  con.query(sql, function (err, breedList) {
    if (err) throw err;
    res.render('pages/breeds', {
      breeds: breedList
    });
  });
});

app.get('/dogs/', function(req,res){
  var sql = "SELECT * FROM Dogs";
  con.query(sql, function (err, dogList) {
    if (err) throw err;
    res.render('pages/dogs', {
      dogs: dogList
    });
  });
});

app.get('/dogs/show', function(req, res) {
  res.render('pages/show');
});
app.listen(8080);
