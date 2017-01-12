const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
const uniqueValidator = require('mongoose-unique-validator');
const Promise = require('bluebird');

const util = require('./../../lib/utility');


//------------------------------------------------
//             SCHEMA / MIDDLEWARE
//------------------------------------------------
var clicksSchema = new Schema({
  timestamp: Date
});

var linkSchema = new Schema({
  url: String,            //'http://roflzoo.com/'
  baseUrl: String,        //'http://127.0.0.1:4568'
  code: String,            // 54637
  title: String,          //url title
  visits: {
    type: Number,
    default: 0
  },
  clicks:[clicksSchema],
  timestamp: Date
});

linkSchema.pre('save', function(next) {
  var link = this;
  util.getUrlTitle(link.url)
  .then(title => {
    link.title = title;
    return util.shortenLink(link.url);
  }).then(code => {
    link.code = code;
    next();
  }).catch(err => {
    console.log(err);
  });
});

//------------------------------------------------
//                    MODELS
//------------------------------------------------
var Link = mongoose.model('Link', linkSchema);

//------------------------------------------------
//                    HELPERS
//------------------------------------------------
const addLink = (uri, basePath) => {
  console.log('THIS IS THE FUCKING BASE:  ' + basePath);
  let newLink = new Link({url: uri, baseUrl: basePath});
  newLink.save()
  .then((link) => {
    console.log('\nLink created!');
    console.log('URL: ' + link.url);
    console.log('Base: ' + link.baseUrl);
  })
  .catch((err) => {
    console.log(err);
  });
};

const allLinks = () => {
  return new Promise((resolve, reject) => {
    Links
    .find({})
    .sort('-title')
    .exec(resolve(allLinks));
  });
};

module.exports.addLink = addLink;
