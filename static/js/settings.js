function aplicarTema(nombreTema) {
    const themeLink = document.getElementById("theme-link");
    themeLink.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${nombreTema}/bootstrap.min.css`;
}

document.getElementById("theme-selector").addEventListener("change", function () {
    const selectedTheme = this.value;
    aplicarTema(selectedTheme);
});
