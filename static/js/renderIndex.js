const contenedor = document.querySelector(".productos");
const loader = document.getElementById("productos-loader");
const API_URL = "https://firstp-api-production.up.railway.app/api"; // Usamos el endpoint correcto

async function renderProductos() {
    contenedor.innerHTML = "";
    loader.style.display = "block";

    try {
        const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
        if (!res.ok) throw new Error("Error al obtener productos");

        const productos = await res.json();

        const productosPublicados = productos.filter(p => p.publicado === true);

        if (productosPublicados.length === 0) {
            contenedor.innerHTML = `<p class="text-center text-muted">No hay productos publicados disponibles.</p>`;
            return;
        }

        const fragment = document.createDocumentFragment();

        productosPublicados.forEach(p => {
            const inputId = `cantidad-${p._id}`;
            const imagenUrl = validarImagenUrl(p.imagen);

            const card = document.createElement("div");
            card.className = "col";
            card.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${imagenUrl}" 
                         class="card-img-top" 
                         alt="${p.nombre}" 
                         loading="lazy"
                         onerror="this.onerror=null;this.src='/static/img/productos/placeholder.jpg';">
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
            fragment.appendChild(card);
        });

        contenedor.appendChild(fragment);
    } catch (err) {
        console.error("Error al cargar productos:", err.message);
        contenedor.innerHTML = `<p class="text-danger text-center">No se pudieron cargar los productos.</p>`;
    } finally {
        loader.style.display = "none";
    }
}

// 🔍 Validar imagen Cloudinary o fallback
function validarImagenUrl(url) {
    if (!url || typeof url !== "string") return "/static/img/productos/placeholder.jpg";
    if (url.startsWith("http") || url.startsWith("https")) return url;
    return "/static/img/productos/placeholder.jpg";
}

document.addEventListener("DOMContentLoaded", renderProductos);
