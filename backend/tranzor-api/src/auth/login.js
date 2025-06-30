// Lambda handler for POST /auth/login
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dynamo = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE_NAME;
const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body || '{}');
    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Email and password required' }) };
    }
    // Lookup user
    const result = await dynamo.query({
      TableName: USERS_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email }
    }).promise();
    const user = result.Items && result.Items[0];
    if (!user) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Invalid credentials' }) };
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Invalid credentials' }) };
    }
    // Generate JWT
    const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return {
      statusCode: 200,
      body: JSON.stringify({ user: { userId: user.userId, email: user.email, createdAt: user.createdAt }, token })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error' }) };
  }
};
