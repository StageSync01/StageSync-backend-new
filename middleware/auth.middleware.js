const jwt = require('jsonwebtoken');

// 🔥 Middleware de verificación de token JWT - VERSIÓN 2
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    console.log("🔍 [Auth] Verificando token...");
    console.log("🔐 [Auth] Headers authorization:", authHeader ? `✅ Presente` : "❌ Ausente");
    
    if (!authHeader) {
      console.error('❌ [Auth] Sin Authorization header');
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.error('❌ [Auth] Formato incorrecto (no es Bearer)');
      return res.status(401).json({ error: 'Invalid Authorization format' });
    }

    const token = authHeader.substring(7);
    console.log("🔑 [Auth] Token extraído:", token.substring(0, 20) + "...");
    
    if (!process.env.JWT_SECRET) {
      console.error('❌ [Auth] JWT_SECRET no está definido en .env');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("✅ [Auth] Token válido para:", decoded.email);
    
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    
    next();
  } catch (error) {
    console.error('❌ [Auth] Token verification failed:', error.message);
    console.error('❌ [Auth] Error type:', error.name);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid JWT token', details: error.message });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', details: error.message });
    }
    
    return res.status(401).json({ error: 'Token verification failed', details: error.message });
  }
};

module.exports = { verifyToken };