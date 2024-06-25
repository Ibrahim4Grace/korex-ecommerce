const jwt = require('jsonwebtoken');
const customEnv = require('../configs/customEnvVariables');

const generateToken = (user) => {
  const userAccessToken = jwt.sign(
    { id: user._id, userRole: user.userRole },
    customEnv.jwtSecret,
    { expiresIn: customEnv.userAccessTokenExpireTime }
  );

  const userRefreshToken = jwt.sign(
    { id: user._id, userRole: user.userRole },
    customEnv.jwtSecret,
    { expiresIn: customEnv.userRefreshTokenExpireTime }
  );

  return { userAccessToken, userRefreshToken };
};

const generateAndSetTokens = (res, user) => {
  const tokens = generateToken(user);

  res.cookie('userAccessToken', tokens.userAccessToken, {
    httpOnly: true,
    secure: customEnv.nodeEnv === 'production',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('userRefreshToken', tokens.userRefreshToken, {
    httpOnly: true,
    secure: customEnv.nodeEnv === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return tokens;
};

module.exports = generateAndSetTokens;
