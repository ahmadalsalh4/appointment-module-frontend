import { Link, useLocation } from "react-router";
import { useState } from "react";
import { Briefcase, Calendar, ChevronDown, LayoutDashboard, List, LogOut, Menu, User, Users, X } from "lucide-react";
import { useAuth } from "../../../contexts/auth/useAuth";
import { useLogoutMutation } from "../../../hooks/useAuthQueries";
import ThemeToggle from "../../components/ThemeToggle";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin", // Direct link
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Randevular",
    icon: <Calendar className="h-5 w-5" />,
    children: [
      { label: "Tüm Randevular", path: "/admin/appointments" },
      // { label: "Randevu Ekle", path: "/admin/appointments/add" }, // Usually admins don't add, customers do.
    ],
  },
  {
    label: "Personel",
    icon: <Users className="h-5 w-5" />,
    children: [
      { label: "Personel Listesi", path: "/admin/staff" },
      { label: "Personel Ekle", path: "/admin/staff/add" },
    ],
  },
  {
    label: "Hizmetler",
    icon: <Briefcase className="h-5 w-5" />,
    children: [
      { label: "Hizmet Listesi", path: "/admin/services" },
      { label: "Hizmet Ekle", path: "/admin/services/add" },
    ],
  },
  {
    label: "Kategoriler",
    icon: <List className="h-5 w-5" />,
    children: [
      { label: "Kategori Listesi", path: "/admin/categories" },
      { label: "Kategori Ekle", path: "/admin/categories/add" },
    ],
  },
  {
    label: "Profilim",
    path: "/admin/profile", // Points to the shared profile page
    icon: <User className="h-5 w-5" />,
  },
];

interface SidebarContentProps {
  onClose?: () => void;
}

function SidebarContent({ onClose }: SidebarContentProps) {
  const location = useLocation();
  const { role } = useAuth();
  const { mutate: logout } = useLogoutMutation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const isParentActive = (item: (typeof menuItems)[0]) => {
    // Eğer children yoksa VE path varsa, direkt eşleştiğini kontrol et
    if (!item.children && "path" in item) {
      return location.pathname === (item as { path: string }).path;
    }

    // Eğer children varsa, alt linklerden herhangi birine eşleşiyor mu diye bak
    if (item.children) {
      return item.children.some((child) =>
        location.pathname.startsWith(child.path),
      );
    }

    return false;
  };

  return (
    <div className="flex h-full flex-col bg-surface pt-6">
      {/* Mobile Close Button */}
      <div className="mb-4 flex items-center justify-between px-4 lg:hidden">
        <span className="text-lg font-bold text-deep">Yönetici</span>
        <button onClick={onClose} className="text-main/70 hover:text-main">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Logo/Title */}
      <div className="mb-8 hidden px-6 lg:block">
        <h1 className="text-xl font-extrabold tracking-tight text-deep">
          Admin Panel
        </h1>
        <p className="text-xs text-main/50 mt-1">Yönetim Merkezi</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 overflow-y-auto pb-4">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              // Dropdown Menu
              <button
                onClick={() => toggleMenu(item.label)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isParentActive(item)
                    ? "text-deep bg-deep/5"
                    : "text-main/70 hover:bg-main/5 hover:text-main"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </div>
                <ChevronDown
                  className={`h-4 w-4 transform transition-transform ${openMenus.includes(item.label) ? "rotate-180" : ""}`}
                />
              </button>
            ) : (
              // Direct Link
              <Link
                to={item.path!}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isActive(item.path!)
                    ? "bg-deep text-surface shadow-sm" // Filled style for main active page
                    : "text-main/70 hover:bg-main/5 hover:text-main"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )}

            {/* Children Items */}
            {item.children && (
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  openMenus.includes(item.label) || isParentActive(item)
                    ? "max-h-96 mt-1 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-8 flex flex-col space-y-1 border-l-2 border-main/10 pl-4">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={onClose}
                      className={`rounded-lg px-3 py-2 text-sm transition-all ${
                        isActive(child.path)
                          ? "font-semibold text-deep bg-deep/5"
                          : "text-main/60 hover:text-main hover:bg-main/5"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
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
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-canceld hover:bg-canceld/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
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
