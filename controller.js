var http = require('http');
var url = require('url');
var path = require('path');
var mysql = require('mysql');
const express = require('express'); // for hosting
var fs = require('fs'); //file system
var helpers = require('express-helpers');
var passport = require('passport');
var flash    = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

require('./passport')(passport); // pass passport for configuration
var app = express();

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'doggos' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

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

app.get('/login', function(req, res) {
  
  // render the page with flash data
  res.render('pages/login.ejs', { message: req.flash('loginMessage') }); 

});


app.get('/signup', function(req, res) {
  
  // render the page with flash data
  res.render('pages/signup.ejs', { message: req.flash('signupMessage') });
});

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/dogs/', // redirect to dogs section
  failureRedirect : '/signup', // redirect back to the signup page if there is an error
  failureFlash : true, // allow flash messages
  session: false
  
}));
 // process the login form
 app.post('/login', passport.authenticate('local-login', {
  successRedirect : '/dogs/', // redirect to dogs section
  failureRedirect : '/login', // redirect back to the signup page if there is an error
  failureFlash : true, // allow flash messages
  session: false
  
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
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
//Returns true if user signed in. If not, redirect to login page 
function isLoggedIn(req, res, next) {
  
      // If signed in, do nothing 
      if (req.isAuthenticated())
          return next();
  
      // if not signed in, redirect to login page
      res.redirect('/login');
  }