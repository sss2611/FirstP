function finalizarPedido() {
  Swal.fire({
    title: 'Ingresá tus datos',
    html:
      '<input id="nombre" class="swal2-input" placeholder="Nombre">' +
      '<input id="apellido" class="swal2-input" placeholder="Apellido">' +
      '<input id="telefono" class="swal2-input" placeholder="WhatsApp (sin +54)">',
    confirmButtonText: 'Generar Ticket',
    focusConfirm: false,
    preConfirm: () => {
      const nombre = document.getElementById('nombre').value.trim();
      const apellido = document.getElementById('apellido').value.trim();
      let telefono = document.getElementById('telefono').value.trim();

      if (!nombre || !apellido || !telefono) {
        Swal.showValidationMessage('Todos los campos son obligatorios');
        return false;
      }

      // Retornamos los datos para usarlos en el .then()
      return { nombre, apellido, telefono };
    }
  }).then((result) => {
    if (!result.isConfirmed) return;

    const { nombre, apellido, telefono } = result.value;
    const numeroCompleto = `549${telefono.replace(/\D/g, '')}`;
    let ticket = `Cliente: ${nombre} ${apellido}\n\n`;
    let totalGlobal = 0;

    const productos = document.querySelectorAll('#catalogo .card');
    productos.forEach(card => {
      const nombreProducto = card.querySelector('.card-title').textContent;
      const precioUnitario = parseFloat(card.querySelector('.card-text').textContent.replace('$', '')) || 0;
      const checkbox = card.querySelector('input[type="checkbox"]');
      const cantidad = parseInt(card.querySelector('input[type="number"]').value) || 0;

      if (checkbox.checked && cantidad > 0) {
        const subtotal = precioUnitario * cantidad;
        totalGlobal += subtotal;
        ticket += `🛍️ ${nombreProducto} - Cantidad: ${cantidad} - Unitario: $${precioUnitario} - Total: $${subtotal}\n`;
      }
    });

    if (totalGlobal === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Ups',
        text: 'No seleccionaste productos con cantidad válida.'
      });
      return;
    }

    ticket += `\nTotal general: $${totalGlobal}`;

    Swal.fire({
      title: '🧾 Ticket generado',
      html: ticket.replace(/\n/g, '<br>'),
      icon: 'info',
      confirmButtonText: 'Enviar por WhatsApp'
    }).then(() => {
      const mensaje = encodeURIComponent(`Hola, soy ${nombre} ${apellido} y quiero realizar el siguiente pedido:\n\n${ticket}`);
      const url = `https://wa.me/${numeroCompleto}?text=${mensaje}`;
      window.open(url, '_blank');
    });
  });
}

