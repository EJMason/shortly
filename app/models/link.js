const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

const uniqueValidator = require('mongoose-unique-validator');
const Promise = require('bluebird');
const crypto = require('crypto');

//------------------------------------------------
//             SCHEMA / MIDDLEWARE
//------------------------------------------------
var clicksSchema = new Schema({
  timestamp: Date
});

var linkSchema = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  clicks:[clicksSchema],
  timestamp: Date
});

//------------------------------------------------
//                    MODELS
//------------------------------------------------
var Link = mongoose.model('Link', linkSchema);

//------------------------------------------------
//                    HELPERS
//------------------------------------------------

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   clicks: function() {
//     return this.hasMany(Click);
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Link;
