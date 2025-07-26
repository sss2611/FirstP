// Se adapta al tema elegido en el dashboard
const savedTheme = localStorage.getItem("selectedTheme");
const themeLink = document.getElementById("theme-link");

if (savedTheme && themeLink) {
  themeLink.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${savedTheme}/bootstrap.min.css`;
}