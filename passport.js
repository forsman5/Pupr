var LocalStrategy   = require('passport-local').Strategy;
var mysql = require('mysql');

//establish database connection
var connection = mysql.createConnection({
    host: "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "password",
    database: "petland"
  });

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
        }
        else{
            done(null, user.userID);
        }
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
		connection.query("select * from Users where userID = "+id,function(err,rows){	
            //console.log(id);
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
        connection.query("select * from Users where email = '"+email+"'",function(err,rows){
			//console.log(rows);
			//console.log("above row object");
			if (err)
                return done(err);
			 if (rows.length) {
                return done(null, false, {message: 'That email is already taken.'});
            } else {

				// if there is no user with that email
                // create the user
                var name = req.body.name;
                var newUserMysql = new Object();
				newUserMysql.name = name;
				newUserMysql.email = email;
                newUserMysql.password = password; // use the generateHash function in our user model
			
				var insertQuery = "INSERT INTO Users (name, email, password ) values ('"+ name +"','" + email +"','"+ password +"')";
			    //console.log(insertQuery);
				connection.query(insertQuery,function(err,rows){
				newUserMysql.id = rows.insertId;
				
				return done(null, newUserMysql);
				});	
            }	
		});   

       

    }));
    // ******LOGIN CODE ****** 
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

         connection.query("SELECT * FROM `Users` WHERE `email` = '" + email + "'",function(err,rows){
			if (err)
                return done(err);
			 if (!rows.length) {
                return done(null, false, {message: 'No user found with that email.'}); // no user found with that email
            } 
			
			// if the user is found but the password is wrong
            if (!( rows[0].password == password))
                return done(null, false, {message: 'Incorrect password.'}); // no user found with that password
            // all is well, return successful user
            return done(null, rows[0]);			
		
		});
		


    }));

};
