require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productosRoutes = require("../routes/routesProductos");

const app = express();

// 🧩 Middlewares
app.use(cors());
app.use(express.json());

// 🌍 Conexión a MongoDB Atlas
async function conectarDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🚀 Conectado a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error de conexión:", err.message);
    process.exit(1); // Detiene el servidor si falla la conexión
  }
}
conectarDB();

// 📦 Rutas
app.use("/api/productos", productosRoutes);

// 🧪 Ruta de estado para verificar funcionamiento
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", mensaje: "API Firstp activa", fecha: new Date() });
});

// 🏁 Ruta base
app.get("/", (req, res) => {
  res.send("🛠 API Firstp funcionando correctamente");
});

// 🚀 Inicialización del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});
