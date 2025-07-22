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

  // ✅ Cargar navbar y luego configurar elementos que dependen de él
  loadComponent("navbar", "/components/navbar.html", () => {
    const logoLink = document.getElementById("logo-link");
    const salirItem = document.getElementById("salir-item");
    const currentPage = window.location.pathname;

    if (logoLink) {
      if (currentPage.includes("index.html")) {
        logoLink.href = "/src/login.html";
      } else if (currentPage.includes("login.html") || currentPage.includes("dashboard.html")) {
        logoLink.href = "/index.html";
      } else {
        logoLink.href = "/src/login.html";
      }
    }

    // ✅ Ocultar "Salir" si no estás en dashboard.html
    if (salirItem && !currentPage.includes("dashboard.html")) {
      salirItem.style.display = "none";
    }
  });

  // Cargar footer sin lógica adicional
  loadComponent("footer", "/components/footer.html");
});


//boton flotante
document.addEventListener("DOMContentLoaded", () => {
  const carrito = {};
  const finalizarBtn = document.getElementById("btn-finalizar");

  // Detecta clic en cualquier botón agregar-carrito
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("agregar-carrito")) {
      const btn = e.target;
      const id = btn.dataset.id;
      const nombre = btn.dataset.producto;
      const precio = parseFloat(btn.dataset.precio);
      const inputId = btn.dataset.input;
      const input = document.getElementById(inputId);
      const cantidad = parseInt(input?.value) || 0;

      if (cantidad > 0) {
        carrito[id] = { id, nombre, precio, cantidad, inputId };
        btn.textContent = "Agregado";
        btn.disabled = true;
        btn.classList.remove("btn-success");
        btn.classList.add("btn-secondary");
        finalizarBtn.style.display = "block";
      } else {
        Swal.fire("Seleccioná una cantidad válida", "", "warning");
      }
    }
  });

  // Finalizar compra
  finalizarBtn.addEventListener("click", () => {
    const productosElegidos = Object.values(carrito);
    if (productosElegidos.length === 0) {
      Swal.fire("Carrito vacío", "No hay productos agregados.", "info");
      return;
    }

    let html = '';
    let totalGeneral = 0;

    productosElegidos.forEach((p, i) => {
      const total = p.precio * p.cantidad;
      totalGeneral += total;

      html += `
        <div style="text-align:left; margin-bottom:10px;">
          <strong>${p.nombre}</strong><br>
          Precio: $${p.precio}<br>
          Cantidad: <input id="edit-${i}" type="number" min="1" value="${p.cantidad}" style="width:60px;" /><br>
          Total: $<span id="total-${i}">${total}</span>
        </div><hr />
      `;
    });

    html += `<div style="text-align:right; font-size:1.1rem;">
      <strong>Total general:</strong> $<span id="total-general">${totalGeneral}</span>
    </div>`;

    Swal.fire({
      title: "Resumen de compra",
      html,
      confirmButtonText: "Enviar Pedido",
      showDenyButton: true,
      denyButtonText: "Vaciar carrito",
      showCloseButton: true,
      width: 600
    }).then(result => {
      if (result.isDenied) {
        productosElegidos.forEach((p) => {
          const input = document.getElementById(p.inputId);
          const btn = document.querySelector(`[data-id="${p.id}"]`);
          if (input) input.value = 0;
          if (btn) {
            btn.textContent = "Agregar al carrito";
            btn.disabled = false;
            btn.classList.remove("btn-secondary");
            btn.classList.add("btn-success");
          }
        });

        Object.keys(carrito).forEach(k => delete carrito[k]);
        finalizarBtn.style.display = "none";
        Swal.fire("Carrito vaciado", "", "success");
        return;
      }

      if (result.isConfirmed) {
        Swal.fire({
          title: "Datos del comprador",
          html: `
            <input id="nombre" class="swal2-input" placeholder="Nombre" />
            <input id="apellido" class="swal2-input" placeholder="Apellido" />
            <select id="ubicacion" class="swal2-input">
              <option value="" disabled selected>Ubicación</option>
              <option value="Santiago del Estero">Sgo</option>
              <option value="La Banda">Banda</option>
            </select>
            <select id="pago" class="swal2-input">
              <option value="" disabled selected>Forma de pago</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
              <option value="Efectivo">Efectivo</option>
            </select>
          `,
          confirmButtonText: "Confirmar",
          focusConfirm: false,
          preConfirm: () => {
            const nombre = document.getElementById("nombre").value.trim();
            const apellido = document.getElementById("apellido").value.trim();
            const ubicacion = document.getElementById("ubicacion").value;
            const pago = document.getElementById("pago").value;

            if (!nombre || !apellido || !ubicacion || !pago) {
              Swal.showValidationMessage("Todos los campos son obligatorios");
              return false;
            }

            return { nombre, apellido, ubicacion, pago };
          }
        }).then((datos) => {
          if (!datos.isConfirmed) return;

          const cliente = datos.value;
          const mensaje = encodeURIComponent(
            `👤 Pedido de ${cliente.nombre} ${cliente.apellido}\n` +
            `📍 Ubicación: ${cliente.ubicacion}\n` +
            `💳 Forma de pago: ${cliente.pago}\n` +
            productosElegidos.map(p => `🛒 ${p.cantidad} x ${p.nombre} ($${p.precio * p.cantidad})`).join('\n') +
            `\n\n💵 Total: $${productosElegidos.reduce((t, p) => t + p.precio * p.cantidad, 0)}`
          );

          Swal.fire({
            title: "Pedido confirmado",
            html: `
              <p>Gracias por tu compra, <strong>${cliente.nombre}</strong> 💙</p>
              <p>Te redireccionamos a nuestro WhatsApp para finalizar el pedido ✅</p>
            `,
            icon: "success",
            timer: 3000,
            showConfirmButton: false
          }).then(() => {
            window.location.href = `https://wa.me/543854208162?text=${mensaje}`;
          });
        });

        // Actualiza dinámicamente cantidades y totales
        productosElegidos.forEach((p, i) => {
          setTimeout(() => {
            const input = document.getElementById(`edit-${i}`);
            input?.addEventListener("input", () => {
              const nuevaCantidad = parseInt(input.value) || 0;
              const nuevoTotal = nuevaCantidad * p.precio;
              document.getElementById(`total-${i}`).textContent = nuevoTotal;
              carrito[p.id].cantidad = nuevaCantidad;

              let nuevoTotalGeneral = 0;
              productosElegidos.forEach((pe, j) => {
                const cant = parseInt(document.getElementById(`edit-${j}`)?.value) || 0;
                nuevoTotalGeneral += cant * pe.precio;
              });

              document.getElementById("total-general").textContent = nuevoTotalGeneral;
            });
          }, 300);
        });
      }
    });
  });
});
