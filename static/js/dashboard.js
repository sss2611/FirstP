const API_URL = "https://firstp-api.onrender.com/api";

// Al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-nuevo-producto").addEventListener("click", mostrarFormularioProducto);
    cargarProductosExistentes();
});

// Cargar productos guardados en el backend
async function cargarProductosExistentes() {
    const cardsContainer = document.getElementById("cards-dashboard");

    cardsContainer.innerHTML = `
        <div class="text-center w-100">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Cargando productos...</p>
        </div>
    `;

    try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error("Error al obtener productos");
        const productos = await res.json();

        cardsContainer.innerHTML = "";

        productos.forEach(producto => {
            crearCardEditable({
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                imagenUrl: producto.imagen,
                publicado: producto.publicado
            });
        });

        if (productos.length === 0) {
            cardsContainer.innerHTML = `<div class="text-center w-100"><p>No hay productos cargados.</p></div>`;
        }
    } catch (error) {
        console.error("Error al cargar productos:", error.message);
        mostrarError("No se pudieron cargar los productos.");
    }
}

// Crear tarjeta editable para productos nuevos o existentes
function crearCardEditable({ nombre, descripcion, precio, imagenUrl, publicado = false }) {
    const cardsContainer = document.getElementById("cards-dashboard");

    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
        <div class="card shadow-sm p-2">
            <img src="${imagenUrl}" class="card-img-top mb-2" alt="${nombre}">
            <input type="text" class="form-control mb-2 nombre" value="${nombre}">
            <textarea class="form-control mb-2 descripcion">${descripcion}</textarea>
            <input type="number" class="form-control mb-2 precio" value="${precio}">
            <div class="d-flex justify-content-between align-items-center mt-2">
                ${publicado ? '<span class="badge bg-success">Publicado</span>' : ''}
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary btn-editar">Editar</button>
                    <button class="btn btn-sm btn-outline-success btn-publicar">Publicar</button>
                    <button class="btn btn-sm btn-outline-danger btn-eliminar">Eliminar</button>
                </div>
            </div>
        </div>
    `;
    cardsContainer.appendChild(card);

    card.querySelector(".btn-editar").addEventListener("click", () => {
        Swal.fire("Editá libremente", "Los campos son modificables en la tarjeta", "info");
    });

    card.querySelector(".btn-eliminar").addEventListener("click", () => {
        card.remove();
        Swal.fire("Eliminado", "El producto fue removido", "success");
    });

    card.querySelector(".btn-publicar").addEventListener("click", async () => {
        const publicarBtn = card.querySelector(".btn-publicar");

        if (publicarBtn.disabled || publicarBtn.dataset.publicado === "true") return;

        const nombre = card.querySelector(".nombre").value.trim();
        const descripcion = card.querySelector(".descripcion").value.trim();
        const precio = parseFloat(card.querySelector(".precio").value);

        const payload = {
            nombre,
            descripcion,
            precio,
            imagen: imagenUrl,
            publicado: true
        };

        try {
            const res = await fetch(`${API_URL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                publicarBtn.disabled = true;
                publicarBtn.dataset.publicado = "true";
                publicarBtn.innerText = "Publicado";
                publicarBtn.classList.remove("btn-outline-success");
                publicarBtn.classList.add("btn-success");
            } else {
                const errorText = await res.text();
                throw new Error(`Error al publicar: ${errorText}`);
            }
        } catch (error) {
            console.error("Detalles del error:", error.message);
            Swal.fire("Error", "No se pudo publicar el producto", "error");
        }
    });
}

// SweetAlert para nuevo producto
function mostrarFormularioProducto() {
    Swal.fire({
        title: 'Nuevo Producto',
        html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre del producto">
            <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción del producto"></textarea>
            <input type="number" id="precio" class="swal2-input" placeholder="Precio">
            <input type="file" id="imagen" class="swal2-file" accept="image/*">
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar borrador',
        focusConfirm: false,
        preConfirm: () => {
            const nombre = document.getElementById('nombre').value.trim();
            const descripcion = document.getElementById('descripcion').value.trim();
            const precio = parseFloat(document.getElementById('precio').value);
            const imagen = document.getElementById('imagen').files[0];

            if (!nombre || !descripcion || isNaN(precio) || !imagen) {
                Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos');
                return false;
            }

            return { nombre, descripcion, precio, imagen };
        }
    }).then(result => {
        if (result.isConfirmed) {
            const { nombre, descripcion, precio, imagen } = result.value;

            const reader = new FileReader();
            reader.onload = function (e) {
                const imagenBase64 = e.target.result;

                const payload = {
                    nombre,
                    descripcion,
                    precio,
                    imagen: imagenBase64,
                    publicado: false
                };

                fetch(`${API_URL}/products`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                })
                .then(res => {
                    if (!res.ok) {
                        return res.text().then(text => {
                            throw new Error(`Error en la API: ${text}`);
                        });
                    }
                    return res.json();
                })
                .then(() => {
                    Swal.fire("¡Guardado!", "El producto fue guardado como borrador.", "success");
                    crearCardEditable({ ...payload, imagenUrl: imagenBase64 });
                })
                .catch((error) => {
                    console.error("Detalles del error:", error.message);
                    Swal.fire("Error", "No se pudo guardar el producto. Verificá la consola para más detalles.", "error");
                });
            };

            reader.readAsDataURL(imagen);
        }
    });
}

// Mostrar errores con estilo
function mostrarError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: 'Ups...',
        text: mensaje,
    });
}
