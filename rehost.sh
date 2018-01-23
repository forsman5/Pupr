#!/bin/sh
ssh -tti ../pupr.pem ubuntu@ec2-52-87-206-10.compute-1.amazonaws.com << 'ENDSSH'
pkill -f node
cd pupr/
git fetch --all
git reset --hard origin/master
rm -rf views
mv Views views
npm install
node controller.js &
sleep 5 #give time to let the server start up before exiting
exit
ENDSSH
