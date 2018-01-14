#!/bin/sh
for file in *.sql; do
  mysql -h "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com" -u "admin" "-ppassword" "petland" < $file
done
