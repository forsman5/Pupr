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

const NUMBER_OF_SALTS = 10;

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
var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};


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
  var user = "";
  if(isSignedIn){
    user = req.user;
  }
  var updateSQL = "UPDATE Users SET verified = b'1' WHERE verifyHash = \"" + req.params.hash + "\"";

  //TODO ??
  //check if the record is already set to 1, if it is, let the user know theyre already
  //verified?

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
  res.render('pages/newpassword',{loggedIn:isSignedIn, message:"", user:user})
});

app.post('/updatepass', function(req, res){
  //read html form
  var user = req.user;
  var flashMessage = "";
  var newPassword = req.body.password;
  var passFormat = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/)
  if(newPassword.match(passFormat)){
    bcrypt.hash(newPassword, NUMBER_OF_SALTS, function( err, bcryptedPassword) {

      var updateQuery = "UPDATE Users SET password = \"" +  bcryptedPassword + "\", WHERE userID = " + req.user.userID;

      con.query(updateQuery, function(err,rows){
        res.render('pages/account', {message: flashMessage,loggedIn:true, user:user});
      });
   });

  }
  else{
    flashMessage = "Password must be at least 6 characters, contain a number, an uppercase character, and a lowercase character";
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
