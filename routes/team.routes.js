const express = require("express");
const { verifyToken } = require("../middleware/auth.middleware");
const Team = require("../models/team");
const User = require("../models/user");
const cloudinary = require("../cloudinary");

const router = express.Router();

/* =========================
   CREATE TEAM - 🔥 CON JWT
========================= */

router.post("/create", verifyToken, async (req, res) => {
  try {
    console.log("🔥 [Team] Creando equipo...");
    console.log("📧 [Team] Email del usuario:", req.userEmail);
    console.log("👤 [Team] ID del usuario:", req.userId);
    
    const email = req.userEmail.toLowerCase();
    const userId = req.userId;

    // Verificar si ya tiene equipo
    const exists = await Team.findOne({ userEmail: email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Ya tienes un equipo" });
    }

    // Obtener datos del usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    let imageUrl = null;

    // 🔥 Subir imagen a Cloudinary si viene
    if (req.body.image && req.body.image.startsWith('data:')) {
      try {
        console.log("📸 [Team] Subiendo imagen a Cloudinary...");
        const upload = await cloudinary.uploader.upload(req.body.image, {
          folder: "teams",
          transformation: [{ width: 500, height: 500, crop: "fill" }]
        });
        imageUrl = upload.secure_url;
        console.log("✅ [Team] Imagen subida:", imageUrl);
      } catch (cloudError) {
        console.error('❌ [Team] Error subiendo imagen:', cloudError.message);
      }
    }

    // Crear equipo
    console.log("💾 [Team] Guardando equipo en BD...");
    const team = await Team.create({
      userEmail: email,
      name: req.body.name?.trim(),
      description: req.body.description || "",
      image: imageUrl,
      members: [
        {
          name: user.name,
          email,
          role: user.role || "Sin rol",
          isLeader: true
        }
      ]
    });

    // 🔥 Actualizar usuario con su equipo seleccionado
    await User.findByIdAndUpdate(userId, { selectedTeam: team._id });

    console.log(`✅ [Team] Equipo creado para ${email}`);
    res.json({ success: true, team });

  } catch (err) {
    console.error('❌ [Team] Error creando equipo:', err);
    res.status(500).json({ success: false, message: "Error creando equipo", error: err.message });
  }
});

/* =========================
   GET TEAM - 🔥 CON JWT
========================= */

router.get("/", verifyToken, async (req, res) => {
  try {
    const email = req.userEmail.toLowerCase();

    const team = await Team.findOne({
      $or: [
        { userEmail: email },
        { "members.email": email }
      ]
    });

    res.json({ team: team || null });
  } catch (err) {
    console.error('❌ Error obteniendo equipo:', err);
    res.status(500).json({ error: "Error servidor" });
  }
});

/* =========================
   UPDATE TEAM - 🔥 CON JWT
========================= */

router.put("/update", verifyToken, async (req, res) => {
  try {
    const email = req.userEmail.toLowerCase();

    let imageUrl = null;

    // 🔥 Subir imagen si viene
    if (req.body.image && req.body.image.startsWith('data:')) {
      try {
        const upload = await cloudinary.uploader.upload(req.body.image, {
          folder: "teams",
          transformation: [{ width: 500, height: 500, crop: "fill" }]
        });
        imageUrl = upload.secure_url;
      } catch (cloudError) {
        console.error('❌ Error subiendo imagen:', cloudError);
      }
    }

    const updateData = {
      name: req.body.name?.trim(),
      description: req.body.description || ""
    };

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const updated = await Team.findOneAndUpdate(
      { userEmail: email },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    console.log(`✅ Equipo actualizado para ${email}`);
    res.json({ message: "Equipo actualizado", team: updated });

  } catch (err) {
    console.error('❌ Error actualizando equipo:', err);
    res.status(500).json({ message: "Error servidor" });
  }
});

module.exports = router;