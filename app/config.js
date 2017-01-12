//database uses mlab.com
const mongoose = require('mongoose');
const keys = require('./../keys');

const uri = 'mongodb://' + keys.username + ':' + keys.password +'@ds159998.mlab.com:59998/shortly';
var options = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions:
    {
      keepAlive: 300000,
      connectTimeoutMS : 30000
    }
  }
};

mongoose.connect(uri, options);
var conn = mongoose.connection;

module.exports.connection = conn;

