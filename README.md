# ODN Backend

Backend for the Open Data Network.

## Documentation

API documentation is available on [Apiary](http://docs.odn.apiary.io/).

## Development

The ODN backend is built using [Node.js](https://nodejs.org/).

After downloading node,

### Server

Run `npm install` and then `npm run server` to start the development
server at [localhost:3001](http://localhost:3001/).

### Tests

Unit tests are available in the `test` directory.
Run tests using `npm run test`.

### Logging

[Winston](https://github.com/winstonjs/winston) is used for logging.

Information about 500 errors is logged to the console and available
through the Heroku logs.
Logging info for client errors is dumped to debug.log.

### Deployment

The ODN backend is hosted on Heroku.
There are two environments:
[production](http://odn-backend.herokuapp.com/) and
[staging](http://odn-backend-staging.herokuapp.com/).

To deploy to an environment, push to the corresponding branch on github.
For production, push to `master` and for staging, push to `staging`.
There should be no need to manually deploy to Heroku,
but if you do, make sure that `master` stays in sync with what is
on Heroku.

Email `lane.aasen@socrata.com` for Heroku access.

#### Integration Tests

Integration tests are run to check each deployment using
[Travis CI](https://travis-ci.org/socrata/odn-backend).
These tests must pass for the deployment to succeed.

