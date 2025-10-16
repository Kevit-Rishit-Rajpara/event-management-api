const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/errorHandler');
const { isBlacklisted } = require('../utils/tokenBlacklist');

/**
 * @desc    Authentication middleware to verify JWT token
 * @param   {Object} req - Express request object
 * @param   {Object} req.headers - Request headers
 * @param   {string} req.headers.authorization - Bearer token
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @throws  {ApiError} 401 if token is missing, invalid, expired, or blacklisted
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.substring(7);

    if (isBlacklisted(token)) {
      throw new ApiError(401, 'Token has been invalidated. Please login again');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired'));
    }
    next(error);
  }
};

module.exports = authMiddleware;
