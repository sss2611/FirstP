// function aplicarTema(nombreTema) {
//     const themeLink = document.getElementById("theme-link");
//     if (themeLink) {
//         themeLink.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${nombreTema}/bootstrap.min.css`;
//     }
// }

// function aplicarTemaDesdeLocalStorage() {
//     const temaLocal = localStorage.getItem("selectedTheme");
//     if (temaLocal) {
//         aplicarTema(temaLocal);
//         document.body.classList.add(temaLocal);
//         console.log("Tema aplicado:", temaLocal);
//     } else {
//         aplicarTemaGuardado();
//     }
// }

// async function aplicarTemaGuardado() {
//     try {
//         const res = await fetch("https://firstp-api.onrender.com/api/settings");
//         const config = await res.json();
//         if (config?.theme) {
//             aplicarTema(config.theme);
//             document.getElementById("theme-selector").value = config.theme;
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
//         const res = await fetch("https://firstp-api.onrender.com/api/settings", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ theme: selectedTheme })
//         });

//         if (!res.ok) throw new Error("Error al guardar");

//         const data = await res.json();
//         console.log("Tema guardado:", data);
//         localStorage.setItem("selectedTheme", selectedTheme);

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



// function guardarMarca() {
//     const marca = document.getElementById("theme-input")?.value;
//     if (!marca) return;

//     localStorage.setItem("selectedMarca", marca);

//     fetch("https://firstp-api.onrender.com/api/settings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ marca })
//     })
//         .then(res => {
//             if (!res.ok) throw new Error("Error al guardar la marca");
//             return res.json();
//         })
//         .then(data => {
//             console.log("Marca guardada:", data);
//             Swal.fire({
//                 icon: "success",
//                 title: "Nombre guardado",
//                 timer: 1500,
//                 showConfirmButton: false
//             }).then(() => window.location.reload());
//         })
//         .catch(error => {
//             console.error("Error al guardar la marca:", error);
//             Swal.fire({ icon: "error", title: "No se pudo guardar la marca" });
//         });
// }

// function aplicarMarca(id) {
//     const marca = localStorage.getItem("selectedMarca");
//     const target = document.getElementById(id);

//     if (marca && target) {
//         target.textContent = marca;
//     } else {
//         fetch("https://firstp-api.onrender.com/api/settings")
//             .then(res => res.json())
//             .then(config => {
//                 if (config?.marca && target) {
//                     target.textContent = config.marca;
//                 }
//             })
//             .catch(err => console.error("No se pudo cargar la marca:", err));
//     }
// }



// function guardarLogo() {
//     const input = document.getElementById("logo-input");
//     const file = input?.files[0];

//     if (!file) {
//         Swal.fire({ icon: "error", title: "Selecciona un logo primero" });
//         return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//         const logoBase64 = reader.result;

//         // Vista previa
//         document.getElementById("logo-preview").src = logoBase64;

//         fetch("https://firstp-api.onrender.com/api/settings", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ logo: logoBase64 })
//         })
//             .then(res => res.ok ? res.json() : Promise.reject("Error al guardar logo"))
//             .then(data => {
//                 console.log("Logo guardado:", data);
//                 localStorage.setItem("logoGuardado", logoBase64);

//                 Swal.fire({
//                     icon: "success",
//                     title: "Logo actualizado",
//                     timer: 1500,
//                     showConfirmButton: false
//                 }).then(() => {
//                     window.location.reload();
//                 });
//             })
//             .catch(err => {
//                 console.error(err);
//                 Swal.fire({ icon: "error", title: "Falló el guardado" });
//             });
//     };

//     reader.readAsDataURL(file);
// }

// function aplicarLogo(id) {
//     const logoBase64 = localStorage.getItem("logoGuardado");
//     const img = document.getElementById(id);

//     if (logoBase64 && img) {
//         img.src = logoBase64;
//         img.alt = "Logo dinámico";
//     }
// }

