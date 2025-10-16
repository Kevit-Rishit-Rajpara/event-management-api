const { ApiError } = require('../utils/errorHandler');

/**
 * @desc    Middleware to check if user has Admin role
 * @param   {Object} req - Express request object
 * @param   {Object} req.user - User object from auth middleware
 * @param   {string} req.user.role - User role
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @throws  {ApiError} 403 if user is not an admin
 */
const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    next(new ApiError(403, 'Forbidden: Admins only'));
  }
};

module.exports = { checkAdmin };
