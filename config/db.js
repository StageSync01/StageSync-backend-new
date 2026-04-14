const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ Mongo conectado: ${conn.connection.host}`);

  } catch (error) {

    console.error("❌ Error conectando Mongo:", error);

    process.exit(1); // 🔥 detiene servidor si falla DB
  }
};

module.exports = connectDB;