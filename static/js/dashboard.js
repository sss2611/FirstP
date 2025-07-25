// Carga inicial desde localStorage (si existe)
const productos = JSON.parse(localStorage.getItem("productosFirstp")) || [];
const contenedor = document.getElementById("cards-dashboard");

// Renderiza todas las cards del dashboard
function renderDashboard() {
    contenedor.innerHTML = "";

    productos.forEach((p) => {
        const card = document.createElement("div");
        card.className = "col-md-4";
        card.innerHTML = `
      <div class="card shadow h-100">
        <img src="${p.imagen || "placeholder.jpg"}" class="card-img-top" alt="${p.nombre}" />
        <div class="card-body">
          <h5 class="card-title">${p.nombre}</h5>
          <p class="card-text">${p.descripcion}</p>
          <p><strong>Precio:</strong> $${p.precio}</p>
          <p><strong>Publicado:</strong> ${p.publicado ? "✅" : "❌"}</p>
          <button class="btn btn-primary editar" data-id="${p.id}">Editar</button>
          <button class="btn btn-danger eliminar" data-id="${p.id}">Eliminar</button>
          <button class="btn btn-secondary publicar" data-id="${p.id}">
            ${p.publicado ? "Ocultar" : "Publicar"}
          </button>
        </div>
      </div>
    `;
        contenedor.appendChild(card);
    });
}

// Guarda los productos en localStorage
function guardarProductos() {
    localStorage.setItem("productosFirstp", JSON.stringify(productos));
}

// Agrega un nuevo producto
function agregarProducto(producto) {
    producto.id = Date.now();
    productos.push(producto);
    guardarProductos();
    renderDashboard();
}

// Crea el botón para agregar productos
function crearBotonAgregar() {
    const btn = document.createElement("button");
    btn.id = "btn-nuevo";
    btn.textContent = "➕ Agregar producto";
    btn.className = "btn btn-success";
    document.getElementById("boton-agregar").appendChild(btn);
}

// Manejador general de eventos
document.addEventListener("click", (e) => {
    const id = parseInt(e.target.dataset.id);
    const producto = productos.find(p => p.id === id);

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
                const imagenInput = document.getElementById("edit-imagen");
                const archivo = imagenInput.files[0];

                if (!nombre || !descripcion || isNaN(precio)) {
                    Swal.showValidationMessage("Todos los campos son obligatorios");
                    return false;
                }

                if (archivo) {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            resolve({ nombre, descripcion, precio, nuevaImagen: reader.result });
                        };
                        reader.readAsDataURL(archivo);
                    });
                }

                return { nombre, descripcion, precio };
            }
        }).then((r) => {
            if (r.isConfirmed) {
                producto.nombre = r.value.nombre;
                producto.descripcion = r.value.descripcion;
                producto.precio = r.value.precio;
                if (r.value.nuevaImagen) {
                    producto.imagen = r.value.nuevaImagen;
                }
                guardarProductos();
                renderDashboard();
            }
        });
    }

    if (e.target.classList.contains("eliminar")) {
        Swal.fire({
            title: "¿Eliminar este producto?",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((r) => {
            if (r.isConfirmed) {
                const index = productos.findIndex(p => p.id === id);
                productos.splice(index, 1);
                guardarProductos();
                renderDashboard();
            }
        });
    }

    if (e.target.classList.contains("publicar")) {
        producto.publicado = !producto.publicado;
        guardarProductos();
        renderDashboard();
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
                const fileInput = document.getElementById("nuevo-img");
                const archivo = fileInput.files[0];

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
                agregarProducto(r.value);
            }
        });
    }
});

// Carga inicial al abrir el dashboard
document.addEventListener("DOMContentLoaded", () => {
    crearBotonAgregar();
    renderDashboard();
});

const themeSelector = document.getElementById("theme-selector");
const themeLink = document.querySelector("link[href*='bootswatch']");
const saveButton = document.getElementById("save-theme");

// Cargar tema guardado al entrar
const savedTheme = localStorage.getItem("selectedTheme");
if (savedTheme) {
    themeSelector.value = savedTheme;
    themeLink.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${savedTheme}/bootstrap.min.css`;
}

// Cambiar tema al seleccionar
themeSelector.addEventListener("change", (e) => {
    const theme = e.target.value;
    themeLink.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${theme}/bootstrap.min.css`;
});

// Guardar configuración
saveButton.addEventListener("click", () => {
    const selectedTheme = themeSelector.value;
    localStorage.setItem("selectedTheme", selectedTheme);
    Swal.fire({
        icon: "success",
        title: "Configuración guardada",
        text: `Tu tema "${selectedTheme}" fue guardado.`,
        timer: 2000,
        showConfirmButton: false
    });
});

// Cambiar el nombre de la marca o local
function guardarMarca() {
    const marca = document.getElementById('theme-input').value;

    if (marca.trim()) {
        // ✅ Guardar en localStorage
        localStorage.setItem('nombreMarca', marca);

        // 🎉 SweetAlert de confirmación
        Swal.fire({
            title: '¡Marca guardada!',
            html: `La marca <strong>${marca}</strong> ha sido registrada.`,
            icon: 'success',
            confirmButtonText: 'Perfecto'
        });

        // 🔄 Actualizar texto en elementos con cierto ID
        const elementosActualizables = document.querySelectorAll('[data-marca]');
        elementosActualizables.forEach(el => {
            el.textContent = marca;
        });

        // 🧼 Limpiar input
        document.getElementById('theme-input').value = '';
    } else {
        Swal.fire({
            title: 'Campo vacío',
            text: 'Por favor ingresa un nombre.',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
    }
}

const marca = localStorage.getItem('nombreMarca');
const lugaresMarca = document.querySelectorAll('#nombre-marca');

if (marca && lugaresMarca.length > 0) {
    lugaresMarca.forEach(el => {
        el.textContent = marca;
    });
}

// Mostrar logo guardado al cargar la página
window.onload = function () {
    const logoGuardado = localStorage.getItem("logoGuardado");
    if (logoGuardado) {
        document.getElementById("logo-preview").src = logoGuardado;
    }
};

function guardarLogo() {
    const input = document.getElementById("logo-input");
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imageUrl = e.target.result;

            // Guardar en localStorage
            localStorage.setItem("logoGuardado", imageUrl);

            // Mostrar vista previa
            document.getElementById("logo-preview").src = imageUrl;

            // SweetAlert con imagen
            Swal.fire({
                title: "¡Logo guardado!",
                text: "Tu logo se ha guardado correctamente y se mantendrá al cerrar sesión.",
                imageUrl: imageUrl,
                imageAlt: "Vista previa del logo",
                confirmButtonText: "Aceptar",
                width: 400,
                heigth: 50
            }).then(() => {
                location.reload();
            }
            );
        };
        reader.readAsDataURL(file);
    } else {
        Swal.fire({
            icon: "warning",
            title: "Sin imagen",
            text: "Subí una imagen antes de guardar.",
            confirmButtonText: "OK"
        });
    }
}
