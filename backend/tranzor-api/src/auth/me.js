// Lambda handler for GET /auth/me
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';
const JWKS_URI = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;

const client = jwksClient({
  jwksUri: JWKS_URI
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

exports.handler = async (event) => {
  try {
    const authHeader = event.headers && (event.headers.Authorization || event.headers.authorization);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Missing or invalid Authorization header' }), headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type,Authorization" } };
    }
    const token = authHeader.replace('Bearer ', '');
    let payload;
    try {
      payload = await new Promise((resolve, reject) => {
        jwt.verify(token, getKey, {
          algorithms: ['RS256'],
          issuer: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`
        }, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });
    } catch (e) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Invalid token' }), headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type,Authorization" } };
    }
    // Return user info from token
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
      },
      body: JSON.stringify({ user: payload })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error' }), headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type,Authorization" } };
  }
};
