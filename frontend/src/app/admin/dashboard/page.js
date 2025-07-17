useEffect(() => {
  fetch('/api/products')
    .then(res => res.json())
    .then(data => setProducts(data));
}, []);

const handleSave = async (id, updatedData) => {
  await fetch('/api/products', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, data: updatedData })
  });
  alert('Producto actualizado');
};
