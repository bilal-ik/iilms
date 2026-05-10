const { validationResult } = require('express-validator');

/**
 * handleValidationErrors — express-validator error handler middleware.
 * If the request has validation errors, responds with 422 and a structured
 * error list. Otherwise calls next() to continue the middleware chain.
 */
function handleValidationErrors(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.path ?? err.param,
      message: err.msg,
    }));

    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
}

module.exports = { handleValidationErrors };
