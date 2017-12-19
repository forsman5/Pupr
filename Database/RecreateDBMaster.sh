#!/bin/sh
source RefreshSprocs.sh
mysql -h "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com" -u "USERNAME" "-pPASSWORD" "petland" -e "call CreateTables();"

python /breed_backup/insertBreeds.py
python get_dogs.py