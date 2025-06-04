// Middleware to handle strategy logic for github
// Handles how to authenticate and remember user info

// Import github OAuth strategy to handle session logic
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');

passport.serializeUser((user, done) => {
  // Stores user info like cookies
  done(null, user); 
});

passport.deserializeUser((obj, done) => {
  // Looks up user for github related requsts
  done(null, obj);
});

passport.use(new GitHubStrategy({
    // ID and secret from OAuth app
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // Change when deployed
    callbackURL: "http://localhost:5001/auth/github/callback"
  },

  // Profile has user info we can use for DB
  // Otherwise just take access token from profile
  function(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    return done(null, profile);
  }
));