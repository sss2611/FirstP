const express = require('express');
const router = express.Router();
const Producto = require('../models/modelsProductos');

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// Ruta para crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const nuevo = new Producto(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
