#!/bin/sh

# Update test coverage reports on Code Climate.
# Start the server, run the unit tests, and then run this script.

mkdir -p .coverage
cd .coverage

wget -O coverage.zip localhost:3001/coverage/download
unzip -o -q coverage.zip

cd ..
# Replace absolute paths with relative paths.
sed "s/\/home\/travis\/build\/socrata\/odn-backend\///g" .coverage/lcov.info > lcov.info

node_modules/.bin/codeclimate-test-reporter < lcov.info

