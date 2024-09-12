const User = require('../models/User');
async function getOrCreateUser({ azureId, googleId, githubId, name }) {
  try {
    let user = null;
    if (googleId) {
      user =
        (await User.findOne({ googleId })) ||
        (await new User({ googleId, name }).save());
    }
    if (azureId) {
      user =
        (await User.findOne({ azureId })) ||
        (await new User({ azureId, name }).save());
    }
    if (githubId) {
      user =
        (await User.findOne({ azureId })) ||
        (await new User({ azureId, name }).save());
    }
    return user;
  } catch (error) {
    throw Error(error.message);
  }
}

module.exports = { getOrCreateUser };
