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
    console.log("📋 [Team] Body recibido:", {
      name: req.body.name,
      description: req.body.description,
      hasImage: !!req.body.image,
      imageLength: req.body.image?.length || 0,
      imageType: typeof req.body.image
    });

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
    console.log("🔍 [UPLOAD] Verificando si hay imagen...");
    console.log("🔍 [UPLOAD] req.body.image existe:", !!req.body.image);
    console.log("🔍 [UPLOAD] Tipo de image:", typeof req.body.image);
    console.log("🔍 [UPLOAD] Tamaño de image:", req.body.image?.length || 0);

    if (req.body.image) {
      console.log("📸 [UPLOAD] Imagen recibida, primeros 50 chars:", req.body.image.substring(0, 50));

      if (req.body.image.startsWith("data:")) {
        try {
          console.log("☁️ [UPLOAD] Iniciando upload a Cloudinary...");
          console.log("☁️ [UPLOAD] CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ SET" : "❌ MISSING");
          console.log("☁️ [UPLOAD] CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ SET" : "❌ MISSING");
          console.log("☁️ [UPLOAD] CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ SET" : "❌ MISSING");

          console.log("☁️ [UPLOAD] Tamaño del base64 a subir:", req.body.image.length, "bytes");

          const uploadOptions = {
            folder: "teams",
            resource_type: "auto",
            transformation: [
              { width: 500, height: 500, crop: "fill" }
            ]
          };

          console.log("☁️ [UPLOAD] Opciones de upload:", JSON.stringify(uploadOptions));

          const upload = await cloudinary.uploader.upload(req.body.image, uploadOptions);

          console.log("☁️ [UPLOAD] Response de Cloudinary:", {
            public_id: upload.public_id,
            secure_url: upload.secure_url,
            url: upload.url,
            width: upload.width,
            height: upload.height,
            format: upload.format
          });

          imageUrl = upload.secure_url;

          console.log("✅ [UPLOAD] Imagen subida correctamente!");
          console.log("✅ [UPLOAD] URL guardada:", imageUrl);

        } catch (cloudError) {
          console.error("❌ [UPLOAD] ERROR EN CLOUDINARY:");
          console.error("❌ [UPLOAD] Tipo de error:", cloudError.constructor.name);
          console.error("❌ [UPLOAD] Mensaje:", cloudError.message);
          console.error("❌ [UPLOAD] Status HTTP:", cloudError.http_code);
          console.error("❌ [UPLOAD] Status Code:", cloudError.status);
          
          // Mostrar más detalles
          if (cloudError.error) {
            console.error("❌ [UPLOAD] Error object:", cloudError.error);
          }
          
          if (cloudError.response) {
            console.error("❌ [UPLOAD] Response status:", cloudError.response.status);
            console.error("❌ [UPLOAD] Response body:", cloudError.response.body);
          }

          console.error("❌ [UPLOAD] Stack trace:");
          console.error(cloudError.stack);

          // Log de error completo
          console.error("❌ [UPLOAD] JSON.stringify de error:");
          console.error(JSON.stringify(cloudError, Object.getOwnPropertyNames(cloudError), 2));

          // Intentar usar una URL placeholder si Cloudinary falla
          console.warn("⚠️ [UPLOAD] Cloudinary falló, usando placeholder");
          imageUrl = null; // Dejar null para que no cause problemas después
        }
      } else {
        console.log("⚠️ [UPLOAD] Imagen no comienza con 'data:' - formato inválido");
        console.log("⚠️ [UPLOAD] Primeros 50 caracteres:", req.body.image.substring(0, 50));
      }
    } else {
      console.log("⚠️ [UPLOAD] ❌ NO SE RECIBIÓ IMAGEN en req.body.image");
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
      selectedTeam: team._id,
      lastUpdated: new Date()
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

/* =========================
   TEST CLOUDINARY
========================= */

router.post("/test-upload", verifyToken, async (req, res) => {
  try {
    console.log("🧪 [TEST] Iniciando test de upload a Cloudinary...");

    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: "Se requiere imageBase64"
      });
    }

    console.log("🧪 [TEST] Tamaño del base64:", imageBase64.length);

    try {
      const upload = await cloudinary.uploader.upload(imageBase64, {
        folder: "teams-test",
        resource_type: "auto"
      });

      console.log("✅ [TEST] Upload exitoso!");
      console.log("✅ [TEST] URL:", upload.secure_url);

      res.json({
        success: true,
        url: upload.secure_url,
        public_id: upload.public_id,
        message: "Upload exitoso"
      });
    } catch (cloudError) {
      console.error("❌ [TEST] Error en Cloudinary:");
      console.error("❌ [TEST] Mensaje:", cloudError.message);
      console.error("❌ [TEST] HTTP Code:", cloudError.http_code);

      res.status(500).json({
        success: false,
        error: cloudError.message,
        http_code: cloudError.http_code,
        message: "Error en Cloudinary"
      });
    }
  } catch (err) {
    console.error("❌ [TEST] Error general:", err);
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Error en test"
    });
  }
});

module.exports = router;