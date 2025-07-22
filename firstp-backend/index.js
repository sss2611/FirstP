const productosRoutes = require('./routes/routesProductos');

// Cargar variables de entorno
require('dotenv').config();

// Importar dependencias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Inicializar la app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/productos', productosRoutes);


// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('✨ ¡Firstp backend corriendo!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});
