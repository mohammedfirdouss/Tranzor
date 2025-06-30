// Lambda handler for POST /auth/register
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
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
    // Check if user exists
    const existing = await dynamo.query({
      TableName: USERS_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email }
    }).promise();
    if (existing.Items && existing.Items.length > 0) {
      return { statusCode: 409, body: JSON.stringify({ message: 'User already exists' }) };
    }
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const createdAt = new Date().toISOString();
    await dynamo.put({
      TableName: USERS_TABLE,
      Item: { userId, email, passwordHash, createdAt }
    }).promise();
    // Generate JWT
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '1h' });
    return {
      statusCode: 201,
      body: JSON.stringify({ user: { userId, email, createdAt }, token })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error' }) };
  }
};
