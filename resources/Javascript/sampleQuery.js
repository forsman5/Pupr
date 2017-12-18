
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "password",
  database: "petland"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "SELECT * FROM Breeds";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});

