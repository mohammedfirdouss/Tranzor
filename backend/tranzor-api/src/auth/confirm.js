// Lambda handler for POST /auth/confirm
const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider();
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
};

exports.handler = async (event) => {
  try {
    const { email, code } = JSON.parse(event.body || '{}');
    if (!email || !code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email and confirmation code required' }),
        headers: corsHeaders
      };
    }
    const params = {
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code
    };
    try {
      await cognito.confirmSignUp(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Account confirmed. You may now log in.' }),
        headers: corsHeaders
      };
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: err.message }),
        headers: corsHeaders
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
      headers: corsHeaders
    };
  }
};
