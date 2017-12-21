var http = require('http');
var url = require('url');
var path = require('path');
var mysql = require('mysql');
const express = require('express'); // for hosting
var fs = require('fs'); //file system
var helpers = require('express-helpers');

var app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/resources')));

//adding helpers
helpers(app);

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

app.get('/dogs/', function(req,res){
  var sql = "call GetDogs()";
  con.query(sql, function (err, dogList) {
    if (err) throw err;
    res.render('pages/dogs', {
      dogs: dogList[0]
    });
  });
});



//dog detail page
app.get('/dogs/:dogId', function(req, res) {
  var sql = "call GetDog(" + req.params.dogId + ")";

  con.query(sql, function (err, dogToShow) {
    if (err) throw err;
    var fileList = getFilesFromDirectory(dogToShow[0][0].name);
    res.render('pages/detail', {

      /*
       * Okay, this is weird.
       *
       * When calling a stored procedure, it returns a list two elements, the first being
       * a list of results and the second being an object with status on the sproc.
       *
       * So you have to take the first object returned and the first of the last list.
       *
       * (as I understand it)
       *
       * I'm just not sure why it doesn't do this when calling a single query, as done
       * elsewhere in this file. I can't find any documentation on this online, but I guess this works.
       */

      dog: dogToShow[0][0],
      files:fileList
    });
  });
});

app.listen(8080);

/*Given a dog name, finds the directory for that dog and returns
an arrat of all images related to that dog*/
function getFilesFromDirectory(dogName){
  var path = "./resources/images/" + dogName + "/";
  var files = [];

  fs.readdirSync(path).forEach(file => {
    files.push(file);
  })

  //Remove bio from list of images
  var index = files.indexOf("bio.txt");
  if (index > -1) {
    files.splice(index, 1);
  }

  return files;
}
