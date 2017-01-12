const mongoose = require('mongoose');

const uri = 'mongodb://ejmason:4808@ds159998.mlab.com:59998/shortly';
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

// var Link = mongoose.model('Link', linkSchema);

/*
------------------------------------------------
              Middleware
------------------------------------------------


/*
------------------------------------------------
              HELPERS
------------------------------------------------
*/


module.exports.connection = conn;

