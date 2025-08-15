"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Flag } from "lucide-react";
import { useState, useEffect } from "react";
import AdminToggle from "./AdminToggle";
import { isAdmin } from "@/lib/competitions";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/daftar", label: "Pendaftaran" },
  { href: "/peserta", label: "Daftar Peserta" },
  { href: "/admin", label: "Admin", adminOnly: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAdminMode(isAdmin());
    const checkAdmin = () => setAdminMode(isAdmin());
    const handleAdminStatusChange = (event: CustomEvent) => {
      setAdminMode(event.detail);
    };

    window.addEventListener("storage", checkAdmin);
    window.addEventListener(
      "adminStatusChanged",
      handleAdminStatusChange as EventListener
    );

    return () => {
      window.removeEventListener("storage", checkAdmin);
      window.removeEventListener(
        "adminStatusChanged",
        handleAdminStatusChange as EventListener
      );
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <Flag className="h-5 w-5 text-red-600" />
            <span>Lomba 17 Agustus</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => {
              if (item.adminOnly && (!mounted || !adminMode)) return null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors hover:text-red-600 ${
                    pathname === item.href
                      ? "text-red-600"
                      : "text-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <AdminToggle />
          </nav>
          <button
            aria-label="Menu"
            className="md:hidden p-2"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-black/5 dark:border-white/10 py-2">
            {navItems.map((item) => {
              if (item.adminOnly && (!mounted || !adminMode)) return null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-2 py-2 rounded-md transition-colors hover:bg-red-50 dark:hover:bg-white/5 ${
                    pathname === item.href
                      ? "text-red-600"
                      : "text-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="px-2 py-2">
              <AdminToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
