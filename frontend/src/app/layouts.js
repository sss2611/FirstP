import './globals.css';

export const metadata = {
  title: 'Tienda de Ventas',
  description: 'App web para administración y pedidos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}