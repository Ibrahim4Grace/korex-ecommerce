const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Google, User } = require('../models');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const config = require('../configs/customEnvVariables');

// Configure the Google strategy for Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_REDIRECTURL,
      passReqToCallback: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // Create a new user if not found
          user = new Google({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            // Add other fields if necessary
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session using async/await
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
