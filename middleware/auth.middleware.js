module.exports = function authMiddleware(req, res, next) {

  if (!req.user) {
    return res.status(401).json({
      error: "No autorizado"
    });
  }

  next();
};