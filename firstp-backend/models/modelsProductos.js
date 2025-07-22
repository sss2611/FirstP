const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  imagen: String,      // Puede ser base64 o una URL
  publicado: Boolean   // Si el producto está visible en el catálogo
});

module.exports = mongoose.model("Producto", productoSchema);
