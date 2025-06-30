// Lambda handler for POST /auth/register
const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider();
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
  "Access-Control-Allow-Credentials": "true"
};

exports.handler = async (event) => {
  try {
    const { email, password, name } = JSON.parse(event.body || '{}');
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email and password required' }),
        headers: corsHeaders
      };
    }
    // Call Cognito signUp
    try {
      const userAttributes = [
        { Name: 'email', Value: email }
      ];
      
      // Add name if provided
      if (name) {
        userAttributes.push({ Name: 'name', Value: name });
      }
      
      const params = {
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: userAttributes
      };
      await cognito.signUp(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Registration successful. Please check your email for the confirmation code.' }),
        headers: corsHeaders
      };
    } catch (err) {
      if (err.code === 'UsernameExistsException') {
        return {
          statusCode: 409,
          body: JSON.stringify({ message: 'User already exists' }),
          headers: corsHeaders
        };
      }
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
