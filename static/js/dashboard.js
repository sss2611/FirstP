const API_URL = "https://firstp-api-production.up.railway.app/api";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-nuevo-producto").addEventListener("click", mostrarFormularioProducto);
    cargarProductosExistentes();
});

async function uploadToCloudinary(file) {
    const url = 'https://api.cloudinary.com/v1_1/dhuxbiud1/image/upload';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', '<tu-upload-preset>');

    try {
        const res = await fetch(url, { method: 'POST', body: formData });
        const data = await res.json();
        return data.secure_url;
    } catch (err) {
        console.error('Error al subir a Cloudinary:', err);
        return null;
    }
}


// CREAR FORMULARIO
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
    })
        .then(result => {
            if (result.isConfirmed) {
                const { nombre, descripcion, precio, imagen } = result.value;

                uploadToCloudinary(imagen).then(imagenUrl => {
                    if (!imagenUrl) {
                        Swal.fire("Error", "No se pudo subir la imagen", "error");
                        return;
                    }

                    const payload = {
                        nombre,
                        descripcion,
                        precio,
                        imagen: imagenUrl,
                        publicado: false
                    };

                    fetch(`${API_URL}/products`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    })
                        .then(res => res.json())
                        .then(() => {
                            Swal.fire("¡Guardado!", "El producto fue guardado como borrador.", "success");
                            cargarProductosExistentes();
                        })
                        .catch((error) => {
                            console.error("Error al guardar producto:", error.message);
                            Swal.fire("Error", "No se pudo guardar el producto", "error");
                        });
                });
            }

        });
}

// CREAR CARD
function crearCardEditable({ id, nombre, descripcion, precio, imagenUrl, publicado }) {
    const pathname = window.location.pathname;
    const esIndex = pathname === "/" || pathname.endsWith("index.html");

    // 👉 Mostrar solo si:
    //    • estás en el index y el producto está publicado
    //    • estás en dashboard y el producto está publicado o es borrador
    if (esIndex && !publicado) return;

    const card = document.createElement("div");
    card.className = "card mb-3 shadow-sm position-relative";

    card.innerHTML = `
        <img src="${imagenUrl}" class="card-img-top" alt="${nombre}">
        <div class="card-body">
            <h5 class="card-title">${nombre}</h5>
            <p class="card-text">${descripcion}</p>
            <p class="card-text"><strong>$${precio}</strong></p>

            ${esIndex
            ? ""
            : `
                <div class="d-flex justify-content-between mt-3">
                    <button class="btn btn-sm btn-info" onclick="editarProducto('${id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarProducto('${id}')">Eliminar</button>
                    <button 
  class="btn btn-sm ${publicado ? 'btn-secondary' : 'btn-success'}"
  onclick="${publicado ? `ocultarProducto('${id}')` : `publicarProducto('${id}')`}"
>
  <i class="fa-solid ${publicado ? 'fa-xmark text-danger' : 'fa-check text-light'}"></i>
  ${publicado ? 'Ocultar' : 'Publicar'}
</button>

                </div>
                `}
        </div>
    `;

    // 👀 En el dashboard, si está como borrador, mostramos badge
    if (!esIndex && !publicado) {
        const badge = document.createElement("span");
        badge.className = "badge bg-warning text-dark position-absolute top-0 end-0 m-2";
        badge.textContent = "Borrador";
        card.appendChild(badge);
    }

    return card;
}