// function obtenerLogoDelBackend() {
//     fetch("https://firstp-api.onrender.com/api/settings")
//         .then(res => res.ok ? res.json() : Promise.reject("Error al obtener configuración"))
//         .then(data => {
//             if (data.logo) {
//                 localStorage.setItem("logoGuardado", data.logo);
//                 aplicarLogo("footer-logo");
//                 aplicarLogo("navbar-logo");
//                 aplicarLogo("logo-preview");
//             }
//         })
//         .catch(err => console.error("No se pudo obtener el logo:", err));
// }


// document.addEventListener("DOMContentLoaded", () => {
//     aplicarTemaDesdeLocalStorage();
//     aplicarMarca("marca-display");
//     aplicarMarca("nombre-marca");

//     obtenerLogoDelBackend(); 
// });

// TEMAS
function aplicarTema(nombreTema) {
    const themeLink = document.getElementById("theme-link");
    if (themeLink) {
        themeLink.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${nombreTema}/bootstrap.min.css`;
        document.body.classList.add(nombreTema);
    }
    sessionStorage.setItem("currentTheme", nombreTema);
}

async function aplicarTemaInteligente() {
    const temaSesion = sessionStorage.getItem("currentTheme");

    if (temaSesion) {
        aplicarTema(temaSesion);
        document.getElementById("theme-selector").value = temaSesion;
        console.log("Tema desde sesión:", temaSesion);
        return;
    }

    try {
        const res = await fetch("https://firstp-api.onrender.com/api/settings");
        const config = await res.json();

        const temaDesdeBack = config?.theme || "lux"; // Usar 'lux' si no hay tema guardado

        aplicarTema(temaDesdeBack);
        document.getElementById("theme-selector").value = temaDesdeBack;
        console.log("Tema desde backend (o lux):", temaDesdeBack);
    } catch (error) {
        console.error("Error al aplicar tema:", error);
        aplicarTema("lux"); // Fallback si falla todo
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
        console.log("Tema guardado en backend:", data);

        Swal.fire({
            icon: "success",
            title: "Configuración guardada",
            timer: 1500,
            showConfirmButton: false
        });
    } catch (error) {
        console.error("Error al guardar configuración:", error);
        Swal.fire({ icon: "error", title: "Error al guardar la configuración" });
    } finally {
        spinner?.classList.add("d-none");
        if (buttonText) buttonText.textContent = "Guardar configuración";
    }
}

// MARCA
function guardarMarca() {
    const marca = document.getElementById("theme-input")?.value;
    if (!marca) return;

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
    const target = document.getElementById(id);
    fetch("https://firstp-api.onrender.com/api/settings")
        .then(res => res.json())
        .then(config => {
            const marca = config?.marca || "FirstP";
            if (target) target.textContent = marca;
        })
        .catch(err => {
            console.error("No se pudo cargar la marca:", err);
            if (target) target.textContent = "FirstP";
        });
}


// LOGO
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

        document.getElementById("logo-preview").src = logoBase64;

        fetch("https://firstp-api.onrender.com/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ logo: logoBase64 })
        })
            .then(res => res.ok ? res.json() : Promise.reject("Error al guardar logo"))
            .then(data => {
                console.log("Logo guardado:", data);

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

function aplicarLogo(id, base64) {
    const img = document.getElementById(id);
    if (base64 && img) {
        img.src = base64;
        img.alt = "Logo dinámico";
    }
}

function obtenerLogoDelBackend() {
    const defaultLogo = "static/img/SS.png";

    fetch("https://firstp-api.onrender.com/api/settings")
        .then(res => res.ok ? res.json() : Promise.reject("Error al obtener configuración"))
        .then(data => {
            const logo = data.logo || defaultLogo;
            aplicarLogo("footer-logo", logo);
            aplicarLogo("navbar-logo", logo);
            aplicarLogo("logo-preview", logo);
        })
        .catch(err => {
            console.error("No se pudo obtener el logo:", err);
            aplicarLogo("footer-logo", defaultLogo);
            aplicarLogo("navbar-logo", defaultLogo);
            aplicarLogo("logo-preview", defaultLogo);
        });
}



// INIT
document.addEventListener("DOMContentLoaded", () => {
    aplicarTemaInteligente();
    aplicarMarca("marca-display");
    aplicarMarca("nombre-marca");
    obtenerLogoDelBackend();
});
