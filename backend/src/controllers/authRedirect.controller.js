const { getRedirectPath } = require('../services/authRedirect.service');
const MSG = require('../constants/messages');

/**
 * Controller: Returns redirect path based on role
 * Route: GET /api/auth-redirect
 */
exports.authRedirect = async (req, res) => {
  try {
    const redirectPath = await getRedirectPath(req.user.userId);
    return res.status(200).json({ path: redirectPath }); // ✅ Return path as JSON
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('authRedirect error:', error);
    }
    res.status(error.message === MSG.USER_NOT_FOUND ? 404 : 500).json({
      message: error.message || MSG.REDIRECT_SERVER_ERROR,
    });
  }
};

