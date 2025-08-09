import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'its_Rolex_secrete';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  verifyToken
};
