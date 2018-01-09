#!/bin/sh
mysql -h "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com" -u "admin" "-ppassword" "petland" < "CreateTables.sql"
mysql -h "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com" -u "admin" "-ppassword" "petland" < "GetDog.sql"
mysql -h "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com" -u "admin" "-ppassword" "petland" < "GetDogs.sql"
mysql -h "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com" -u "admin" "-ppassword" "petland" < "GetSubmittedDogs.sql"
