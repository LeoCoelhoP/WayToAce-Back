require('dotenv').config();
const passport = require('passport');
const { getOrCreateUser } = require('../controllers/User');
const AzureAdOAuth2Strategy = require('passport-azure-ad-oauth2');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

// Azure Strategy
passport.use(
  new AzureAdOAuth2Strategy(
    {
      clientID: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      callbackURL: 'https://waytoace-back.onrender.com/auth/azure/callback',
      tenantId: process.env.AZURE_TENANT_ID,
      scope: 'openid profile email',
    },
    async (accessToken, refreshToken, params, profile, done) => {
      const decodedProfile = jwt.decode(params.id_token, '', true) || profile;
      const user = await getOrCreateUser({
        azureId: decodedProfile.oid,
        name: decodedProfile.given_name,
      });
      return done(null, { profile: user });
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `https://waytoace-back.onrender.com/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await getOrCreateUser({
        githubId: profile.id,
        name: profile.username,
      });
      console.log(user);
      return done(null, { profile: user });
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `https://waytoace-back.onrender.com/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await getOrCreateUser({
        googleId: profile.id,
        name: profile.name.givenName,
      });
      return done(null, { profile: user });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.profile.id);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
