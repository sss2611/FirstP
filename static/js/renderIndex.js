const contenedor = document.querySelector(".productos");
const loader = document.getElementById("productos-loader");

async function renderProductos() {
  contenedor.innerHTML = "";
  loader.style.display = "block";

  try {
    const res = await fetch("https://firstp-api.onrender.com/api/products");
    const productos = await res.json();

    const productosPublicados = productos.filter(
      p => p.publicado === true || p.publicado === "true"
    );

    console.table(productosPublicados);

    productosPublicados.forEach((p) => {
      const inputId = `cantidad-${p._id}`;
      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
        <div class="card h-100">
          <img src="${p.imagen || '/static/img/productos/placeholder.jpg'}" 
               class="card-img-top" 
               alt="${p.nombre}">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title">${p.nombre}</h5>
              <p class="card-text">${p.descripcion}</p>
              <p class="card-text"><strong>Precio:</strong> $${p.precio}</p>
              <label for="${inputId}" class="form-label">Cantidad:</label>
              <input type="number" id="${inputId}" min="0" value="0" class="form-control" />
            </div>
            <button class="btn btn-success mt-3 agregar-carrito"
              data-id="producto-${p._id}"
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

    if (productosPublicados.length === 0) {
      contenedor.innerHTML = `<p class="text-center text-muted">No hay productos publicados disponibles.</p>`;
    }

  } catch (err) {
    console.error("Error al cargar productos:", err);
    contenedor.innerHTML = `<p class="text-danger text-center">No se pudieron cargar los productos.</p>`;
  } finally {
    loader.style.display = "none"; // 🧹 Ocultar el loader
  }
}

document.addEventListener("DOMContentLoaded", renderProductos);
