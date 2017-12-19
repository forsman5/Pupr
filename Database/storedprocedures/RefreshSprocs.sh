#!/bin/sh
mysql -h "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com" -u "admin" "-ppassword" "petland" < "CreateTables.sql"
mysql -h "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com" -u "admin" "-ppassword" "petland" < "GetDog.sql"