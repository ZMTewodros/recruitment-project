import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8 text-indigo-600">
          Admin Panel
        </h2>

        <nav className="space-y-4 text-sm">
          <Link href="/admin" className="block hover:text-indigo-600">
            Dashboard
          </Link>
          <Link href="/admin/jobs" className="block hover:text-indigo-600">
            Manage Jobs
          </Link>
          <Link href="/admin/users" className="block hover:text-indigo-600">
            Manage Users
          </Link>
          <Link href="/" className="block text-red-500">
            Exit
          </Link>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1">
        {/* TOP BAR */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Job Portal Admin</h1>
          <div className="text-sm text-gray-500">
            Admin User
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
