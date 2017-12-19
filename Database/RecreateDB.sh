#!/bin/sh
. ./RefreshSprocs.sh
mysql -h "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com" -u "admin" "-ppassword" "petland" -e "call CreateTables();"

cd ./breed_backup/
python ./insertBreeds.py
cd ..

python ./get_dogs.py
