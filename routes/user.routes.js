const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// 🔥 Todas estas rutas requieren autenticación con token JWT

// GET perfil del usuario autenticado
router.get('/profile', verifyToken, userController.getProfile);

// PUT actualizar perfil completo
router.put('/profile', verifyToken, userController.updateProfile);

// PATCH actualizar solo settings
router.patch('/settings', verifyToken, userController.updateSettings);

// PATCH actualizar rol
router.patch('/role', verifyToken, userController.updateRole);

// PATCH actualizar equipo seleccionado
router.patch('/team', verifyToken, userController.updateSelectedTeam);

module.exports = router;
