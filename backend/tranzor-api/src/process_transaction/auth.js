const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function verifyJwt(event) {
  const authHeader = event.headers && (event.headers.Authorization || event.headers.authorization);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new Error('Unauthorized');
  }
}

module.exports = { verifyJwt };
