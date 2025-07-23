// 🌐 URL base del backend
const API_URL = "/api/productos";

// 📦 Contenedor donde se renderizan los productos
const contenedor = document.querySelector(".productos");

// 🔁 Carga productos publicados desde la API
async function cargarProductos() {
  try {
    const res = await fetch(API_URL);
    const productos = await res.json();
    renderProductos(productos);
  } catch (err) {
    console.error("❌ Error al cargar productos:", err);
    contenedor.innerHTML = `<p class="text-danger">No se pudieron cargar los productos.</p>`;
  }
}

// 🎨 Renderiza productos en el catálogo
function renderProductos(productos) {
  contenedor.innerHTML = "";

  productos.forEach((p) => {
    const inputId = `cantidad-${p._id}`;
    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
      <div class="card h-100">
        <img src="${p.imagen || '/static/img/productos/placeholder.jpg'}" class="card-img-top" alt="${p.nombre}">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 class="card-title">${p.nombre}</h5>
            <p class="card-text">${p.descripcion}</p>
            <p class="card-text"><strong>Precio:</strong> $${p.precio}</p>
            <label for="${inputId}" class="form-label">Cantidad:</label>
            <input type="number" id="${inputId}" min="0" value="0" class="form-control" />
          </div>
          <button class="btn btn-success mt-3 agregar-carrito"
            data-id="${p._id}"
            data-producto="${p.nombre}"
            data-precio="${p.precio}"
            data-input="${inputId}">
            Agregar al carrito
          </button>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

// 🚀 Inicializa el catálogo al cargar la página
document.addEventListener("DOMContentLoaded", cargarProductos);