// EDITAR PRODUCTO
async function editarProducto(id) {
    try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error("No se pudo obtener el producto");
        const producto = await res.json();

        Swal.fire({
            title: 'Editar Producto',
            html: `
                <input type="text" id="edit-nombre" class="swal2-input" value="${producto.nombre}" placeholder="Nombre">
                <textarea id="edit-descripcion" class="swal2-textarea" placeholder="Descripción">${producto.descripcion}</textarea>
                <input type="number" id="edit-precio" class="swal2-input" value="${producto.precio}" placeholder="Precio">
                <input type="file" id="edit-imagen" class="swal2-file" accept="image/*">
                <img src="${producto.imagen}" alt="Imagen actual" style="max-width: 100%; margin-top:10px;" />
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar cambios',
            focusConfirm: false,
            preConfirm: () => {
                const nombre = document.getElementById("edit-nombre").value.trim();
                const descripcion = document.getElementById("edit-descripcion").value.trim();
                const precio = parseFloat(document.getElementById("edit-precio").value);
                const imagenArchivo = document.getElementById("edit-imagen").files[0];

                if (!nombre || !descripcion || isNaN(precio)) {
                    Swal.showValidationMessage("Todos los campos son obligatorios y deben ser válidos");
                    return false;
                }

                return { nombre, descripcion, precio, imagenArchivo };
            }
        }).then(result => {
            if (result.isConfirmed) {
                const { nombre, descripcion, precio, imagenArchivo } = result.value;

                const actualizarProducto = (imagenBase64) => {
                    const payload = {
                        nombre,
                        descripcion,
                        precio,
                        imagen: imagenBase64 || producto.imagen
                    };

                    fetch(`${API_URL}/products/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    })
                        .then(res => {
                            if (!res.ok) throw new Error("Error al actualizar");
                            return res.json();
                        })
                        .then(() => {
                            Swal.fire("¡Actualizado!", "El producto fue modificado.", "success");
                            cargarProductosExistentes();
                        })
                        .catch(err => {
                            console.error(err);
                            Swal.fire("Error", "No se pudo guardar el producto", "error");
                        });
                };

                if (imagenArchivo) {
                    uploadToCloudinary(imagenArchivo)
                        .then(imagenUrl => actualizarProducto(imagenUrl))
                        .catch(() => {
                            Swal.fire("Error", "No se pudo subir la nueva imagen", "error");
                        });
                } else {
                    actualizarProducto(null);
                }

            }
        });

    } catch (err) {
        console.error("Error al editar producto:", err.message);
        Swal.fire("Error", "No se pudo cargar el formulario de edición", "error");
    }
}

// ELIMINAR PRODUCTO
async function eliminarProducto(id) {
    const confirmacion = await Swal.fire({
        title: "¿Eliminar producto?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (confirmacion.isConfirmed) {
        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const texto = await res.text();
                throw new Error(`Error ${res.status}: ${texto}`);
            }

            // Eliminación visual de la card
            const card = document.querySelector(`[onclick="editarProducto('${id}')"]`)?.closest(".card");
            if (card) card.remove();

            Swal.fire("Eliminado", "El producto fue eliminado correctamente.", "success");
        } catch (error) {
            console.error("Error al eliminar producto:", error.message);
            Swal.fire("Error", `No se pudo eliminar el producto: ${error.message}`, "error");
        }
    }
}

// PUBLICAR
function publicarProducto(id) {
    fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicado: true })
    })
        .then(res => res.json())
        .then(() => {
            Swal.fire("Publicado", "El producto fue publicado con éxito.", "success");
            cargarProductosExistentes(); // Recarga cards actualizadas
        })
        .catch(err => {
            console.error(err);
            Swal.fire("Error", "No se pudo publicar el producto.", "error");
        });
}

function ocultarProducto(id) {
    fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicado: false })
    })
        .then(res => res.json())
        .then(() => {
            Swal.fire("Ocultado", "El producto ya no se muestra en la página principal.", "info");
            cargarProductosExistentes();
        })
        .catch(err => {
            console.error(err);
            Swal.fire("Error", "No se pudo ocultar el producto.", "error");
        });
}


// CARGAR PRODUCTOS
async function cargarProductosExistentes() {
    const cardsContainer = document.getElementById("cards-dashboard") || document.querySelector(".productos");

    cardsContainer.innerHTML = `
        <div class="text-center w-100">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Cargando productos...</p>
        </div>
    `;

    try {
        const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
        if (!res.ok) throw new Error("Error al obtener productos");
        const productos = await res.json();

        cardsContainer.innerHTML = "";
        const fragment = document.createDocumentFragment();
        const esIndex =
            window.location.pathname === "/" || window.location.pathname.endsWith("index.html");

        const productosFiltrados = esIndex ? productos.filter(p => p.publicado) : productos;

        productosFiltrados.forEach(producto => {
            const card = crearCardEditable({
                id: producto._id,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                imagenUrl: producto.imagen,
                publicado: producto.publicado
            });
            if (card) fragment.appendChild(card);
        });

        cardsContainer.appendChild(fragment);

        if (productosFiltrados.length === 0) {
            cardsContainer.innerHTML = `<div class="text-center w-100"><p>No hay productos cargados.</p></div>`;
        }

    } catch (error) {
        console.error("Error al cargar productos:", error.message);
        mostrarError("No se pudieron cargar los productos.");
    }
}