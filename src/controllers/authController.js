const authService = require('../services/authService');

function register(req, res, next) {
  try {
    const user = authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

function login(req, res, next) {
  try {
    const result = authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};
