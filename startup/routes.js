const users = require('../routes/users');
const address = require('../routes/address');
const bodyParser = require("body-parser");

module.exports = function(app) {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use('/api/', users);
  app.use('/api/address', address);

}