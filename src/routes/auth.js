const router = require('express').Router();
const passport = require('../config/passport');
const User = require('../models/User');

// Azure Auth
router.get(
  '/azure',
  passport.authenticate('azure_ad_oauth2', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);
router.get(
  '/azure/callback',
  passport.authenticate('azure_ad_oauth2', {
    prompt: 'select_account',
    failureRedirect: '/error',
  }),
  async (req, res) => {
    res.redirect(`${process.env.APP_URL}`);
  }
);

// GitHub Auth
router.get('/github', passport.authenticate('github', { scope: ['user'] }));
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/error',
  }),
  async (req, res) => {
    res.redirect(`${process.env.APP_URL}`);
  }
);

// Google Auth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile'],
    prompt: 'select_account',
  })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    scope: ['profile'],
    prompt: 'select_account',
    failureRedirect: '/error',
  }),
  async (req, res) => {
    res.redirect(`${process.env.APP_URL}`);
  }
);

router.get('/profile', async (req, res) => {
  console.log(req);
  if (req.isAuthenticated()) {
    res
      .status(200)
      .json({ status: 'success', message: 'Profile Info!', user: req.user });
  } else
    res.status(401).json({
      status: 'error',
      message: 'You Need To Be Logged In To Access Profile Info!',
    });
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error Logging Out: ', err);
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal Server Error' });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error('Error Destroying Session: ', err);
        return res
          .status(500)
          .json({ status: 'error', message: 'Internal Server Error' });
      }

      res
        .clearCookie('connect.sid')
        .status(200)
        .json({ status: 'success', message: 'Logged Out Successfully!' });
    });
  });
});
module.exports = router;
