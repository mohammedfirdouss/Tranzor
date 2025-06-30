// Lambda handler for GET /auth/me
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const dynamo = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE_NAME;
const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = async (event) => {
  try {
    const authHeader = event.headers && (event.headers.Authorization || event.headers.authorization);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Missing or invalid Authorization header' }) };
    }
    const token = authHeader.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Invalid token' }) };
    }
    // Fetch user
    const result = await dynamo.get({
      TableName: USERS_TABLE,
      Key: { userId: payload.userId }
    }).promise();
    const user = result.Item;
    if (!user) {
      return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ user: { userId: user.userId, email: user.email, createdAt: user.createdAt } })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error' }) };
  }
};
