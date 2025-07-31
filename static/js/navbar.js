document.addEventListener("DOMContentLoaded", () => {
    const loadComponent = (id, url, callback) => {
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}: ${url}`);
                return res.text();
            })
            .then(html => {
                document.getElementById(id).innerHTML = html;
                if (callback) callback(); // Se llama después de insertar el componente
            })
            .catch(err => console.error("Falló carga de componente:", err));
    };

    // ✅ Cargar navbar con correcciones
    loadComponent("navbar", "/components/navbar.html", () => {
        // Mostrar nombre personalizado si existe
        const marca = localStorage.getItem("nombreMarca") || localStorage.getItem("selectedMarca");

        const lugaresMarca = document.querySelectorAll("#nombre-marca");
        if (marca && lugaresMarca.length > 0) {
            lugaresMarca.forEach(el => {
                el.textContent = marca;
            });
        }

        // ✅ Reemplazar el logo si fue guardado previamente
        const logoGuardado = localStorage.getItem("logoGuardado");
        const logoNavbar = document.getElementById("navbar-logo");
        if (logoGuardado && logoNavbar) {
            logoNavbar.src = logoGuardado;
        }

        // Mostrar/ocultar botón de cierre de sesión
        const salirItem = document.getElementById("salir-item");
        const cerrarSesionBtn = document.getElementById("cerrar-sesion");
        const currentPage = window.location.pathname;
        const sesionActiva = localStorage.getItem("logueado") === "true";

        if (salirItem) {
            salirItem.style.display = sesionActiva ? "block" : "none";
        }

        // ✅ Lógica del logo-link según sesión y página actual
        const logoLink = document.getElementById("logo-link");
        if (logoLink) {
            if (currentPage.includes("index.html")) {
                logoLink.href = sesionActiva ? "/src/dashboard.html" : "/src/login.html";
            } else {
                logoLink.href = "/index.html";
            }
        }

        // ✅ Cierre de sesión con SweetAlert2
        if (cerrarSesionBtn) {
            cerrarSesionBtn.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("logueado");

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
    loadComponent("footer", "/components/footer.html", () => {
        setTimeout(() => {
            aplicarLogo("footer-logo");
            aplicarLogo("logo-preview");
        }, 100);
    });
});
