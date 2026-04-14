"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex gap-2 items-center">
        <Link href="/login" className="text-gray-600 hover:text-indigo-700 text-sm transition">
          Iniciar Sesión
        </Link>
        <Link
          href="/register"
          className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 text-sm transition"
        >
          Registrarse
        </Link>
      </div>
    );
  }

  const role = (session.user as { role?: string })?.role;

  return (
    <div className="flex gap-3 items-center">
      <span className="text-sm text-gray-600">
        {session.user?.name}
        <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 capitalize">{role}</span>
      </span>
      {role === "admin" && (
        <Link href="/admin" className="text-sm text-indigo-600 hover:text-indigo-800 transition">
          Admin
        </Link>
      )}
      <button
        onClick={() => signOut()}
        className="text-sm text-red-500 hover:text-red-700 transition"
      >
        Salir
      </button>
    </div>
  );
}
