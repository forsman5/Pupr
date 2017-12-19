#!/bin/sh
pkill -f node
git fetch --all
git reset --hard origin/master
mv Views views
npm install
node controller.js &
