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
var bcrypt = require('bcrypt');


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
  var isSignedIn = containsUser(req);
  if(isSignedIn){
    var user = req.user;
  }
  res.render('pages/index', {
    loggedIn:isSignedIn,user:user
  });
});

app.get('/about/', function(req, res) {
  var isSignedIn = containsUser(req);
  if(isSignedIn){
    var user = req.user;
  }

  res.render('pages/about', {
    loggedIn:isSignedIn, user:user
  });
});

app.get('/dogs/', function(req,res){
  var isSignedIn = containsUser(req);
  if(isSignedIn){
    var user = req.user;
  }

  var sql = "call GetDogs()";
  con.query(sql, function (err, dogList) {
    if (err) throw err;
    res.render('pages/dogs', {
      dogs: dogList[0],
      loggedIn:isSignedIn, user:user
    });
  });
});

//dog detail page
app.get('/dogs/:dogId', function(req, res) {
  var isSignedIn = containsUser(req);
  if(isSignedIn){
    var user = req.user;
  }

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
      files:fileList,
      loggedIn:isSignedIn, user:user
    });
  });
});
app.get('/account',function(req,res) {
  var isSignedIn = containsUser(req); 
  if(isSignedIn){
    var user = req.user;
  } 
  res.render('pages/account',{user:req.user, loggedIn:isSignedIn, user:user})
});

app.get('/update',function(req,res) {
  var isSignedIn = containsUser(req);    
  if(isSignedIn){
    var user = req.user;
  }
  res.render('pages/update',{loggedIn:isSignedIn, message:"", user:user})
});

app.post('/update', function(req, res){
  //read html form
  var user = req.user;
  var flashMessage = "";  
  var newName = req.body.name;
  var newEmail = req.body.email;
  //if user does not update name, then make it the same
  if(newName.length == 0){
    newName = req.user.name;
  }
  //if user does not update email, then make it the same
  if(newEmail == 0){
    newEmail = req.user.email;
  }  
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  //validate new email
  if(newEmail.match(mailformat)){
    //update email in current session
    req.user.email = newEmail;
    req.session.passport.user.name = newEmail;
    //update name in current session
    req.user.name = newName;
    req.session.passport.user.name = newName;
    //update database
    var sql = "UPDATE Users SET name = \"" +  newName + "\", email = \""  + newEmail + "\" WHERE userID = " + req.user.userID;   
    console.log(sql); 
    con.query(sql, function(err, results) {
      if (err)
        throw err;
      res.render('pages/account',{loggedIn:true, user:user});      
      
    });
  }
  else{
    flashMessage = "Invalid Email";
    res.render('pages/update', {message: flashMessage,loggedIn:true, user:user});
  }

});


app.get('/verify/:hash', function(req, res) {
  var isSignedIn = containsUser(req);
  if(isSignedIn){
    var user = req.user;
  }
  var updateSQL = "UPDATE Users SET verified = b'1' WHERE verifyHash = \"" + req.params.hash + "\"";

  //TODO ??
  //check if the record is already set to 1, if it is, let the user know theyre already
  //verified?

  con.query(updateSQL, function(err, results) {
    if (err)
      throw err;

    if (results.affectedRows == 1) {
      var getName = "SELECT name FROM Users WHERE verifyHash = \"" + req.params.hash + "\"";
      con.query(getName, function(err, nameRes) {
        if (err)
          throw err;

        console.log(nameRes);

        res.render('pages/verify', {
          loggedIn:isSignedIn,
          name:nameRes[0].name,
          success:true
        });
      })
    } else { // hash not found
      res.render('pages/verify', {
        loggedIn:isSignedIn,
        name:"",
        success: false
      });
    }
  });
});


app.get('/updatepass',function(req,res) {
  var isSignedIn = containsUser(req);    
  if(isSignedIn){
    var user = req.user;
  }
  res.render('pages/newpassword',{loggedIn:isSignedIn, message:"", user:user})
});

app.post('/updatepass', function(req, res){
  //read html form
  var user = req.user;
  var flashMessage = "";  
  var newPassword = req.body.password;
  //if user does not update name, then make it the same
  var passFormat = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/)  
  //validate new email
  if(newPassword.match(passFormat)){
    //update email in current session
    req.user.email = newEmail;
    req.session.passport.user.name = newEmail;
    //update name in current session
    req.user.name = newName;
    req.session.passport.user.name = newName;
    //update database
    var sql = "UPDATE Users SET name = \"" +  newName + "\", email = \""  + newEmail + "\" WHERE userID = " + req.user.userID;   
    console.log(sql); 
    con.query(sql, function(err, results) {
      if (err)
        throw err;
      res.render('pages/account',{loggedIn:true, user:user});      
      
    });
  }
  else{
    flashMessage = "Invalid Email";
    res.render('pages/update', {message: flashMessage,loggedIn:true, user:user});
  }

});


app.get('/verify/:hash', function(req, res) {
  var isSignedIn = containsUser(req);
  if(isSignedIn){
    var user = req.user;
  }
  var updateSQL = "UPDATE Users SET verified = b'1' WHERE verifyHash = \"" + req.params.hash + "\"";

  //TODO ??
  //check if the record is already set to 1, if it is, let the user know theyre already
  //verified?

  con.query(updateSQL, function(err, results) {
    if (err)
      throw err;

    if (results.affectedRows == 1) {
      var getName = "SELECT name FROM Users WHERE verifyHash = \"" + req.params.hash + "\"";
      con.query(getName, function(err, nameRes) {
        if (err)
          throw err;

        console.log(nameRes);

        res.render('pages/verify', {
          loggedIn:isSignedIn,
          name:nameRes[0].name,
          success:true
        });
      })
    } else { // hash not found
      res.render('pages/verify', {
        loggedIn:isSignedIn,
        name:"",
        success: false
      });
    }
  });
});



app.get('/login', function(req, res) {
  var isSignedIn = containsUser(req);
  if(isSignedIn){
    var user = req.user;
  }
  // render the page with flash data
  res.render('pages/login.ejs', {
    message: req.flash('error'),
    loggedIn:isSignedIn
  });
});

app.get('/signup', function(req, res) {
  var isSignedIn = containsUser(req);
  if(isSignedIn){
    var user = req.user;
  }
  // render the page with flash data
  res.render('pages/signup.ejs', {
    message: req.flash('error'),
    loggedIn:isSignedIn, user:user
  });
});

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/dogs/', // redirect to dogs section
  failureRedirect : '/signup', // redirect back to the signup page if there is an error
  failureFlash : true, // allow flash messages
  session: true
}));

 // process the login form
 app.post('/login', passport.authenticate('local-login', {
  successRedirect : '/dogs/', // redirect to dogs section
  failureRedirect : '/login', // redirect back to the signup page if there is an error
  failureFlash : true, // allow flash messages
  session: true

}));

//log user out
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
//This is intended for situations where the user attempts an operation that requires login
function validateLogin(req, res, next) {
  // If signed in, do nothing
  if (req.isAuthenticated()){
      return next();
  }
  // if not signed in, redirect to login page
  res.redirect('/login');
}

//checks if the given request contains a user in the headers
function containsUser(req) {
  var isSignedIn = false;

  if(req.user){
    isSignedIn = true;
  }

  return isSignedIn;
}
