document.addEventListener("DOMContentLoaded", () => {
    const loadComponent = (id, url, callback) => {
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}: ${url}`);
                return res.text();
            })
            .then(html => {
                document.getElementById(id).innerHTML = html;
                if (callback) callback();
            })
            .catch(err => console.error("Falló carga de componente:", err));
    };

    // ✅ Cargar navbar con lógica personalizada
    loadComponent("navbar", "/components/navbar.html", () => {
        const marca = localStorage.getItem("nombreMarca");
        const lugaresMarca = document.querySelectorAll("#nombre-marca");
        if (marca) {
            lugaresMarca.forEach(el => {
                el.textContent = marca;
            });
        }

        const salirItem = document.getElementById("salir-item");
        const cerrarSesionBtn = document.getElementById("cerrar-sesion");
        const logoLink = document.getElementById("logo-link");

        const currentPage = window.location.pathname;
        const sesionActiva = localStorage.getItem("logueado") === "true";

        // ✅ Mostrar/ocultar botón "Cerrar sesión"
        if (salirItem) {
            salirItem.style.display = sesionActiva ? "block" : "none";
        }

        // ✅ Lógica del logo-link
        if (logoLink) {
            if (currentPage.includes("index.html")) {
                logoLink.href = sesionActiva ? "/src/dashboard.html" : "/src/login.html";
            } else {
                logoLink.href = "/index.html";
            }
        }

        // 🚪 Cerrar sesión con SweetAlert2
        if (cerrarSesionBtn) {
            cerrarSesionBtn.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("logueado"); // Solo eliminamos estado de sesión

                Swal.fire({
                    icon: "info",
                    title: "Sesión finalizada",
                    text: "Volviendo al login...",
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "/src/login.html";
                });
            });
        }

    });

    // ✅ Cargar footer normalmente
    loadComponent("footer", "/components/footer.html");
});
