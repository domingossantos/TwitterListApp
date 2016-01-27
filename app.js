var express = require('express');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;

var CONSUMERKEY = 'lEqMoFFjCsNrf4ijn6YxVd78L'
var CONSUMERSECRET = 'MH6ppH7dsaprXs36huaDURlOfBKENOdOWzs97ybrpULa2BXyFl';
var ACCESSTOKEN = '25549507-yO9ApndK1zQrZKfkxArCbPVhxKbdeCGxkjpqJESE2';
var ACCESSTOKENSECRET = 'h8B0r3dLIk9gXOelVx6ahtCFzE0o2JixF2NSqEh1Kw6SH';

var Twitter = require('twitter');

var clientTW = new Twitter({
    consumer_key: CONSUMERKEY,
    consumer_secret: CONSUMERSECRET,
    access_token_key: ACCESSTOKEN,
    access_token_secret: ACCESSTOKENSECRET
});


    passport.use(new Strategy({
      consumerKey: CONSUMERKEY,
      consumerSecret: CONSUMERSECRET,
      callbackURL: 'http://127.0.0.1:3000/login/twitter/return'
    },
    function(token, tokenSecret, profile, cb) {
      return cb(null, profile);
    }));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
app.use(clientTW);

// Define routes.
app.get('/',
    function(req, res) {
      res.render('home', { user: req.user });
    });

app.get('/login',
    function(req, res){
      res.render('login');
    });

app.get('/login/twitter',
    passport.authenticate('twitter'));

app.get('/login/twitter/return',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      res.render('profile', { user: req.user });
    });


app.get('/list',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
        res.render('profile', { user: req.user });
    });

app.get('/list/twittes',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
        res.render('profile', {user:req.user, listTwitte: req.})
    });

app.get('/list');


app.listen(3000,function(){
    console.log('Começou da 3000');
});