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

//boton flotante
document.addEventListener("DOMContentLoaded", () => {
  const carrito = {}; // 📦 guarda cada producto por ID
  const finalizarBtn = document.getElementById("btn-finalizar");
  const botonesAgregar = document.querySelectorAll(".agregar-carrito");

  // 🟢 Al hacer clic en "Agregar al carrito"
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

  // 🟡 Finalizar compra → mostrar resumen de los productos agregados
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
      confirmButtonText: "Continuar",
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
    });

    // 🔄 Actualización dinámica dentro del modal
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
