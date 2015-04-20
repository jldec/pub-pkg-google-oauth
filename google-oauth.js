/*
 * pub-pkg google-oauth.js
 *
 * pub-server plugin for google oauth
 *
 * uses https://github.com/jaredhanson/passport-google-oauth
 * - google credentials must live in environment variable GID and GCS
 * - url for loginPage is /server/login or in opts.auth.loginPage
 * - after login, redirect back to url in req.session.originalUrl
 *
 * copyright 2015, Jurgen Leschner - github.com/jldec - MIT license
 */

module.exports = function(server) {

  var opts  = server.opts;
  var generator = server.generator;

  opts.auth = opts.auth || {};
  opts.auth.google = opts.auth.google || {};

  var loginPage    = opts.auth.loginPage    || '/server/login'; // also in login.md

  var callbackPath = opts.auth.google.callbackPath || '/server/auth/google/callback';
  var redirectPath = opts.auth.google.redirectPath || '/server/auth/google/login';

  var passport = require('passport')
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

  if (!process.env.GID || !process.env.GCS){
    throw new Error('missing credentials for pub-pkg-google-oauth');
  }

  server.on('init-app-first', function() {

    var app = server.app;
    app.use(passport.initialize());
    app.use(passport.session());

    // we just care about the email for authentication
    passport.serializeUser(function(user, cb) {
      process.nextTick(function() { cb(null, user.emails[0].value); });
    });
    passport.deserializeUser(function(email, cb) {
      process.nextTick(function() { cb(null, email); });
    });

    passport.use(new GoogleStrategy(
    { clientID: process.env.GID,
      clientSecret: process.env.GCS,
      callbackURL: server.opts.appUrl + callbackPath }, // breaks on localhost
      function(accessToken, refreshToken, profile, cb) {
        return process.nextTick(function() { cb(null, profile); });
      }
    ));

    // slightly hacky way to serve loginPage if not using default login URL
    if (loginPage !== '/server/login') {
      app.get(loginPage, function(req, res) {
        generator.req = req;
        res.send(generator.renderDoc(generator.page$['/server/login']));
      });
    }

    app.get(redirectPath,
      passport.authenticate('google', {
        // scope used to be https://www.googleapis.com/auth/userinfo.email
        // before v0.2.x
        // see https://github.com/jaredhanson/passport-google-oauth/issues/72
        // also need to enable the Google+ API in the google dev console
        scope: ['email']
      })
    );

    app.get(callbackPath,
      passport.authenticate('google', { failureRedirect:loginPage }),
      function(req, res) { res.redirect(req.session.originalUrl || '/'); }
    );

    function login(req, res) {
      // to avoid redirecting css etc. remember originalUrls without extensions
      // there must be a better way to do that without server-side state
      if (!(/\.\w+(\?|$)/.test(req.originalUrl))) {
        req.session.originalUrl = req.originalUrl;
      }
      res.redirect(loginPage);
    }

    server.login = login;

  });

}