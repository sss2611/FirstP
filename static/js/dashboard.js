const contenedor = document.getElementById("contenedor-productos");
let productos = JSON.parse(localStorage.getItem("productos")) || [];

// 🎨 Renderiza cards en el dashboard
function renderDashboard() {
  contenedor.innerHTML = "";

  productos.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "col-md-4";
    card.innerHTML = `
      <div class="card shadow h-100">
        <img src="${p.imagen || 'placeholder.jpg'}" class="card-img-top" alt="${p.nombre}" />
        <div class="card-body">
          <h5 class="card-title">${p.nombre}</h5>
          <p class="card-text">${p.descripcion}</p>
          <p><strong>Precio:</strong> $${p.precio}</p>
          <p><strong>Publicado:</strong> ${p.publicado ? "✅" : "❌"}</p>
          <button class="btn btn-primary editar" data-index="${index}">Editar</button>
          <button class="btn btn-danger eliminar" data-index="${index}">Eliminar</button>
          <button class="btn btn-secondary publicar" data-index="${index}">
            ${p.publicado ? "Ocultar" : "Publicar"}
          </button>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

// ➕ Crea el botón para agregar productos
function crearBotonAgregar() {
  const btn = document.createElement("button");
  btn.id = "btn-agregar";
  btn.textContent = "➕ Agregar producto";
  btn.className = "btn btn-success";
  document.getElementById("boton-agregar").appendChild(btn);
}

// 🧠 Manejador general de eventos
document.addEventListener("click", async (e) => {
  const index = e.target.dataset.index;
  const producto = productos[index];

  // ✏️ Editar producto
  if (e.target.classList.contains("editar")) {
    Swal.fire({
      title: "Editar producto",
      html: `
        <input id="edit-nombre" class="swal2-input" value="${producto.nombre}" />
        <input id="edit-desc" class="swal2-input" value="${producto.descripcion}" />
        <input id="edit-precio" class="swal2-input" type="number" value="${producto.precio}" />
        <input id="edit-imagen" class="swal2-file" type="file" accept="image/*" />
      `,
      confirmButtonText: "Guardar",
      focusConfirm: false,
      preConfirm: () => {
        const nombre = document.getElementById("edit-nombre").value;
        const descripcion = document.getElementById("edit-desc").value;
        const precio = parseFloat(document.getElementById("edit-precio").value);
        const archivo = document.getElementById("edit-imagen").files[0];

        if (!nombre || !descripcion || isNaN(precio)) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        if (archivo) {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({ nombre, descripcion, precio, imagen: reader.result });
            };
            reader.readAsDataURL(archivo);
          });
        }

        return { nombre, descripcion, precio };
      }
    }).then((r) => {
      if (r.isConfirmed) {
        productos[index] = {
          ...producto,
          nombre: r.value.nombre,
          descripcion: r.value.descripcion,
          precio: r.value.precio,
          imagen: r.value.imagen || producto.imagen
        };
        guardarYRenderizar();
      }
    });
  }

  // 🗑️ Eliminar producto
  if (e.target.classList.contains("eliminar")) {
    Swal.fire({
      title: "¿Eliminar este producto?",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((r) => {
      if (r.isConfirmed) {
        productos.splice(index, 1);
        guardarYRenderizar();
      }
    });
  }

  // 👁️ Publicar/Ocultar producto
  if (e.target.classList.contains("publicar")) {
    productos[index].publicado = !producto.publicado;
    guardarYRenderizar();
  }

  // ➕ Agregar nuevo producto
  if (e.target.id === "btn-agregar") {
    Swal.fire({
      title: "Agregar nuevo producto",
      html: `
        <input id="nuevo-nombre" class="swal2-input" placeholder="Nombre" />
        <input id="nuevo-desc" class="swal2-input" placeholder="Descripción" />
        <input id="nuevo-precio" class="swal2-input" type="number" placeholder="Precio" />
        <input id="nuevo-img" class="swal2-file" type="file" accept="image/*" />
      `,
      confirmButtonText: "Agregar",
      focusConfirm: false,
      preConfirm: () => {
        const nombre = document.getElementById("nuevo-nombre").value;
        const descripcion = document.getElementById("nuevo-desc").value;
        const precio = parseFloat(document.getElementById("nuevo-precio").value);
        const archivo = document.getElementById("nuevo-img").files[0];

        if (!nombre || !descripcion || isNaN(precio) || !archivo) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              nombre,
              descripcion,
              precio,
              imagen: reader.result,
              publicado: false
            });
          };
          reader.readAsDataURL(archivo);
        });
      }
    }).then((r) => {
      if (r.isConfirmed) {
        productos.push(r.value);
        guardarYRenderizar();
      }
    });
  }
});

// 💾 Guarda en localStorage y actualiza vista
function guardarYRenderizar() {
  localStorage.setItem("productos", JSON.stringify(productos));
  renderDashboard();
}

// 🚀 Inicializa el dashboard
document.addEventListener("DOMContentLoaded", () => {
  crearBotonAgregar();
  renderDashboard();
});
