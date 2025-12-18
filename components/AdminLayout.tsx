import Sidebar from "./Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 pt-16 md:pt-0 p-6 bg-brandCream min-h-screen">
        {children}
      </main>
    </div>
  );
}
