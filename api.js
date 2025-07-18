export function getProductos() {
  return productos;
}

export function actualizarProducto(id, data) {
  const index = productos.findIndex(p => p.id === id);
  productos[index] = { ...productos[index], ...data };
}

doc.text(`Cliente: ${nombre} ${apellido}`, 10, 10);
// Luego recorrer productos y agregar cada fila
