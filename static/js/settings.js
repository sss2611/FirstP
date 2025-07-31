// const API_URL = "https://firstp-api-production.up.railway.app/api";


// function aplicarTema(nombreTema) {
//     const themeLink = document.getElementById("theme-link");
//     if (themeLink) {
//         themeLink.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${nombreTema}/bootstrap.min.css`;
//     }
// }

// async function aplicarTemaGuardado() {
//     try {
//         const res = await fetch(`${API_URL}/settings`)
//         const config = await res.json();
//         if (config?.theme) {
//             aplicarTema(config.theme);
//             document.getElementById("theme-selector").value = config.theme;
//             sessionStorage.setItem("configTheme", config.theme);
//         }
//     } catch (error) {
//         console.error("No se pudo aplicar el tema guardado:", error);
//     }
// }

// document.getElementById("theme-selector")?.addEventListener("change", function () {
//     const selectedTheme = this.value;
//     aplicarTema(selectedTheme);
// });


// async function saveConfig() {
//     const selectedTheme = document.getElementById("theme-selector").value;
//     const spinner = document.getElementById("spinner");
//     const buttonText = document.getElementById("button-text");

//     spinner?.classList.remove("d-none");
//     if (buttonText) buttonText.textContent = "Guardando...";

//     try {
//         const currentRes = await fetch(`${API_URL}/settings`);
//         const currentConfig = await currentRes.json();
//         const updatedConfig = { ...currentConfig, theme: selectedTheme };
//         const saveRes = await fetch(`${API_URL}/settings`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(updatedConfig)
//         });

//         if (!saveRes.ok) throw new Error("Error al guardar");

//         const data = await saveRes.json();
//         console.log("Tema guardado:", data);

//         Swal.fire({
//             icon: "success",
//             title: "Configuración guardada",
//             timer: 1500,
//             showConfirmButton: false
//         });
//     } catch (error) {
//         console.error("Error en la solicitud:", error);
//         Swal.fire({ icon: "error", title: "Error al guardar la configuración" });
//     } finally {
//         spinner?.classList.add("d-none");
//         if (buttonText) buttonText.textContent = "Guardar configuración";
//     }
// }

// async function guardarMarca() {
//     const marca = document.getElementById("theme-input")?.value;
//     if (!marca) return;

//     try {
//         const res = await fetch(`${API_URL}/settings`);
//         const config = await res.json();

//         const updatedConfig = { ...config, marca };

//         const saveRes = await fetch(`${API_URL}/settings`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(updatedConfig)
//         });

//         if (!saveRes.ok) throw new Error("Error al guardar la marca");

//         const data = await saveRes.json();
//         console.log("Marca guardada:", data);

//         Swal.fire({
//             icon: "success",
//             title: "Nombre guardado",
//             timer: 1500,
//             showConfirmButton: false
//         }).then(() => window.location.reload());
//     } catch (error) {
//         console.error("Error al guardar la marca:", error);
//         Swal.fire({ icon: "error", title: "No se pudo guardar la marca" });
//     }
// }


// function aplicarMarca(id) {
//     const target = document.getElementById(id);

//     if (marca && target) {
//         target.textContent = marca;
//     } else {
//         fetch(`${API_URL}/settings`)
//             .then(res => res.json())
//             .then(config => {
//                 if (config?.marca && target) {
//                     target.textContent = config.marca;
//                 }
//             })
//             .catch(err => console.error("No se pudo cargar la marca:", err));
//     }
// }

// // CLOUDINARY
// async function uploadToCloudinary(file) {
//     const url = 'https://api.cloudinary.com/v1_1/dhuxbiud1/image/upload';
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', '<tu-upload-preset>');

//     try {
//         const res = await fetch(url, { method: 'POST', body: formData });
//         const data = await res.json();
//         return data.secure_url; 
//     } catch (err) {
//         console.error('Error al subir a Cloudinary:', err);
//         return null;
//     }
// }

// async function guardarLogo() {
//     const input = document.getElementById("logo-input");
//     const file = input?.files[0];

//     if (!file) {
//         Swal.fire({ icon: "error", title: "Selecciona un logo primero" });
//         return;
//     }

//     const cloudinaryUrl = await uploadToCloudinary(file);

//     if (!cloudinaryUrl) {
//         Swal.fire({ icon: "error", title: "Falló la subida a Cloudinary" });
//         return;
//     }

//     document.getElementById("logo-preview").src = cloudinaryUrl;

//     try {
//         const currentRes = awaitfetch(`${API_URL}/settings`);
//         const currentConfig = await currentRes.json();
//         const updatedConfig = { ...currentConfig, logo: cloudinaryUrl };

