import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <aside className="w-56 bg-white border-r hidden lg:block">
        <nav className="p-4 space-y-1">
          <Link href="/admin" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
            📊 Dashboard
          </Link>
          <Link href="/admin/users" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
            👥 Usuarios
          </Link>
          <Link href="/admin/reports" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
            📈 Reportes
          </Link>
          <Link href="/products" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
            📦 Productos
          </Link>
          <Link href="/movements" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
            🔄 Movimientos
          </Link>
          <hr className="my-3" />
          <Link href="/" className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition">
            ← Volver al sitio
          </Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
