To connect to the amazon db:

With mysql installed, run this on your command prompt:
mysql -h petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com -P 3306 -u <USER> -p

To make sure all sprocs are up to date:
open a cmd prompt
navigate to your project folder
on windows:
sh RefreshSprocs.sh

(assuming you have filled the proper username and password in)

to run the python insert script:

in the folder it will be executed in, install the mysql connector using
pip install mysql-connector-python