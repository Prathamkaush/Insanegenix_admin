import "./globals.css";

export const metadata = {
  title: "InsaneGenix Admin",
  description: "InsaneGenix commerce management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brandBlack text-white antialiased overflow-x-hidden">
        {/* App wrapper */}
        
          {children}
        
      </body>
    </html>
  );
}
