const express = require("express");
const { verifyToken } = require("../middleware/auth.middleware");
const Team = require("../models/team");
const User = require("../models/user");
const cloudinary = require("../cloudinary");

const router = express.Router();

/* =========================
   CREATE TEAM - JWT + CLOUDINARY FIX
========================= */

router.post("/create", verifyToken, async (req, res) => {
  try {
    console.log("🔥 [Team] Creando equipo...");
    console.log("📧 Email:", req.userEmail);
    console.log("👤 UserID:", req.userId);

    const email = req.userEmail.toLowerCase();
    const userId = req.userId;

    // verificar si ya tiene equipo
    const exists = await Team.findOne({ userEmail: email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Ya tienes un equipo"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    let imageUrl = null;

    // =========================
    // 🔥 UPLOAD CLOUDINARY FIX
    // =========================
    if (req.body.image) {
      console.log("📸 Imagen recibida (preview):", req.body.image.substring(0, 50));

      if (req.body.image.startsWith("data:")) {
        try {
          console.log("☁️ Subiendo imagen a Cloudinary...");

          const upload = await cloudinary.uploader.upload(req.body.image, {
            folder: "teams",
            resource_type: "auto",
            transformation: [
              { width: 500, height: 500, crop: "fill" }
            ]
          });

          imageUrl = upload.secure_url;

          console.log("✅ Imagen subida correctamente:", imageUrl);

        } catch (cloudError) {
          console.error("❌ CLOUDINARY ERROR COMPLETO:");
          console.error("Error:", cloudError.message);
          console.error("Status:", cloudError.status);
          console.error("Stack:", cloudError.stack);
        }
      } else {
        console.log("⚠️ Imagen no es base64 válida");
      }
    } else {
      console.log("⚠️ No se recibió imagen");
    }

    // =========================
    // CREATE TEAM
    // =========================
    console.log("💾 Guardando equipo...");

    const team = await Team.create({
      userEmail: email,
      name: req.body.name?.trim(),
      description: req.body.description || "",
      image: imageUrl, // 👈 aquí ya es seguro
      members: [
        {
          name: user.name,
          email,
          role: user.role || "Sin rol",
          isLeader: true
        }
      ]
    });

    await User.findByIdAndUpdate(userId, {
      selectedTeam: team._id
    });

    console.log("✅ Equipo creado correctamente:", email);

    res.json({
      success: true,
      team
    });

  } catch (err) {
    console.error("❌ ERROR CREANDO TEAM:", err);
    res.status(500).json({
      success: false,
      message: "Error creando equipo",
      error: err.message
    });
  }
});

/* =========================
   GET TEAM
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
    console.error("❌ Error obteniendo equipo:", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

/* =========================
   UPDATE TEAM
========================= */

router.put("/update", verifyToken, async (req, res) => {
  try {
    const email = req.userEmail.toLowerCase();

    let imageUrl = null;

    if (req.body.image && req.body.image.startsWith("data:")) {
      try {
        const upload = await cloudinary.uploader.upload(req.body.image, {
          folder: "teams",
          transformation: [
            { width: 500, height: 500, crop: "fill" }
          ]
        });

        imageUrl = upload.secure_url;

      } catch (cloudError) {
        console.error("❌ CLOUDINARY UPDATE ERROR:", cloudError);
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
      return res.status(404).json({
        message: "Equipo no encontrado"
      });
    }

    res.json({
      message: "Equipo actualizado",
      team: updated
    });

  } catch (err) {
    console.error("❌ Error actualizando equipo:", err);
    res.status(500).json({
      message: "Error servidor"
    });
  }
});

module.exports = router;