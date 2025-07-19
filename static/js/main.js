document.addEventListener("DOMContentLoaded", () => {
  // Función para cargar componentes
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

  // Cargar navbar
  loadComponent("navbar", "/components/navbar.html");

  // Cargar footer y luego activar el botón flotante
  loadComponent("footer", "/components/footer.html", () => {
    const finalizarBtn = document.getElementById("btn-finalizar");
    const agregarBtns = document.querySelectorAll(".btn-success");

    if (!finalizarBtn) {
      console.warn("No se encontró el botón #btn-finalizar.");
      return;
    }

    // Mostrar botón al agregar un producto
    agregarBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        finalizarBtn.style.display = "block";
      });
    });

    // Al hacer clic en "Finalizar compra"
    finalizarBtn.addEventListener("click", () => {
      const productos = [
        { nombre: "Producto 1", precio: 1500, inputId: "cantidad-1" },
        { nombre: "Producto 2", precio: 1500, inputId: "cantidad-2" },
        { nombre: "Producto 3", precio: 1500, inputId: "cantidad-3" },
        { nombre: "Producto 4", precio: 1500, inputId: "cantidad-4" },
        { nombre: "Producto 5", precio: 1500, inputId: "cantidad-5" },
        { nombre: "Producto 6", precio: 1500, inputId: "cantidad-6" }
      ];

      let html = '';
      let totalGeneral = 0;
      const productosElegidos = [];

      productos.forEach((p, i) => {
        const input = document.getElementById(p.inputId);
        const cantidad = parseInt(input?.value) || 0;
        if (cantidad > 0) {
          const total = cantidad * p.precio;
          totalGeneral += total;
          productosElegidos.push({ ...p, cantidad, index: i });
          html += `
            <div style="text-align:left; margin-bottom:10px;">
              <strong>${p.nombre}</strong><br>
              Precio: $${p.precio}<br>
              Cantidad: <input id="edit-${i}" type="number" min="1" value="${cantidad}" style="width:60px;" /><br>
              Total: $<span id="total-${i}">${total}</span>
            </div>
            <hr />
          `;
        }
      });

      if (productosElegidos.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Carrito vacío",
          text: "No hay productos seleccionados.",
          confirmButtonText: "Entendido"
        });
        return;
      }

      html += `<div style="text-align:right; font-size:1.1rem;">
                 <strong>Total general:</strong> $<span id="total-general">${totalGeneral}</span>
               </div>`;

      Swal.fire({
        title: "Resumen de compra",
        html: html,
        confirmButtonText: "Continuar",
        showDenyButton: true,
        denyButtonText: "Vaciar carrito",
        showCloseButton: true,
        width: 600
      }).then(result => {
        if (result.isDenied) {
          productos.forEach(p => {
            const input = document.getElementById(p.inputId);
            if (input) input.value = 0;
          });
          finalizarBtn.style.display = "none";
          Swal.fire("Carrito vaciado", "Todos los productos fueron reiniciados.", "success");
        }
      });

      // Listeners para editar cantidades en tiempo real
      productosElegidos.forEach(p => {
        setTimeout(() => {
          const input = document.getElementById(`edit-${p.index}`);
          input?.addEventListener("input", () => {
            const nuevaCantidad = parseInt(input.value) || 0;
            const nuevoTotal = nuevaCantidad * p.precio;
            document.getElementById(`total-${p.index}`).textContent = nuevoTotal;

            // Recalcular total general
            let nuevoTotalGeneral = 0;
            productosElegidos.forEach(pe => {
              const cantidadEditada = parseInt(document.getElementById(`edit-${pe.index}`)?.value) || 0;
              nuevoTotalGeneral += cantidadEditada * pe.precio;
            });
            document.getElementById("total-general").textContent = nuevoTotalGeneral;
          });
        }, 300);
      });
    });
  });
});
