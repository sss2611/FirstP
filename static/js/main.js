document.addEventListener("DOMContentLoaded", () => {
    const loadComponent = (id, url) => {
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}: ${url}`);
                return res.text();
            })
            .then(html => {
                document.getElementById(id).innerHTML = html;
            })
            .catch(err => console.error("Falló carga de componente:", err));
    };

    loadComponent("navbar", "/components/navbar.html");
    loadComponent("footer", "/components/footer.html");
});
