// routes/productos.js
const express = require("express");
const router = express.Router();
const Producto = require("../models/modelsProductos");

// Ruta base: obtener todos los productos publicados
router.get("/", async (req, res) => {
  const productos = await Producto.find({ publicado: true });
  res.json(productos);
});

// Ruta temporal para insertar un producto de prueba
router.get("/insertar-demo", async (req, res) => {
  try {
    const productoDemo = new Producto({
      nombre: "Producto Demo",
      descripcion: "Este es un producto de prueba",
      precio: 999,
      imagen: "", // Podés usar una imagen base64 o dejarlo vacío
      publicado: true
    });

    await productoDemo.save();
    res.json({ mensaje: "✅ Producto demo insertado correctamente", producto: productoDemo });
  } catch (err) {
    res.status(500).json({ error: "❌ Error al insertar producto demo", detalle: err.message });
  }
});


module.exports = router;
