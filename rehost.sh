#!/bin/sh
ssh -tti ../challonge.pem ec2-user@ec2-18-216-242-170.us-east-2.compute.amazonaws.com << 'ENDSSH'
pkill -f node
cd petlandcatalog/
git fetch --all
git reset --hard origin/master
rm -rf views
mv Views views
npm install
node controller.js &
sleep 5 #give time to let the server start up before exiting
exit
ENDSSH
