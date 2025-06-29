import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/60 to-background flex items-start justify-center">
      <div className="flex w-full max-w-[1600px] py-12 pl-8 pr-8 gap-8">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Sidebar />

          <main className="flex-1 rounded-2xl bg-card shadow-lg p-6 min-h-[80vh]">
            {children}
          </main>
        </ThemeProvider>
      </div>
    </div>
  );
}