//         const saveRes = await fetch(`${API_URL}/settings`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(updatedConfig)
//         });

//         if (!saveRes.ok) throw new Error("Error al guardar logo");
//         Swal.fire({ icon: "success", title: "Logo actualizado", timer: 1500, showConfirmButton: false });

//     } catch (err) {
//         console.error(err);
//         Swal.fire({ icon: "error", title: "Falló el guardado del logo" });
//     }
// }


// function aplicarLogo(id) {
//     const img = document.getElementById(id);

//     if (img) {
//         img.src = logoBase64;
//         img.alt = "Logo dinámico";
//     } else {
//         console.warn(`No se encontró el elemento con ID ${id} para aplicar el logo`);
//     }
// }

// function obtenerLogoDelBackend() {
//         fetch(`${API_URL}/settings`)
//         .then(res => res.ok ? res.json() : Promise.reject("Error al obtener configuración"))
//         .then(data => {
//             if (data.logo) {
//                 aplicarLogo("footer-logo");
//                 aplicarLogo("navbar-logo");
//                 aplicarLogo("logo-preview");
//             }
//         })
//         .catch(err => console.error("No se pudo obtener el logo:", err));
// }

// function aplicarMarcaDesdeBackend() {
//     fetch(`${API_URL}/settings`)
//         .then(res => res.ok ? res.json() : Promise.reject("Error al obtener la marca"))
//         .then(config => {
//             const marcaFinal = config?.marca || "FirstP";
//             document.querySelectorAll("#nombre-marca, #marca-display").forEach(el => {
//                 el.textContent = marcaFinal;
//             });
//             sessionStorage.setItem("configMarca", marcaFinal);
//         })
//         .catch(err => {
//             console.error("No se pudo cargar la marca:", err);
//         });
// }

// function aplicarLogoDesdeBackend() {
//     fetch(`${API_URL}/settings`)
//         .then(res => res.ok ? res.json() : Promise.reject("Error al obtener configuración"))
//         .then(data => {
//             const logoFinal = data?.logo && data.logo.startsWith("data:image/")
//                 ? data.logo
//                 : "static/img/SS.png";

//             ["navbar-logo", "footer-logo", "logo-preview"].forEach(id => {
//                 const img = document.getElementById(id);
//                 if (img) {
//                     img.src = logoFinal;
//                     img.alt = "Logo dinámico";
//                 }
//             });

//             sessionStorage.setItem("configLogo", logoFinal);
//         })
//         .catch(err => {
//             console.error("No se pudo aplicar el logo:", err);
//         });
// }

// function aplicarTemaDesdeSession() {
//     const tema = sessionStorage.getItem("configTheme");
//     if (tema) {
//         aplicarTema(tema);
//         document.getElementById("theme-selector").value = tema;
//     }
// }

// function aplicarMarcaDesdeSession() {
//     const marca = sessionStorage.getItem("configMarca");
//     if (marca) {
//         document.querySelectorAll("#nombre-marca, #marca-display").forEach(el => {
//             el.textContent = marca;
//         });
//     }
// }

// function aplicarLogoDesdeSession() {
//     const logo = sessionStorage.getItem("configLogo") || "static/img/SS.png";
//     ["navbar-logo", "footer-logo", "logo-preview"].forEach(id => {
//         const img = document.getElementById(id);
//         if (img) {
//             img.src = logo;
//             img.alt = "Logo dinámico";
//         }
//     });
// }

// function resetSessionConfig() {
//     sessionStorage.removeItem("configLogo");
//     sessionStorage.removeItem("configMarca");
//     sessionStorage.removeItem("configTheme");
// }
// //     aplicarTemaGuardado();         // Tema desde backend
// //     aplicarMarcaDesdeBackend();    // Marca desde backend
// //     aplicarLogoDesdeBackend();     // Logo desde backend
// // });

// document.addEventListener("DOMContentLoaded", () => {
//     aplicarTemaDesdeSession();
//     aplicarMarcaDesdeSession();
//     aplicarLogoDesdeSession();

//     aplicarTemaGuardado();
//     aplicarMarcaDesdeBackend();
//     aplicarLogoDesdeBackend();
// });

const API_URL = "https://firstp-api-production.up.railway.app/api";

