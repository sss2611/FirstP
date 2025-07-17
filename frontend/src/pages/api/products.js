import clientPromise from '@/lib/mongo';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('tienda');
  const collection = db.collection('productos');

  if (req.method === 'GET') {
    const productos = await collection.find().toArray();
    return res.status(200).json(productos);
  }

  if (req.method === 'PUT') {
    const { id, data } = req.body;
    await collection.updateOne({ _id: id }, { $set: data });
    return res.status(200).json({ mensaje: 'Producto actualizado' });
  }

  if (req.method === 'POST') {
    const nuevoProducto = req.body;
    await collection.insertOne(nuevoProducto);
    return res.status(201).json({ mensaje: 'Producto agregado' });
  }

  res.status(405).json({ mensaje: 'Método no permitido' });
}
