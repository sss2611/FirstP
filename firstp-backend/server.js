// server.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productosRoutes = require("./routes/routesProductos");

const app = express();
app.use(cors());
app.use(express.json());

// 🌍 Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error de conexión:", err));

// 📦 Rutas
app.use("/api/productos", productosRoutes);

app.get("/", (req, res) => {
  res.send("🛠 API Firstp funcionando correctamente");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔌 Servidor corriendo en el puerto ${PORT}`));
