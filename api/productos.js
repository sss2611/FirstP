// api/productos.js
const mongoose = require("mongoose");
const Producto = require("../models/modelsProductos");

module.exports = async (req, res) => {
  await mongoose.connect(process.env.MONGO_URI);

  if (req.method === "GET" && req.url === "/admin") {
    const productos = await Producto.find();
    return res.json(productos);
  }

  if (req.method === "GET") {
    const productosPublicos = await Producto.find({ publicado: true });
    return res.json(productosPublicos);
  }

  res.status(404).json({ error: "Ruta no encontrada" });
};
