const express = require("express");
const router = express.Router();
const Producto = require("../models/modelsProductos");

// 🟢 Obtener productos publicados (catálogo público)
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find({ publicado: true });
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos publicados", detalle: err.message });
  }
});

// 🔐 Obtener todos los productos (modo administrador)
router.get("/admin", async (req, res) => {
  try {
    const productos = await Producto.find(); // sin filtro
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos (admin)", detalle: err.message });
  }
});

// ➕ Crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (err) {
    res.status(400).json({ error: "Error al crear producto", detalle: err.message });
  }
});

// ✏️ Editar un producto existente
router.put("/:id", async (req, res) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar producto", detalle: err.message });
  }
});

// 🗑️ Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ error: "Error al eliminar producto", detalle: err.message });
  }
});

module.exports = router;
