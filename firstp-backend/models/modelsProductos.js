const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: String,
  cantidad: Number,
  precioUnitario: Number,
  imagenBase64: String
});

module.exports = mongoose.model('Producto', productoSchema);
