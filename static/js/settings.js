const API_URL = "https://firstp-api-production.up.railway.app/api";

const temasDisponibles = ["flatly", "darkly", "litera", "cyborg", "sandstone", "sketchy", "lux", "united", "cosmo", "cerulean"];
const selector = document.getElementById("theme-selector");
temasDisponibles.forEach(t => {
    const option = document.createElement("option");
    option.value = t;
    option.textContent = t.charAt(0).toUpperCase() + t.slice(1);
    selector.appendChild(option);
});

function aplicarTema(nombreTema) {
    const themeLink = document.getElementById("theme-link");
    document.body.style.opacity = 0;
    setTimeout(() => {
        if (themeLink) {
            themeLink.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${nombreTema}/bootstrap.min.css`;
        }
        document.body.style.opacity = 1;
    }, 300);
}

async function saveConfig() {
    const selectedTheme = selector.value;
    const spinner = document.getElementById("spinner");
    const buttonText = document.getElementById("button-text");

    spinner?.classList.remove("d-none");
    if (buttonText) buttonText.textContent = "Guardando...";

    try {
        const currentRes = await fetch(`${API_URL}/settings`);
        const config = await currentRes.json();
        const updatedConfig = { ...config, theme: selectedTheme };

        const saveRes = await fetch(`${API_URL}/settings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedConfig)
        });
        if (!saveRes.ok) throw new Error("Error al guardar configuración");

        sessionStorage.setItem("configTheme", selectedTheme);
        location.reload();
    } catch (error) {
        console.error("Error al guardar el tema:", error);
        Swal.fire({ icon: "error", title: "No se pudo guardar el tema" });
    } finally {
        spinner?.classList.add("d-none");
        if (buttonText) buttonText.textContent = "Guardar configuración";
    }
}

async function aplicarTemaGuardado() {
    try {
        const res = await fetch(`${API_URL}/settings`);
        const { theme = "flatly" } = await res.json();
        aplicarTema(theme);
        selector.value = theme;
        sessionStorage.setItem("configTheme", theme);
    } catch (error) {
        console.error("No se pudo aplicar el tema guardado:", error);
    }
}

selector?.addEventListener("change", function () {
    aplicarTema(this.value);
});

async function guardarMarca() {
    const marca = document.getElementById("theme-input")?.value;
    if (!marca) return;

    try {
        const res = await fetch(`${API_URL}/settings`);
        const config = await res.json();
        const updatedConfig = { ...config, marca };

        const saveRes = await fetch(`${API_URL}/settings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedConfig)
        });
        if (!saveRes.ok) throw new Error("Error al guardar la marca");

        sessionStorage.setItem("configMarca", marca);
        location.reload();
    } catch (error) {
        console.error("Error al guardar la marca:", error);
        Swal.fire({ icon: "error", title: "No se pudo guardar el nombre" });
    }
}

async function uploadToCloudinary(file) {
    const url = 'https://api.cloudinary.com/v1_1/dhuxbiud1/image/upload';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'firstp');

    try {
        const res = await fetch(url, { method: 'POST', body: formData });
        const data = await res.json();
        return data.secure_url;
    } catch (err) {
        console.error('Error al subir a Cloudinary:', err);
        return null;
    }
}

async function guardarLogo() {
    const input = document.getElementById("logo-input");
    const file = input?.files[0];
    if (!file) {
        Swal.fire({ icon: "error", title: "Selecciona un logo primero" });
        return;
    }

    const cloudinaryUrl = await uploadToCloudinary(file);
    if (!cloudinaryUrl) {
        Swal.fire({ icon: "error", title: "Falló la subida a Cloudinary" });
        return;
    }

    document.getElementById("logo-preview").src = cloudinaryUrl;

    try {
        const currentRes = await fetch(`${API_URL}/settings`);
        const currentConfig = await currentRes.json();
        const updatedConfig = { ...currentConfig, logo: cloudinaryUrl };

        const saveRes = await fetch(`${API_URL}/settings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedConfig)
        });
        if (!saveRes.ok) throw new Error("Error al guardar el logo");

        sessionStorage.setItem("configLogo", cloudinaryUrl);
        location.reload();
    } catch (err) {
        console.error("Error al guardar el logo:", err);
        Swal.fire({ icon: "error", title: "No se pudo guardar el logo" });
    }
}

function aplicarMarcaDesdeBackend() {
    fetch(`${API_URL}/settings`)
        .then(res => res.ok ? res.json() : Promise.reject("Error al obtener marca"))
        .then(config => {
            const marcaFinal = config?.marca || "FirstP";
            document.querySelectorAll("#nombre-marca, #marca-display").forEach(el => {
                el.textContent = marcaFinal;
            });
            sessionStorage.setItem("configMarca", marcaFinal);
        })
        .catch(err => console.error("No se pudo aplicar la marca:", err));
}

function aplicarLogoDesdeBackend() {
    fetch(`${API_URL}/settings`)
        .then(res => res.ok ? res.json() : Promise.reject("Error al obtener configuración"))
        .then(data => {
            const logoFinal = data?.logo || "static/img/SS.png";
            ["navbar-logo", "footer-logo", "logo-preview"].forEach(id => {
                const img = document.getElementById(id);
                if (img) {
                    img.src = logoFinal;
                    img.alt = "Logo dinámico";
                }
            });
            sessionStorage.setItem("configLogo", logoFinal);
        })
        .catch(err => console.error("No se pudo aplicar el logo:", err));
}

function aplicarTemaDesdeSession() {
    const tema = sessionStorage.getItem("configTheme");
    if (tema) aplicarTema(tema);
}

function aplicarMarcaDesdeSession() {
    const marca = sessionStorage.getItem("configMarca");
    if (marca) {
        document.querySelectorAll("#nombre-marca, #marca-display").forEach(el => {
            el.textContent = marca;
        });
    }
}

function aplicarLogoDesdeSession() {
    const logo = sessionStorage.getItem("configLogo") || "static/img/SS.png";
    ["navbar-logo", "footer-logo", "logo-preview"].forEach(id => {
        const img = document.getElementById(id);
        if (img) {
            img.src = logo;
            img.alt = "Logo dinámico";
        }
    });
}

function resetSessionConfig() {
    sessionStorage.removeItem("configLogo");
    sessionStorage.removeItem("configMarca");
    sessionStorage.removeItem("configTheme");
}

document.addEventListener("DOMContentLoaded", () => {
    aplicarTemaDesdeSession();
    aplicarMarcaDesdeSession();
    aplicarLogoDesdeSession();

    aplicarTemaGuardado();
    aplicarMarcaDesdeBackend();
    aplicarLogoDesdeBackend();
});