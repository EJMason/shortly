var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var session = require('express-session');

var con = require('./app/config');
var user = require('./app/models/user');
var link = require('./app/models/link');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'shhh, it\'s a secret',
  resave: false,
  saveUninitialized: true
}));

//------------------------------------------------
//                    REST
//------------------------------------------------

app.post('/test', (req, res) => {
  var data = req.body;
  console.log(req.headers.origin)
  link.addLink(data.url, req.headers.origin);
  res.status(200).send('Link Created!');
});

app.get('/', util.checkUser, (req, res) => {
  res.render('index');
});

app.get('/create', util.checkUser, (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.get('/links', util.checkUser, (req, res) => {
  link.allLinks().then( links => {
    res.status(200).send(links);
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(404);
  });
});

app.post('/links', util.checkUser, (req, res) => {
  var uri = req.body.url;
  var base = req.headers.origin;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  link.addLink(uri, base);
  res.status(200).send('Link Created!');
});

/************************************************************/
// Write your authentication routes here
/************************************************************/

app.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  user.checkUser(username).then( exists => {
    if(exists) {
      user.authenticate(username, password).then(isCorrect => {
        if(isCorrect){
          util.createSession(req, res, username);
        } else {
          console.log('Username or Password incorrect.');
          res.redirect('/login');
        }
      });
    } else {
      console.log('Username or Password incorrect.');
      res.redirect('/login');
    }
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  user.checkUser(username).then(isTaken =>{
    if(isTaken) {
      console.log('Account already exists');
      res.redirect('/signup');
    } else {
      user.addUser(username, password);
      util.createSession(req, res, username);
    }
  });
});

/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', (req, res) => {
  link.clickLink(req.params[0])
  .then((obj) =>{
    return res.redirect(obj.url);
  });
  //res.status(200).send('THIS IS HERE!');

  // new Link({ code: req.params[0] }).fetch().then( link => {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     var click = new Click({
  //       linkId: link.get('id')
  //     });

  //     click.save().then(() => {
  //       link.set('visits', link.get('visits') + 1);
  //       link.save().then(() => {
  //         return res.redirect(link.get('url'));
  //       });
  //     });
  //   }
  // });
});

con.connection.once('open', () => {
  console.log('Shortly is listening on 4568');
  app.listen(4568);
})

