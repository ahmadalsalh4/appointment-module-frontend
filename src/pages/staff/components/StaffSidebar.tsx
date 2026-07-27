import { Link, useLocation } from "react-router";
import { useState } from "react";
import { Calendar, LogOut, Menu, User, X } from "lucide-react";
import { useAuth } from "../../../contexts/auth/useAuth";
import { useLogoutMutation } from "../../../hooks/useAuthQueries";
import ThemeToggle from "../../components/ThemeToggle";

const navLinks = [
  { label: "Randevularım", path: "/staff", icon: <Calendar className="h-5 w-5" /> },
  { label: "Profilim", path: "/staff/profile", icon: <User className="h-5 w-5" /> },
];

interface SidebarContentProps {
  onClose?: () => void;
}

function SidebarContent({ onClose }: SidebarContentProps) {
  const location = useLocation();
  const { role } = useAuth();
  const { mutate: logout } = useLogoutMutation();

  // 3. "/staff" ana sayfası her şeyin başlangıcı olduğu için özel kontrol gerekiyor:
  // - Randevularım: sadece /staff ve /staff/appointments/* altında aktif
  // - Diğerleri (örn. /staff/profile): kendi path'i ile başlayan sayfalarda aktif
  const isActive = (path: string) => {
    if (path === "/staff") {
      return (
        location.pathname === "/staff" ||
        location.pathname.startsWith("/staff/appointments")
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-full flex-col bg-surface pt-6">
      {/* Mobile Close Button */}
      <div className="mb-4 flex items-center justify-between px-4 lg:hidden">
        <span className="text-lg font-bold text-deep">Personel Menüsü</span>
        <button onClick={onClose} className="text-main/70 hover:text-main">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Logo/Title */}
      <div className="mb-8 hidden px-6 lg:block">
        <h1 className="text-xl font-extrabold tracking-tight text-deep">
          Randevu Sistemi
        </h1>
        <p className="text-xs text-main/50 mt-1">Personel Paneli</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3">
        {navLinks.map(({ label, path, icon }) => (
          <Link
            key={path}
            to={path}
            onClick={onClose}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
              isActive(path)
                ? "bg-deep/10 text-deep" // Aktifse koyu renk
                : "text-main/70 hover:bg-main/5 hover:text-main" // Değilse soluk
            }`}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto p-3 border-t border-main/10 space-y-1">
        <div className="flex items-center gap-3 px-4 py-2">
          <span className="text-xs font-semibold text-main/60 uppercase tracking-wider">
            Tema
          </span>
          <ThemeToggle />
        </div>
        <button
          onClick={() => role && logout(role)}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}

export default function StaffSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* MOBILE: Hamburger Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-deep text-surface shadow-lg transition hover:bg-deep/90 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* MOBILE: Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* MOBILE: Slide-out Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-surface transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onClose={closeMobileMenu} />
      </div>

      {/* DESKTOP: Static Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
          <SidebarContent />
        </div>
    </>
  );
}
