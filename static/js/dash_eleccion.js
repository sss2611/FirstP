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