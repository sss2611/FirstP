const API_URL = "https://firstp-api.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-nuevo-producto").addEventListener("click", mostrarFormularioProducto);
});

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

                console.log("Payload enviado:", payload);

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

function crearCardEditable({ nombre, descripcion, precio, imagenUrl }) {
    const cardsContainer = document.getElementById("cards-dashboard");

    const card = document.createElement("div");
    card.className = "col-md-4";
    card.innerHTML = `
        <div class="card shadow-sm p-2">
            <img src="${imagenUrl}" class="card-img-top mb-2" alt="${nombre}">
            <input type="text" class="form-control mb-2 nombre" value="${nombre}">
            <textarea class="form-control mb-2 descripcion">${descripcion}</textarea>
            <input type="number" class="form-control mb-2 precio" value="${precio}">
            <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-sm btn-outline-primary btn-editar">Editar</button>
                <button class="btn btn-sm btn-outline-success btn-publicar">Publicar</button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar">Eliminar</button>
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
            Swal.fire("¡Publicado!", "El producto está visible en el sitio público.", "success");

            // 🖌️ Indicador visual de publicación
            const publicadoBadge = document.createElement("span");
            publicadoBadge.textContent = "Publicado";
            publicadoBadge.className = "badge bg-success ms-2";

            card.querySelector(".btn-publicar").disabled = true;
            card.querySelector(".btn-publicar").innerText = "Publicado";
            card.querySelector(".btn-publicar").classList.remove("btn-outline-success");
            card.querySelector(".btn-publicar").classList.add("btn-success");

            card.querySelector(".card").prepend(publicadoBadge);
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
