'use client';

import { useForm } from 'react-hook-form';

export default function AdminLogin() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.ok) {
      // Redirigir al dashboard
      window.location.href = '/admin/dashboard';
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Login Administrador</h2>
        <input
          type="text"
          placeholder="Usuario"
          {...register('username')}
          className="border px-3 py-2 w-full rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          {...register('password')}
          className="border px-3 py-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>
    </main>
  );
}
