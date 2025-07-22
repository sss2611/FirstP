const contenedor = document.querySelector(".productos");
const productos = JSON.parse(localStorage.getItem("productosFirstp")) || [];

function renderProductos() {
  contenedor.innerHTML = "";

  productos
    .filter(p => p.publicado)
    .forEach((p) => {
      const inputId = `cantidad-${p.id}`;
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
              data-id="producto-${p.id}"
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

document.addEventListener("DOMContentLoaded", renderProductos);

