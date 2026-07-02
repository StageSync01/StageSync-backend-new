const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("☁️ [Cloudinary] Configuración cargada:");
console.log("☁️ [Cloudinary] CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅" : "❌");
console.log("☁️ [Cloudinary] API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅" : "❌");
console.log("☁️ [Cloudinary] API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅" : "❌");

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ [Cloudinary] FALTAN CREDENCIALES EN EL .env");
}

module.exports = cloudinary;