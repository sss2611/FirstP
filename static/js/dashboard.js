let productos = [];
const contenedor = document.getElementById("cards-dashboard");

// Carga productos desde la API
async function cargarProductos() {
    try {
        const res = await fetch("https://firstp-backend.vercel.app/api/productos/admin");
        productos = await res.json();
        renderDashboard();
    } catch (err) {
        console.error("❌ Error al cargar productos:", err);
    }
}

// Renderiza cards en el dashboard
function renderDashboard() {
    contenedor.innerHTML = "";

    productos.forEach((p) => {
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
          <button class="btn btn-primary editar" data-id="${p._id}">Editar</button>
          <button class="btn btn-danger eliminar" data-id="${p._id}">Eliminar</button>
          <button class="btn btn-secondary publicar" data-id="${p._id}">
            ${p.publicado ? "Ocultar" : "Publicar"}
          </button>
        </div>
      </div>
    `;
        contenedor.appendChild(card);
    });
}

// Crear botón para agregar productos
function crearBotonAgregar() {
    const btn = document.createElement("button");
    btn.id = "btn-nuevo";
    btn.textContent = "➕ Agregar producto";
    btn.className = "btn btn-success";
    document.getElementById("boton-agregar").appendChild(btn);
}

// Manejador de eventos
document.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    const producto = productos.find(p => p._id === id);

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
        }).then(async (r) => {
            if (r.isConfirmed) {
                const actualizado = {
                    nombre: r.value.nombre,
                    descripcion: r.value.descripcion,
                    precio: r.value.precio,
                    imagen: r.value.imagen || producto.imagen,
                    publicado: producto.publicado
                };

                await fetch(`https://firstp-backend.vercel.app/api/productos/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(actualizado)
                });

                cargarProductos();
            }
        });
    }

    if (e.target.classList.contains("eliminar")) {
        Swal.fire({
            title: "¿Eliminar este producto?",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then(async (r) => {
            if (r.isConfirmed) {
                await fetch(`https://firstp-backend.vercel.app/api/productos/${id}`, {
                    method: "DELETE"
                });
                cargarProductos();
            }
        });
    }

    if (e.target.classList.contains("publicar")) {
        const actualizado = { ...producto, publicado: !producto.publicado };

        await fetch(`https://firstp-backend.vercel.app/api/productos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(actualizado)
        });

        cargarProductos();
    }

    if (e.target.id === "btn-nuevo") {
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
        }).then(async (r) => {
            if (r.isConfirmed) {
                await fetch("https://firstp-backend.vercel.app/api/productos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(r.value)
                });
                cargarProductos();
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    crearBotonAgregar();
    cargarProductos();
});
