"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetch("/api/users").then((r) => r.json()).then(setUsers).finally(() => setLoading(false));
  }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setFormError(data.error);
      return;
    }
    const user = await res.json();
    setUsers([{ ...user, active: true, createdAt: new Date().toISOString() }, ...users]);
    setShowForm(false);
    setForm({ name: "", email: "", password: "", role: "employee" });
  }

  async function toggleActive(user: User) {
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !user.active }),
    });
    if (res.ok) {
      setUsers(users.map((u) => (u.id === user.id ? { ...u, active: !u.active } : u)));
    }
  }

  async function changeRole(userId: string, role: string) {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)));
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Cargando usuarios...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
        >
          {showForm ? "Cancelar" : "+ Nuevo Usuario"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Crear Usuario</h2>
          {formError && <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded">{formError}</p>}
          <form onSubmit={createUser} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="employee">Empleado</option>
                <option value="manager">Gestor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="col-span-2">
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
                Crear Usuario
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-5 py-3 text-left">Nombre</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Rol</th>
              <th className="px-5 py-3 text-left">Estado</th>
              <th className="px-5 py-3 text-left">Registro</th>
              <th className="px-5 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className={`hover:bg-gray-50 ${!u.active ? "opacity-50" : ""}`}>
                <td className="px-5 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-5 py-3 text-gray-500">{u.email}</td>
                <td className="px-5 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="employee">Empleado</option>
                    <option value="manager">Gestor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${u.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {u.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString("es")}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleActive(u)}
                    className={`text-xs px-3 py-1 rounded ${u.active ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"} transition`}
                  >
                    {u.active ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
