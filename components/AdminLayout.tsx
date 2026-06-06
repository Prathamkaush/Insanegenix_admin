import AdminSidebarClient from "./AdminSidebarClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-brandBlack text-white overflow-x-hidden">
      {/* Background image & gradient overlays matching login page aesthetics */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: "url('/insanegenix/backgrounds/admin-login-bg.png')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_45%,rgba(229,9,20,0.15),transparent_35%),linear-gradient(90deg,rgba(0,0,0,0.96),rgba(0,0,0,0.85)_42%,rgba(0,0,0,0.96))] pointer-events-none" />

      <div className="relative z-10 flex min-h-screen">
        <AdminSidebarClient />

        <main className="flex-1 ml-0 md:ml-64 p-4 pt-20 md:p-8 md:pt-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
