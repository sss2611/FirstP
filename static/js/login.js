document.addEventListener("DOMContentLoaded", () => {
  // 👁️ Mostrar/ocultar contraseña
  const toggleBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  toggleBtn.addEventListener("click", () => {
    const visible = passwordInput.type === "text";
    passwordInput.type = visible ? "password" : "text";
    toggleBtn.textContent = visible ? "👁️" : "🙈";
  });

  // 🔐 Validar formulario de login y mantener sesión
  const loginForm = document.querySelector("form");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const usuarioValido = "admin";
    const contraseñaValida = "1234";

    if (username === usuarioValido && password === contraseñaValida) {
      // ✅ Guardar sesión activa
      localStorage.setItem("logueado", "true");

      Swal.fire({
        icon: "success",
        title: "Ingreso exitoso",
        text: "Redireccionando al panel...",
        timer: 1000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "/src/dashboard.html";
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Datos incorrectos",
        text: "Verificá tu usuario o contraseña"
      });
    }
  });
});
