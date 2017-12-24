The database is hosted on Amazon's Relation Database Service (RDS).
To connect, ensure you have mysql installed on your machine and run the below prompt:
mysql -h petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com -P 3306 -u admin -p

To make sure all sprocs are up to date:
open a cmd prompt
navigate to your project folder/database/storedprocedures
on windows:
sh RefreshSprocs.sh

make sure you have the mysql connector installed before running any of the python scripts, or recreateDB:
pip install mysql-connector-python

When selecting from the users table, there is a bit value. Bits are not visible, so you have to do
SELECT CAST(verified as unsigned) ...
https://stackoverflow.com/questions/14248554/cant-see-mysql-bit-field-value-when-using-select
