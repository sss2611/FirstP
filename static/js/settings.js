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
