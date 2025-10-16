const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ApiError, asyncHandler } = require('../utils/errorHandler');
const { addToBlacklist } = require('../utils/tokenBlacklist');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} req.body - Request body
 * @param   {string} req.body.username - Username (required)
 * @param   {string} req.body.password - Password (required)
 * @param   {string} req.body.role - User role (optional, default: 'User')
 * @param   {Object} res - Express response object
 * @returns {Object} Success message and user ID
 */
exports.register = asyncHandler(async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    throw new ApiError(400, 'Username and password are required');
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new ApiError(400, 'Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword,
    role: role || 'User'
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    userId: user._id
  });
});

/**
 * @desc    Login user and get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} req.body - Request body
 * @param   {string} req.body.username - Username (required)
 * @param   {string} req.body.password - Password (required)
 * @param   {Object} res - Express response object
 * @returns {Object} JWT token, user role and user ID
 */
exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, 'Username and password are required');
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });

  res.status(200).json({
    success: true,
    token,
    role: user.role,
    userId: user._id
  });
});

/**
 * @desc    Logout user by blacklisting token
 * @route   POST /api/auth/logout
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} req.headers - Request headers
 * @param   {string} req.headers.authorization - Bearer token
 * @param   {Object} res - Express response object
 * @returns {Object} Success message
 */
exports.logout = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    addToBlacklist(token);
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});
