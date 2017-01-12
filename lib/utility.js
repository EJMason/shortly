var request = require('request');
const crypto = require('crypto');

exports.getUrlTitle = url => {
  return new Promise((resolve, reject) => {
    request(url, (err, res, html) => {
      if(err) {
        console.log('Error reading url heading: ', err);
        reject(err);
      } else {
        var tag = /<title>(.*)<\/title>/;
        var match = html.match(tag);
        var title = match ? match[1] : url;
        resolve(title);
      }
    });
  });
};

exports.shortenLink = url => {
  return new Promise((resolve,reject) => {
    let short = crypto.createHash('sha1');
    short.update(url);
    let code = short.digest('hex').slice(0, 5);
    resolve(code);
  });
};

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = url => {
  return url.match(rValidUrl);
};

/************************************************************/
// Add additional utility functions below
/************************************************************/


var isLoggedIn = req => {
  return req.session ? !!req.session.user : false;
};

exports.checkUser = (req, res, next) => {
  if (!isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
};

exports.createSession = (req, res, newUser) => {
  return req.session.regenerate(() => {
    console.log('new session created!');
      req.session.user = newUser;
      res.redirect('/');
    });
};
