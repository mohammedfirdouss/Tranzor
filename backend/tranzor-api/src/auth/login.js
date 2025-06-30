// Lambda handler for POST /auth/login
const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider();
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID;

exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body || '{}');
    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Email and password required' }) };
    }
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    };
    try {
      const result = await cognito.initiateAuth(params).promise();
      const tokens = result.AuthenticationResult;
      return {
        statusCode: 200,
        body: JSON.stringify({
          idToken: tokens.IdToken,
          accessToken: tokens.AccessToken,
          refreshToken: tokens.RefreshToken,
          expiresIn: tokens.ExpiresIn,
          tokenType: tokens.TokenType
        })
      };
    } catch (err) {
      return { statusCode: 401, body: JSON.stringify({ message: err.message }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error' }) };
  }
};
