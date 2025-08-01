const API_URL = "https://firstp-api-production.up.railway.app/api";
const CLOUDINARY_PRESET = "firstp2025"; // Asegurate que esté creado en tu panel Cloudinary

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-nuevo-producto")?.addEventListener("click", mostrarFormularioProducto);
    cargarProductosExistentes();
});

// 🔼 Subida de imagen a Cloudinary
async function uploadToCloudinary(file) {
    const url = "https://api.cloudinary.com/v1_1/dhuxbiud1/image/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    try {
        const res = await fetch(url, { method: "POST", body: formData });
        if (!res.ok) throw new Error("No se pudo subir la imagen");
        const data = await res.json();
        return data.secure_url;
    } catch (err) {
        console.error("Error al subir a Cloudinary:", err.message);
        Swal.fire("Error", "No se pudo subir la imagen", "error");
        return null;
    }
}

// 🟢 Mostrar formulario nuevo producto
function mostrarFormularioProducto() {
    Swal.fire({
        title: "Nuevo Producto",
        html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre del producto">
            <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción del producto"></textarea>
            <input type="number" id="precio" class="swal2-input" placeholder="Precio">
            <input type="file" id="imagen" class="swal2-file" accept="image/*">
        `,
        showCancelButton: true,
        confirmButtonText: "Guardar borrador",
        focusConfirm: false,
        preConfirm: () => {
            const nombre = document.getElementById("nombre").value.trim();
            const descripcion = document.getElementById("descripcion").value.trim();
            const precio = parseFloat(document.getElementById("precio").value);
            const imagen = document.getElementById("imagen").files[0];

            if (!nombre || !descripcion || isNaN(precio) || !imagen) {
                Swal.showValidationMessage("Todos los campos son obligatorios y deben ser válidos");
                return false;
            }

            return { nombre, descripcion, precio, imagen };
        }
    }).then(async result => {
        if (!result.isConfirmed) return;
        const { nombre, descripcion, precio, imagen } = result.value;
        const imagenUrl = await uploadToCloudinary(imagen);
        if (!imagenUrl) return;

        const payload = { nombre, descripcion, precio, imagen: imagenUrl, publicado: false };
        try {
            const res = await fetch(`${API_URL}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("No se pudo guardar el producto");

            Swal.fire("¡Guardado!", "El producto fue guardado como borrador.", "success");
            cargarProductosExistentes();
        } catch (err) {
            console.error("Error al guardar producto:", err.message);
            Swal.fire("Error", "No se pudo guardar el producto", "error");
        }
    });
}

// 🧩 Crear card editable
function crearCardEditable({ id, nombre, descripcion, precio, imagenUrl, publicado }) {
    const esIndex = location.pathname === "/" || location.pathname.endsWith("index.html");
    if (esIndex && !publicado) return;

    const card = document.createElement("div");
    card.className = "card mb-3 shadow-sm position-relative";

    card.innerHTML = `
        <img src="${imagenUrl}" class="card-img-top" alt="${nombre}" onerror="this.src='/static/img/productos/placeholder.jpg';">
        <div class="card-body">
            <h5 class="card-title">${nombre}</h5>
            <p class="card-text">${descripcion}</p>
            <p class="card-text"><strong>$${precio}</strong></p>

            ${!esIndex ? `
                <div class="d-flex justify-content-between mt-3">
                    <button class="btn btn-sm btn-info" onclick="editarProducto('${id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarProducto('${id}')">Eliminar</button>
                    <button class="btn btn-sm ${publicado ? 'btn-secondary' : 'btn-success'}"
                            onclick="${publicado ? `ocultarProducto('${id}')` : `publicarProducto('${id}')`}">
                        <i class="fa-solid ${publicado ? 'fa-xmark text-danger' : 'fa-check text-light'}"></i>
                        ${publicado ? "Ocultar" : "Publicar"}
                    </button>
                </div>` : ""
            }
        </div>
    `;

    if (!esIndex && !publicado) {
        const badge = document.createElement("span");
        badge.className = "badge bg-warning text-dark position-absolute top-0 end-0 m-2";
        badge.textContent = "Borrador";
        card.appendChild(badge);
    }

    return card;
}

