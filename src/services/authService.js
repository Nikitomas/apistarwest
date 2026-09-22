const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const ApiError = require('../utils/ApiError');

function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new ApiError(400, 'name, email and password are required');
  }

  if (userModel.findByEmail(email)) {
    throw new ApiError(409, 'A user with this email already exists');
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = userModel.create({ name, email, passwordHash });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function login({ email, password }) {
  if (!email || !password) {
    throw new ApiError(400, 'email and password are required');
  }

  const user = userModel.findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });

  return { token };
}

module.exports = {
  register,
  login,
};
