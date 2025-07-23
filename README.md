🧩 Firstp — Panel de Productos con Dashboard y Catálogo
Firstp es una aplicación web fullstack que permite administrar y visualizar productos mediante un panel dinámico y un catálogo público. Combina un backend Express con MongoDB Atlas y un frontend interactivo desplegado en Vercel.

🚀 Características
Panel de administración con edición, publicación y eliminación de productos.

Carga de imágenes en base64.

Catálogo público con selector de cantidad y botón de carrito.

Backend con rutas RESTful (GET, POST, PUT, DELETE).

Deploy completo en Vercel con rutas integradas.

📦 Instalación local
1. Clonar el repositorio
bash
git clone https://github.com/sss2611/firstp.git
cd firstp
2. Instalar dependencias del backend
bash
npm install
3. Crear archivo .env en la raíz
env
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/test
PORT=3000
Asegurate de que .env esté en .gitignore para no subirlo al repositorio.

🧪 Ejecutar en desarrollo
bash
node server.js
El backend corre en http://localhost:3000

El frontend puede abrirse directamente desde src/index.html o src/dashboard.html

🌐 Estructura del proyecto
firstp/
├── api/                  # Opcional si usás funciones serverless
├── models/               # Modelos de MongoDB
├── routes/               # Rutas Express
├── static/               # CSS, JS, imágenes
├── src/                  # HTMLs
├── server.js             # Backend principal
├── .env                  # Variables de entorno
├── vercel.json           # Configuración de deploy

🚀 Deploy en Vercel
Subí el proyecto a GitHub.

Iniciá sesión en vercel.com y conectá el repo.

Vercel detectará server.js como backend y /src/index.html como frontend.

Configurá las variables de entorno (MONGO_URI) desde el panel de Vercel.

🔐 Rutas disponibles
Método	Ruta	Descripción
GET	/api/productos	Productos publicados (catálogo)
GET	/api/productos/admin	Todos los productos (dashboard)
POST	/api/productos	Crear nuevo producto
PUT	/api/productos/:id	Editar producto
DELETE	/api/productos/:id	Eliminar producto

💡 Créditos
Desarrollado por Sandra, con foco en diseño ético, UI dinámica y backend escalable. Este proyecto refleja mi pasión por la estética funcional y la tecnología responsable.