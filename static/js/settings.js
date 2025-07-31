function aplicarTema(nombreTema) {
    const themeLink = document.getElementById("theme-link");
    if (themeLink) {
        themeLink.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${nombreTema}/bootstrap.min.css`;
    }
}

async function aplicarTemaGuardado() {
    try {
        const res = await fetch("https://firstp-api.onrender.com/api/settings");
        const config = await res.json();
        if (config?.theme) {
            aplicarTema(config.theme);
            document.getElementById("theme-selector").value = config.theme;
        }
    } catch (error) {
        console.error("No se pudo aplicar el tema guardado:", error);
    }
}

document.getElementById("theme-selector")?.addEventListener("change", function () {
    const selectedTheme = this.value;
    aplicarTema(selectedTheme);
});


async function saveConfig() {
    const selectedTheme = document.getElementById("theme-selector").value;
    const spinner = document.getElementById("spinner");
    const buttonText = document.getElementById("button-text");

    spinner?.classList.remove("d-none");
    if (buttonText) buttonText.textContent = "Guardando...";

    try {
        const res = await fetch("https://firstp-api.onrender.com/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ theme: selectedTheme })
        });

        if (!res.ok) throw new Error("Error al guardar");

        const data = await res.json();
        console.log("Tema guardado:", data);
        // localStorage.setItem("selectedTheme", selectedTheme);

        Swal.fire({
            icon: "success",
            title: "Configuración guardada",
            timer: 1500,
            showConfirmButton: false
        });
    } catch (error) {
        console.error("Error en la solicitud:", error);
        Swal.fire({ icon: "error", title: "Error al guardar la configuración" });
    } finally {
        spinner?.classList.add("d-none");
        if (buttonText) buttonText.textContent = "Guardar configuración";
    }
}



function guardarMarca() {
    const marca = document.getElementById("theme-input")?.value;
    if (!marca) return;

    // localStorage.setItem("selectedMarca", marca);

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
            }).then(() => window.location.reload());
        })
        .catch(error => {
            console.error("Error al guardar la marca:", error);
            Swal.fire({ icon: "error", title: "No se pudo guardar la marca" });
        });
}

function aplicarMarca(id) {
    // const marca = localStorage.getItem("selectedMarca");
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



function guardarLogo() {
    const input = document.getElementById("logo-input");
    const file = input?.files[0];

    if (!file) {
        Swal.fire({ icon: "error", title: "Selecciona un logo primero" });
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const logoBase64 = reader.result;

        // Vista previa
        document.getElementById("logo-preview").src = logoBase64;

        fetch("https://firstp-api.onrender.com/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ logo: logoBase64 })
        })
            .then(res => res.ok ? res.json() : Promise.reject("Error al guardar logo"))
            .then(data => {
                console.log("Logo guardado:", data);
                // localStorage.setItem("logoGuardado", logoBase64);

                Swal.fire({
                    icon: "success",
                    title: "Logo actualizado",
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.reload();
                });
            })
            .catch(err => {
                console.error(err);
                Swal.fire({ icon: "error", title: "Falló el guardado" });
            });
    };

    reader.readAsDataURL(file);
}

function aplicarLogo(id) {
    const img = document.getElementById(id);
    // const logoBase64 = localStorage.getItem("logoGuardado") || "static/img/SS.png";

    if (img) {
        img.src = logoBase64;
        img.alt = "Logo dinámico";
    } else {
        console.warn(`No se encontró el elemento con ID ${id} para aplicar el logo`);
    }
}
function obtenerLogoDelBackend() {
    fetch("https://firstp-api.onrender.com/api/settings")
        .then(res => res.ok ? res.json() : Promise.reject("Error al obtener configuración"))
        .then(data => {
            if (data.logo) {
                // localStorage.setItem("logoGuardado", data.logo);
                aplicarLogo("footer-logo");
                aplicarLogo("navbar-logo");
                aplicarLogo("logo-preview");
            }
        })
        .catch(err => console.error("No se pudo obtener el logo:", err));
}

function aplicarMarcaDesdeBackend() {
    fetch("https://firstp-api.onrender.com/api/settings")
        .then(res => res.ok ? res.json() : Promise.reject("Error al obtener la marca"))
        .then(config => {
            const marcaFinal = config?.marca || "FirstP";
            // localStorage.setItem("selectedMarca", marcaFinal);

            // 🔁 Insertar marca en todos los lugares con id nombre-marca
            document.querySelectorAll("#nombre-marca, #marca-display").forEach(el => {
                el.textContent = marcaFinal;
            });
        })
        .catch(err => {
            console.error("No se pudo cargar la marca:", err);
        });
}

function aplicarLogoDesdeBackend() {
    fetch("https://firstp-api.onrender.com/api/settings")
        .then(res => res.ok ? res.json() : Promise.reject("Error al obtener configuración"))
        .then(data => {
            const logoFinal = data?.logo && data.logo.startsWith("data:image/")
                ? data.logo
                : "static/img/SS.png";

            // localStorage.setItem("logoGuardado", logoFinal);

            ["navbar-logo", "footer-logo", "logo-preview"].forEach(id => {
                const img = document.getElementById(id);
                if (img) {
                    img.src = logoFinal;
                    img.alt = "Logo dinámico";
                }
            });
        })
        .catch(err => {
            console.error("No se pudo aplicar el logo:", err);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    aplicarTemaGuardado();         // Tema desde backend
    aplicarMarcaDesdeBackend();    // Marca desde backend
    aplicarLogoDesdeBackend();     // Logo desde backend
});
