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
app.get('/test', (req, res) => {
  res.status(200).send(mongo.Links.find());
});

app.post('/test', (req, res) => {
  var data = req.body;

  user.addUser(data.username, data.password);
  res.status(200).send('User Created!');
});

app.get('/', util.checkUser, function(req, res) {
  res.render('index');
});

app.get('/create', util.checkUser, function(req, res) {
  res.render('index');
});

//--------------------> REFACTOR ALERT!!!!! ------------------>

app.get('/links', util.checkUser, function(req, res) {
  res.status(200).send(mongo.Links.find());
  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
});

//--------------------> REFACTOR ALERT!!!!! ------------------>
app.post('/links', util.checkUser, function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.status(200).send(found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }

        Links.create({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        })
        .then(function(newLink) {
          res.status(200).send(newLink);
        });
      });
    }
  });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/


app.get('/login', function(req, res) {
  res.render('login');
});

//--------------------> REFACTOR ALERT!!!!! ------------------>
app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  new User({ username: username })
    .fetch()
    .then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else {
        // BASIC VERSION
        // bcrypt.compare(password, user.get('password'), function(err, match) {
        //   if (match) {
        //     util.createSession(req, res, user);
        //   } else {
        //     res.redirect('/login');
        //   }
        // });
        // ADVANCED VERSION -- see user model
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      }
    });
});

app.get('/logout', function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

//--------------------> REFACTOR ALERT!!!!! ------------------>
app.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  user.checkUser(username).then((isTaken) =>{
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

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        linkId: link.get('id')
      });

      click.save().then(function() {
        link.set('visits', link.get('visits') + 1);
        link.save().then(function() {
          return res.redirect(link.get('url'));
        });
      });
    }
  });
});
//this is a comment!
console.log('Shortly is listening on 4568');
con.connection.once('open', () => {
   app.listen(4568);
})

