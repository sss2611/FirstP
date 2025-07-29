const API_URL = "https://firstp-api.onrender.com/api";

// 📁 Guardar tema seleccionado (desde click en .theme-item)
async function saveConfig(theme) {
    const spinner = document.getElementById("spinner");
    const buttonText = document.getElementById("button-text");

    spinner.classList.remove("d-none");
    buttonText.textContent = "Guardando...";

    try {
        const res = await fetch(`${API_URL}/settings`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ theme })
        });

        if (!res.ok) throw new Error("No se pudo guardar el tema");

        await res.json();
        Swal.fire("Guardado", `Tema "${theme}" actualizado correctamente`, "success");
    } catch (error) {
        console.error("Error al guardar tema:", error.message);
        Swal.fire("Error", "No se pudo guardar el tema", "error");
    } finally {
        spinner.classList.add("d-none");
        buttonText.textContent = "Guardar configuración";
    }
}

// 🎯 Asignar clic a cada opción de tema
document.querySelectorAll('.theme-item').forEach(item => {
    item.addEventListener('click', () => {
        const selectedTheme = item.textContent.trim();
        saveConfig(selectedTheme);
    });
});

// 🏷️ Guardar nombre de marca
async function guardarMarca() {
    const marca = document.getElementById("theme-input").value.trim();

    if (!marca) {
        Swal.fire("Oops", "Debe ingresar un nombre para la marca", "warning");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/settings`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ marca })
        });

        if (!res.ok) throw new Error("No se pudo guardar la marca");

        await res.json();
        Swal.fire("Guardado", "Nombre de marca actualizado", "success");
        document.getElementById("nombre-marca").textContent = marca;
    } catch (error) {
        console.error("Error al guardar marca:", error.message);
        Swal.fire("Error", "No se pudo guardar la marca", "error");
    }
}

// 🖼️ Guardar logo como imagen base64
async function guardarLogo() {
    const input = document.getElementById("logo-input");
    const file = input.files[0];

    if (!file) {
        Swal.fire("Oops", "Seleccioná una imagen para el logo", "warning");
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (e) {
        const logoBase64 = e.target.result;

        try {
            const res = await fetch(`${API_URL}/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ logo: logoBase64 })
            });

            if (!res.ok) throw new Error("No se pudo guardar el logo");

            await res.json();
            Swal.fire("Guardado", "Logo actualizado con éxito", "success");
            document.getElementById("logo-preview").src = logoBase64;
            document.getElementById("logo-preview").style.display = "block";
        } catch (error) {
            console.error("Error al guardar logo:", error.message);
            Swal.fire("Error", "No se pudo guardar el logo", "error");
        }
    };

    reader.readAsDataURL(file);
}
