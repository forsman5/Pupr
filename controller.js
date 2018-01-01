var http = require('http');
var url = require('url');
var path = require('path');
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
var universal = require('./universal');

//function to generate MD5 hash
var MD5 = universal.MD5;

// port to host on
var PORT_NUM = universal.PORT_NUM;

//establish database connection
var con = universal.dbConnection;

//number of salts to salt a password with -- more is more secure, harder to crack and
//also slows down the process when logging in or out, as decrypting the password takes longer.
//THIS IS A GOOD THING!
//the longer it takes to decrypt a password, the fewer requests someone can make in a time period,
//thus the harder it is to brute force a password for the site
const NUMBER_OF_SALTS = universal.NUMBER_OF_SALTS;

require('./passport')(passport); // pass passport for configuration

//setting  up the server

var app = express();

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// specify we want to parse encoded urls and json
//app.use(bodyparser) is depreceiated
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// required for passport
app.use(session({ secret: 'doggos' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'ejs');

//point all requests for static resources to the resources folder automatically
app.use(express.static(path.join(__dirname, '/resources')));

//adding helpers
helpers(app);

//all the server routes are below

//homepage
app.get('/', function(req, res) {
  var isSignedIn = containsUser(req);
  if(isSignedIn){
    var user = req.user;
  }

  res.render('pages/index', {
    loggedIn:isSignedIn,
    user:user
  });
});

app.get('/about/', function(req, res) {
  var isSignedIn = containsUser(req);
  if(isSignedIn){
    var user = req.user;
  }

  res.render('pages/about', {
    loggedIn:isSignedIn,
    user:user
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
  var isSignedIn = containsUser(req)
  var heartSelected = false;
  if(isSignedIn){
    var user = req.user;
  }

  var sql = "call GetDog(" + req.params.dogId + ")";
  con.query(sql, function (err, dogToShow) {
    if (err) throw err;
    var fileList = getFilesFromDirectory(dogToShow[0][0].name);
    var getComments = "SELECT U.name, C.commentID, C.comment FROM Users_Dogs_comments C INNER JOIN Users U ON C.userID = U.userID WHERE C.dogID = " + req.params.dogId;
    con.query(getComments,function(err,commentsWithNames){
      if (err) throw err;
      if(isSignedIn){
          var getHeartColor = "SELECT * FROM Users_Dogs_favorites WHERE userID = " + req.user.userID + " AND dogID = " + req.params.dogId;
          con.query(getHeartColor,function(err,rows){
            if (err) throw err;
            if(rows.length > 0){
             heartSelected = true;
            }
            res.render('pages/detail', {
            dog: dogToShow[0][0],
            files:fileList,
            loggedIn:isSignedIn,
            user:user,
            selected: heartSelected,
            comments: commentsWithNames,
            dogID: req.params.dogId
          });
        });
      } else {
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
          loggedIn:isSignedIn,
          user:user,
          selected: heartSelected,
          comments:commentsWithNames,
          dogID: req.params.dogId
        });
      }
    });
  });
});

app.get('/account',function(req,res) {
  var isSignedIn = containsUser(req);
  if(isSignedIn){
    var user = req.user;
  }
  res.render('pages/account', {
    user:req.user,
    loggedIn:isSignedIn,
    user:user
  });
});

app.get('/deleted',function(req,res){
  var sql = "DELETE FROM Users WHERE userID = " + req.user.userID;
  con.query(sql, function(err, results) {
    if (err)
      throw err;
      req.logout();
      res.render('pages/deleted',{
        loggedIn: false,
      });

  });

});
app.get('/favorites',function(req,res){
  var isSignedIn = containsUser(req);
  if(isSignedIn){
    var user = req.user;
  }
  var sql ="SELECT * FROM Users_Dogs_favorites WHERE userID = " + req.user.userID;
  con.query(sql, function(err, results) {
    if (err)
      throw err;
      //get favorite dog ids
      var dogIds = results.map(function(element){
        return element.dogID;
      });
      var getFavs = "call GetDogs()";
      con.query(getFavs,function(err, dogs){
        if(err) throw err;
        //filter dogs so only favorites are included
        var favdogs = dogs[0].filter(function(element){
          return (dogIds.indexOf(element.dogID)) > -1;
        });
        res.render('pages/favorites', {user:req.user, loggedIn:isSignedIn,dogs:favdogs})
      })
  });
});

app.get('/update',function(req,res) {
  var isSignedIn = containsUser(req);
  if(isSignedIn){
    var user = req.user;
  }

  res.render('pages/update',{
    loggedIn:isSignedIn,
    message:"",
    user:user
  });
});

app.get('/resend',function(req,res) {
  var isSignedIn = containsUser(req);

  if(isSignedIn){
    var user = req.user;
  }

  universal.sendVerificationEmail(req, req.user.email);

  res.render('pages/resend',{
    loggedIn:isSignedIn,
    message:"",
    user:user
  })
});

app.post('/update', function(req, res){
  //read html form
  var user = req.user;
  var flashMessage = "";
  var newName = req.body.name;
  var newEmail = req.body.email;
  var password = req.body.password;

  bcrypt.compare(password, req.user.password, function(err, doesMatch){
    if (doesMatch){
       //if user does not update name, then make it the same
      if(newName.length != 0) {
        //update name in current session
        req.user.name = newName;
        req.session.passport.user.name = newName;

        var sql = "UPDATE Users SET name = \"" +  newName + "\" WHERE userID = " + req.user.userID;

        con.query(sql, function(err, results) {
          if (err)
            throw err;
        });
      }

      //if user does not update email, then make it the same
      if(newEmail != 0) {
        // check if this email already exists
        con.query("SELECT * FROM Users WHERE email = '" + newEmail + "'", function(err,rows){
          //if this email doesnt exist
          if (rows.length == 0) {
            //change the email
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            //validate new email
            if(newEmail.match(mailformat)){
              //update email in current session
              req.user.email = newEmail;
              req.session.passport.user.email = newEmail;
              req.user.verified = false;
              req.session.passport.user.verified = false;

              //update database
              //unverify the email
              var sql = "UPDATE Users SET email = \""  + newEmail + "\", verified = b'0' WHERE userID = " + req.user.userID;

              con.query(sql, function(err, results) {
                if (err)
                  throw err;

                universal.sendVerificationEmail(req, newEmail);
              });
            } else {
              flashMessage = "Invalid Email";
              res.render('pages/update', {
                message: flashMessage,
                loggedIn:true,
                user:user
              });
            }

            //execution finished successfully
            res.render('pages/account',{
              loggedIn:true,
              user:user
            });
          } else {
            //email taken
            flashMessage = "An account already exists with that email";
            res.render('pages/update', {
              message: flashMessage,
              loggedIn:true,
              user:user
            });
          }
        }); //end connection.query -- does this email exist
      }
    }else{
      flashMessage = "Incorrect Password";
      res.render('pages/update', {
        message: flashMessage,
        loggedIn:true,
        user:user
      });
    }
   });
});

app.get('/verify/:hash', function(req, res) {
  var isSignedIn = containsUser(req);
  var user = "";
  if(isSignedIn){
    user = req.user;
  }

  var updateSQL = "UPDATE Users SET verified = b'1' WHERE verifyHash = \"" + req.params.hash + "\"";

  con.query(updateSQL, function(err, results) {
    if (err)
      throw err;

    if (results.affectedRows == 1) {
      res.render('pages/verify', {
        loggedIn:isSignedIn,
        user:user,
        success:true
      });
    } else { // hash not found
      res.render('pages/verify', {
        loggedIn:isSignedIn,
        user:"",
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

  res.render('pages/newpassword',{
    loggedIn:isSignedIn,
    message:"",
    user:user
  });
});

app.post('/updatepass', function(req, res){
  //read html form
  var user = req.user;
  var flashMessage = "";
  var newPassword = req.body.password;
  var passFormat = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/);
  var oldPassword = req.body.oldPassword;

  bcrypt.compare(oldPassword, req.user.password, function(err, doesMatch){
    if (doesMatch){
      if(newPassword.match(passFormat)){
        bcrypt.hash(newPassword, NUMBER_OF_SALTS, function( err, bcryptedPassword) {
          var updateQuery = "UPDATE Users SET password = \"" +  bcryptedPassword + "\" WHERE userID = " + req.user.userID;

          con.query(updateQuery, function(err,rows){
            if (err)
            throw err;
            res.render('pages/account', {
              message: flashMessage,
              loggedIn:true,
              user:user
            });
          });
       });

     } else {
        flashMessage = "Invalid Password";
        res.render('pages/newpassword', {message: flashMessage,loggedIn:true, user:user});
      }

    }else{
      flashMessage = "Incorrect password";
      res.render('pages/newpassword', {message: flashMessage,loggedIn:true, user:user});
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
    loggedIn:isSignedIn,
    user:user
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

app.get('/unverified', function(req, res) {
  var isSignedIn = containsUser(req);
  if (isSignedIn) {
    var user = req.user;
  }

  console.log("succ");

  res.render('pages/notverified.ejs', {
    user: user,
    loggedIn: isSignedIn
  });

});

//must be signed in to get here, thus no if isSignedIn
app.post("/favoriteDog", function(req, res) {
  //check if the user is verified!
  if (req.user.verified) {
    //current state = action to take
    if (req.body.currentState == "favorite") {
      var insert = "INSERT INTO Users_Dogs_favorites (userID, dogID) values (" + req.user.userID + ", " + req.body.dog + ")"
      var updateCount = "UPDATE Dogs SET favorites = favorites + 1 WHERE dogID =" + req.body.dog;

      con.query(insert, function(err, res) {
        if (err)
          throw err;

        con.query(updateCount, function(err, innerRes) {
          if (err)
            throw err;
        });
      });
    } else { // currentState == unfavorite
      var remove = "DELETE FROM Users_Dogs_favorites WHERE userID = " + req.user.userID + " AND dogID = " + req.body.dog
      var updateCount = "UPDATE Dogs SET favorites = favorites - 1 WHERE dogID =" + req.body.dog;

      con.query(remove, function(err, res) {
        if (err)
          throw err;

        con.query(updateCount, function(err, innerRes) {
          if (err)
            throw err;
        });
      });
    }
  } else { // not verified
    //console.log('redirect');
    //res.redirect("/unverified");

    // this is now depreceiated, and is handled by client js
  }
});


app.post("/comment",function(req,res){
  var user = req.user;
  console.log("starting post")
  var commentText = req.body.commentBody;
  console.log("got body")
  var dogID = req.body.dogID
  console.log(dogID);
  var createComment = "INSERT INTO Users_Dogs_comments (userID, dogID, comment) VALUES (" + user.userID + ", " + dogID + ", '" + commentText + "')"
  con.query(createComment, function(err, results){
    if (err)
    throw err;
    console.log("query finished")

    res.redirect('/dogs/' + dogID);
  });
});

// initialize server
app.listen(PORT_NUM, function () {
  console.log('Server is running. Point your browser to: http://localhost:' + PORT_NUM);
});

// other methods below

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
