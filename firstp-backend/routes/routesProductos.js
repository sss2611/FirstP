// routes/productos.js
const express = require("express");
const router = express.Router();
const Producto = require("../models/modelsProductos");

// Ruta base: obtener todos los productos publicados
router.get("/", async (req, res) => {
  const productos = await Producto.find({ publicado: true });
  res.json(productos);
});

module.exports = router;