// 🎨 Aplicar tema con CDN Bootswatch
function aplicarTema(nombreTema) {
    const themeLink = document.getElementById("theme-link");
    if (themeLink) {
        themeLink.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${nombreTema}/bootstrap.min.css`;
    }
}

// 🖼️ Aplicar logo en elementos por ID
function aplicarLogoEn(id, url) {
    const img = document.getElementById(id);
    if (img) {
        img.src = url;
        img.alt = "Logo dinámico";
    }
}

// 💬 Aplicar marca en elementos por selector
function aplicarMarcaEn(selector, texto) {
    document.querySelectorAll(selector).forEach(el => el.textContent = texto);
}

// 🔁 Aplicar toda la configuración desde backend
async function aplicarConfiguracion() {
    try {
        const res = await fetch(`${API_URL}/settings/full`);
        if (!res.ok) throw new Error("Error obteniendo configuración");

        const { theme, logo, marca } = await res.json();

        aplicarTema(theme);
        aplicarLogoEn("navbar-logo", logo);
        aplicarLogoEn("footer-logo", logo);
        aplicarLogoEn("logo-preview", logo);
        aplicarMarcaEn("#nombre-marca, #marca-display", marca);

        // Guardar en sesión
        sessionStorage.setItem("configTheme", theme);
        sessionStorage.setItem("configLogo", logo);
        sessionStorage.setItem("configMarca", marca);

        document.getElementById("theme-selector").value = theme;
    } catch (err) {
        console.error("Error aplicando configuración:", err);
    }
}

// 🌙 Cargar desde sessionStorage si existe
function aplicarDesdeSession() {
    const theme = sessionStorage.getItem("configTheme");
    const logo = sessionStorage.getItem("configLogo");
    const marca = sessionStorage.getItem("configMarca");

    if (theme) {
        aplicarTema(theme);
        document.getElementById("theme-selector").value = theme;
    }
    if (logo) {
        ["navbar-logo", "footer-logo", "logo-preview"].forEach(id => aplicarLogoEn(id, logo));
    }
    if (marca) {
        aplicarMarcaEn("#nombre-marca, #marca-display", marca);
    }
}

// 🎛️ Guardar tema
async function saveConfig() {
    const selectedTheme = document.getElementById("theme-selector").value;
    const spinner = document.getElementById("spinner");
    const buttonText = document.getElementById("button-text");

    spinner?.classList.remove("d-none");
    if (buttonText) buttonText.textContent = "Guardando...";

    try {
        const res = await fetch(`${API_URL}/settings`);
        const currentConfig = await res.json();
        const updatedConfig = { ...currentConfig, theme: selectedTheme };

        const saveRes = await fetch(`${API_URL}/settings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedConfig)
        });

        if (!saveRes.ok) throw new Error("Error al guardar");

        Swal.fire({
            icon: "success",
            title: "Tema guardado",
            timer: 1500,
            showConfirmButton: false
        });

        sessionStorage.setItem("configTheme", selectedTheme);
    } catch (error) {
        console.error("Error en la solicitud:", error);
        Swal.fire({ icon: "error", title: "No se pudo guardar el tema" });
    } finally {
        spinner?.classList.add("d-none");
        if (buttonText) buttonText.textContent = "Guardar configuración";
    }
}

// 📝 Guardar marca
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

        Swal.fire({
            icon: "success",
            title: "Marca guardada",
            timer: 1500,
            showConfirmButton: false
        }).then(() => window.location.reload());

        sessionStorage.setItem("configMarca", marca);
    } catch (error) {
        console.error("Error al guardar la marca:", error);
        Swal.fire({ icon: "error", title: "No se pudo guardar la marca" });
    }
}

// ☁️ Subida a Cloudinary
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

// 📷 Guardar logo
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

    aplicarLogoEn("logo-preview", cloudinaryUrl);

    try {
        const res = await fetch(`${API_URL}/settings`);
        const currentConfig = await res.json();
        const updatedConfig = { ...currentConfig, logo: cloudinaryUrl };

        const saveRes = await fetch(`${API_URL}/settings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedConfig)
        });

        if (!saveRes.ok) throw new Error("Error al guardar el logo");

        Swal.fire({ icon: "success", title: "Logo actualizado", timer: 1500, showConfirmButton: false });

        sessionStorage.setItem("configLogo", cloudinaryUrl);
    } catch (err) {
        console.error("Error al guardar logo:", err);
        Swal.fire({ icon: "error", title: "No se pudo guardar el logo" });
    }
}

// 🧹 Reiniciar configuración guardada
function resetSessionConfig() {
    sessionStorage.removeItem("configTheme");
    sessionStorage.removeItem("configLogo");
    sessionStorage.removeItem("configMarca");
}

// 🎬 Inicializar al cargar la vista
document.addEventListener("DOMContentLoaded", () => {
    aplicarDesdeSession();
    aplicarConfiguracion();
});

// 🎛️ Detectar cambios de tema
document.getElementById("theme-selector")?.addEventListener("change", function () {
    const selectedTheme = this.value;
    aplicarTema(selectedTheme);
});