// ✏️ Editar producto
async function editarProducto(id) {
    try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error("No se pudo obtener el producto");

        const producto = await res.json();

        Swal.fire({
            title: "Editar Producto",
            html: `
                <input type="text" id="edit-nombre" class="swal2-input" value="${producto.nombre}" placeholder="Nombre">
                <textarea id="edit-descripcion" class="swal2-textarea">${producto.descripcion}</textarea>
                <input type="number" id="edit-precio" class="swal2-input" value="${producto.precio}" placeholder="Precio">
                <input type="file" id="edit-imagen" class="swal2-file" accept="image/*">
                <img src="${producto.imagen}" alt="Imagen actual" style="max-width: 100%; margin-top:10px;" />
            `,
            showCancelButton: true,
            confirmButtonText: "Guardar cambios",
            preConfirm: () => {
                const nombre = document.getElementById("edit-nombre").value.trim();
                const descripcion = document.getElementById("edit-descripcion").value.trim();
                const precio = parseFloat(document.getElementById("edit-precio").value);
                const imagenArchivo = document.getElementById("edit-imagen").files[0];

                if (!nombre || !descripcion || isNaN(precio)) {
                    Swal.showValidationMessage("Todos los campos son obligatorios y válidos");
                    return false;
                }

                return { nombre, descripcion, precio, imagenArchivo };
            }
        }).then(async result => {
            if (!result.isConfirmed) return;
            const { nombre, descripcion, precio, imagenArchivo } = result.value;

            const imagenUrl = imagenArchivo ? await uploadToCloudinary(imagenArchivo) : producto.imagen;

            const payload = { nombre, descripcion, precio, imagen: imagenUrl };

            const res = await fetch(`${API_URL}/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("No se pudo actualizar el producto");

            Swal.fire("¡Actualizado!", "El producto fue modificado.", "success");
            cargarProductosExistentes();
        });
    } catch (err) {
        console.error("Error al editar producto:", err.message);
        Swal.fire("Error", "No se pudo cargar el formulario", "error");
    }
}

// 🗑️ Eliminar producto
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

    if (!confirmacion.isConfirmed) return;

    try {
        const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar producto");

        document.querySelector(`[onclick="editarProducto('${id}')"]`)?.closest(".card")?.remove();

        Swal.fire("Eliminado", "El producto fue eliminado correctamente.", "success");
    } catch (error) {
        console.error("Error al eliminar producto:", error.message);
        Swal.fire("Error", `No se pudo eliminar el producto: ${error.message}`, "error");
    }
}

// 🔄 Cambiar estado de publicación
function actualizarEstadoPublicacion(id, estado, titulo, mensaje) {
    fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicado: estado })
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al cambiar estado de publicación");
        return res.json();
    })
    .then(() => {
        Swal.fire(titulo, mensaje, "success");
        cargarProductosExistentes();
    })
    .catch(err => {
        console.error("Error:", err.message);
        Swal.fire("Error", `No se pudo actualizar el estado: ${err.message}`, "error");
    });
}

function publicarProducto(id) {
    actualizarEstadoPublicacion(id, true, "Publicado", "El producto fue publicado con éxito.");
}

function ocultarProducto(id) {
    actualizarEstadoPublicacion(id, false, "Ocultado", "El producto ya no se muestra en la página principal.");
}

// 🔁 Cargar productos en dashboard/index
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
        const esIndex = location.pathname === "/" || location.pathname.endsWith("index.html");

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
            cardsContainer.innerHTML = `
                <div class="text-center w-100">
                    <p class="text-muted">No hay productos cargados.</p>
                </div>
            `;
        }

    } catch (error) {
        console.error("Error al cargar productos:", error.message);
        cardsContainer.innerHTML = `
            <div class="text-center w-100 text-danger">
                <p>No se pudieron cargar los productos.</p>
            </div>
        `;
    }
}
