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
  const botonesAgregar = document.querySelectorAll(".agregar-carrito");

  // Agregar productos al carrito
  botonesAgregar.forEach((btn) => {
    btn.addEventListener("click", () => {
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
    });
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
      }

      if (result.isConfirmed) {
        Swal.fire({
          title: "Datos del comprador",
          html: `
            <input id="nombre" class="swal2-input" placeholder="Nombre" />
            <input id="apellido" class="swal2-input" placeholder="Apellido" />
            <input id="whatsapp" class="swal2-input" placeholder="WhatsApp" />
          `,
          confirmButtonText: "Confirmar",
          focusConfirm: false,
          preConfirm: () => {
            const nombre = document.getElementById("nombre").value;
            const apellido = document.getElementById("apellido").value;
            const whatsapp = document.getElementById("whatsapp").value;

            if (!nombre || !apellido || !whatsapp) {
              Swal.showValidationMessage("Todos los campos son obligatorios");
              return false;
            }

            return { nombre, apellido, whatsapp };
          }
        }).then((datos) => {
          if (datos.isConfirmed) {
            console.log("Pedido enviado:", {
              cliente: datos.value,
              productos: productosElegidos
            });

            Swal.fire({
              title: "Pedido confirmado",
              html: `
                <p>Gracias por tu compra, <strong>${datos.value.nombre}</strong> 💙</p>
                <p>Te redireccionamos a nuestro WhatsApp para finalizar el pedido ✅</p>
              `,
              icon: "success",
              timer: 3000,
              showConfirmButton: false
            }).then(() => {
              const mensaje = encodeURIComponent(
                `Hola soy ${datos.value.nombre} ${datos.value.apellido}, quiero finalizar mi pedido:\n\n` +
                productosElegidos.map(p => `🛒 ${p.cantidad} x ${p.nombre} ($${p.precio})`).join('\n') +
                `\n\n📱 Mi número es: ${datos.value.whatsapp}`
              );

              window.location.href = `https://wa.me/543855075058?text=${mensaje}`;
            });
          }
        });
      }

      // Actualización dinámica de cantidades y totales
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
    });
  });
});


// Opcion de Enviar Pedido