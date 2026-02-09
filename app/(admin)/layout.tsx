import Sidebar from "@/app/components/dashboard/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar role="admin" />
      <main className="min-h-screen p-4 pt-18 lg:pt-6 lg:ml-[308px] lg:p-6">{children}</main>
    </div>
  );
}
