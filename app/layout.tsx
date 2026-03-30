import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Justin Mares",
  description: "Personal blog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text antialiased">
        <header className="border-b border-border">
          <nav className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
            <Link href="/" className="text-xl font-bold tracking-tight text-text hover:text-accent transition-colors">
              justin mares
            </Link>
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <Link href="/about" className="hover:text-accent transition-colors">about</Link>
              <Link href="/admin" className="hover:text-accent transition-colors">write</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-2xl px-6 py-10">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-2xl px-6 py-6 text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Justin Mares
          </div>
        </footer>
      </body>
    </html>
  );
}
