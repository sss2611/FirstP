window.addEventListener("DOMContentLoaded", () => {
  fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;
    });

  fetch("footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });
});

window.addEventListener("DOMContentLoaded", () => {
  fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;
    });

  fetch("footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });
});

// Fuera del bloque, así se puede ejecutar cuando el botón se clickea
function finalizarPedido() {
  // ... contenido de la función que genera el ticket ...
}


function enviarPorWhatsApp(pdfBase64) {
  const telefonoDueño = "549XXXXXXXXXX";
  const mensaje = `Hola! Te envío el pedido en PDF`;
  const link = `https://wa.me/${telefonoDueño}?text=${encodeURIComponent(mensaje)}`;
  window.open(link, "_blank");
}

