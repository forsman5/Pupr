#!/bin/sh
mysql -h "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com" -u "USERNAME" "-pPASSWORD" "petland" < "CreateTables.sql"