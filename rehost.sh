#!/bin/sh
pkill -f node
git pull
npm install
node controller.js