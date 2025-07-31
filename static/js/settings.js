// TEMAS
function aplicarTema(nombreTema) {
    const themeLink = document.getElementById("theme-link");
    themeLink.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${nombreTema}/bootstrap.min.css`;
}

document.getElementById("theme-selector").addEventListener("change", function () {
    const selectedTheme = this.value;
    aplicarTema(selectedTheme);
});

async function saveConfig() {
    const selectedTheme = document.getElementById("theme-selector").value;
    const spinner = document.getElementById("spinner");
    const buttonText = document.getElementById("button-text");

    spinner.classList.remove("d-none");
    buttonText.textContent = "Guardando...";

    try {
        const res = await fetch("https://firstp-api.onrender.com/api/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ theme: selectedTheme })
        });

        if (!res.ok) throw new Error("Error al guardar");

        const data = await res.json();
        console.log("Tema guardado:", data);

        // 🌟 Guardar también en localStorage
        localStorage.setItem("selectedTheme", selectedTheme);

        Swal.fire({
            icon: "success",
            title: "Configuración guardada",
            timer: 1500,
            showConfirmButton: false
        });
    } catch (error) {
        console.error("Error en la solicitud:", error);
        Swal.fire({
            icon: "error",
            title: "Error al guardar la configuración"
        });
    } finally {
        spinner.classList.add("d-none");
        buttonText.textContent = "Guardar configuración";
    }
}


async function cargarTemaGuardado() {
    try {
        const res = await fetch("https://firstp-api.onrender.com/api/settings");
        const config = await res.json();
        if (config && config.theme) {
            aplicarTema(config.theme);
            document.getElementById("theme-selector").value = config.theme;
        }
    } catch (error) {
        console.error("No se pudo cargar el tema guardado:", error);
    }
}

window.addEventListener("DOMContentLoaded", cargarTemaGuardado);

function aplicarTema(nombreTema) {
    const themeLink = document.getElementById("theme-link");
    themeLink.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${nombreTema}/bootstrap.min.css`;
}

async function aplicarTemaGuardado() {
    try {
        const res = await fetch("https://firstp-api.onrender.com/api/settings");
        const config = await res.json();
        if (config && config.theme) {
            aplicarTema(config.theme);
        }
    } catch (error) {
        console.error("No se pudo aplicar el tema guardado:", error);
    }
}

window.addEventListener("DOMContentLoaded", aplicarTemaGuardado);

function aplicarTemaDesdeLocalStorage() {
    const temaLocal = localStorage.getItem("selectedTheme");
    if (temaLocal) {
        aplicarTema(temaLocal);
    } else {
        aplicarTemaGuardado(); // Si no hay tema en local, pedilo al backend
    }
}

window.addEventListener("DOMContentLoaded", aplicarTemaDesdeLocalStorage);

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("selectedTheme");

    if (savedTheme) {
        document.body.classList.add(savedTheme);
        console.log("Tema aplicado:", savedTheme);
    }
});

// MARCA
// MARCA
function guardarMarca() {
    const marca = document.getElementById("theme-input")?.value;
    if (!marca) return;

    localStorage.setItem("selectedMarca", marca);

    fetch("https://firstp-api.onrender.com/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marca })
    })
        .then(res => {
            if (!res.ok) throw new Error("Error al guardar la marca");
            return res.json();
        })
        .then(data => {
            console.log("Marca guardada:", data);
            Swal.fire({
                icon: "success",
                title: "Nombre guardado",
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.reload();
            });
        })
        .catch(error => {
            console.error("Error al guardar la marca:", error);
            Swal.fire({ icon: "error", title: "No se pudo guardar la marca" });
        });
}

function aplicarMarca(id = "marca-display") {
    const marca = localStorage.getItem("selectedMarca");
    const target = document.getElementById(id);

    if (marca && target) {
        target.textContent = marca;
    } else {
        fetch("https://firstp-api.onrender.com/api/settings")
            .then(res => res.json())
            .then(config => {
                if (config?.marca && target) {
                    target.textContent = config.marca;
                }
            })
            .catch(err => console.error("No se pudo cargar la marca:", err));
    }
}

window.addEventListener("DOMContentLoaded", () => {
    aplicarTemaGuardado();
    aplicarMarca("marca-display");
    aplicarMarca("nombre-marca"); // Para la navbar
});

// APLICAR MARCA EN EL NAVBAR 
function aplicarMarcaEnNavbar() {
    const marcaSpan = document.getElementById("nombre-marca");

    if (!marcaSpan) {
        console.warn("El elemento 'nombre-marca' no está disponible en el DOM aún.");
        return;
    }

    const marcaLocal = localStorage.getItem("selectedMarca");
    if (marcaLocal) {
        marcaSpan.textContent = marcaLocal;
        return;
    }

    fetch("https://firstp-api.onrender.com/api/settings")
        .then(res => res.json())
        .then(config => {
            if (config?.marca) {
                marcaSpan.textContent = config.marca;
            }
        })
        .catch(err => console.error("Error al obtener marca del backend", err));
}
