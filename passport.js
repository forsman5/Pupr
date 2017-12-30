var LocalStrategy   = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
var universal = require('./universal');

//to prevent magic numbers
const NUMBER_OF_SALTS = universal.NUMBER_OF_SALTS;

//function to generate MD5 hash
var MD5 = universal.MD5;

//establish database connection
var connection = universal.dbConnection;

//username and password strategy
var LocalStrategy = require('passport-local').Strategy;

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        //when signing up, key is refered to as id, when logging in key is refered to as userID
        if(user.id){
            done(null, user.id);
        } else {
            done(null, user.userID);
        }
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
  		connection.query("select * from Users where userID = "+id,
        function(err,rows){
          done(err, rows[0]);
    	});
    });

    // Signup with local strategy
    passport.use('local-signup', new LocalStrategy({
        //fields for signing up
        //nameField : 'name',
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },

    function(req, email, password, done) {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      var passFormat = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/)

      connection.query("select * from Users where email = '"+email+"'",function(err,rows){

			if (err)
        return done(err);

      if (rows.length) {
        return done(null, false, {message: "That email is already taken"});
      }
      //validate email with regex
      else if(!email.match(mailformat)){
        return done(null, false, {message: "Invalid email format"});
      } else if(!password.match(passFormat)){
        return done(null, false, {message: "Password must be at least 6 characters, contain a number, an uppercase character, and a lowercase character"});
      } else {
        // if there is no user with that email
        // create the user
        var name = req.body.name;
        var newUserMysql = new Object();
				newUserMysql.name = name;
				newUserMysql.email = email;

        bcrypt.hash(password, NUMBER_OF_SALTS, function( err, bcryptedPassword) {
           newUserMysql.password = bcryptedPassword;

           var insertQuery = "INSERT INTO Users (name, email, password, verifyHash) values ('"+ name +"','" + email +"','"+ bcryptedPassword +"', 'TEMPORARY')";

           connection.query(insertQuery, function(err,rows){
       			newUserMysql.id = rows.insertId;

            // this must be called after inserting the user, because calling this will update the users hash!
            //there must be a user to update the hash of
            universal.sendVerificationEmail(req, newUserMysql.email);

     				return done(null, newUserMysql);
   				});
        });
      }
		});
}));

// ******LOGIN CODE ******
passport.use('local-login',
  new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },

  function(req, email, password, done) { // callback with email and password from our form
    connection.query("SELECT * FROM `Users` WHERE `email` = '" + email + "'",
    function(err,rows){
  		if (err)
        return done(err);

      // user not found
      if (!rows.length) {
        return done(null, false, {message: "No account was found that matches that username and password."});
    }

      //un hash pword, compare to supplied password
      //password = user supplied password
      var hash = rows[0].password;
      bcrypt.compare(password, hash, function(err, doesMatch){
        if (doesMatch){
          // all is well, return successful user
          return done(null, rows[0]);
        }else{
          // create the loginMessage and save it to session as flashdata
          return done(null, false, {message: "No account was found that matches that username and password."});
        }
       });

  	});
  }));
};
