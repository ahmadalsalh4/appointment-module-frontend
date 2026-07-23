import { Link, useLocation } from "react-router";
import { useState } from "react";
import { useAuth } from "../../../contexts/auth/useAuth";
import { useLogoutMutation } from "../../../hooks/useAuthQueries";

const menuItems = [
  {
    label: "Hizmetler",
    path: "/services", // Müşteri anasayfası hizmetler listesi
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    label: "Randevularım",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    children: [{ label: "Aktif Randevular", path: "/appointments" }],
  },
  {
    label: "Profilim",
    path: "/profile", // Shared profile sayfası
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
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
    if (!item.children && "path" in item) {
      return location.pathname === (item as { path: string }).path;
    }
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
        <span className="text-lg font-bold text-deep">Menü</span>
        <button onClick={onClose} className="text-main/70 hover:text-main">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Desktop Logo/Title */}
      <div className="mb-8 hidden px-6 lg:block">
        <h1 className="text-xl font-extrabold tracking-tight text-deep">
          Randevu Sistemi
        </h1>
        <p className="text-xs text-main/50 mt-1">Müşteri Paneli</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 overflow-y-auto pb-4">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
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
                <svg
                  className={`h-4 w-4 transform transition-transform ${openMenus.includes(item.label) ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            ) : (
              <Link
                to={item.path!}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isActive(item.path!)
                    ? "bg-deep text-surface shadow-sm"
                    : "text-main/70 hover:bg-main/5 hover:text-main"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )}

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
      <div className="mt-auto p-3 border-t border-main/10">
        <button
          onClick={() => role && logout(role)}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}

export default function CustomerSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* MOBILE: Hamburger Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-deep text-surface shadow-lg transition hover:bg-deep/90 lg:hidden"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
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
      <div className="hidden lg:fixed lg:inset-y-15 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  );
}
