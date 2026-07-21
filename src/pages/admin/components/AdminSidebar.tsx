import { Link, useLocation } from "react-router";
import { useState } from "react";

// Define the menu structure with nested children
const menuItems = [
  {
    label: "Hizmetler",
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
    children: [
      { label: "Hizmet Listesi", path: "/admin/services" },
      { label: "Hizmet Ekle", path: "/admin/services/add" },
    ],
  },
  {
    label: "Kategoriler",
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
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
    ),
    children: [
      { label: "Kategori Listesi", path: "/admin/categories" },
      { label: "Kategori Ekle", path: "/admin/categories/add" },
    ],
  },
  {
    label: "Personel",
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
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    children: [
      { label: "Personel Listesi", path: "/admin/staff" },
      { label: "Personel Ekle", path: "/admin/staff/add" },
    ],
  },
  {
    label: "Profilim",
    path: "/admin/profile", // No children, direct link
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
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const isActive = (path: string) => location.pathname === path;

  // Check if any child of a parent menu is currently active
  const isParentActive = (item: (typeof menuItems)[0]) => {
    if (!item.children) return false;
    return item.children.some((child) =>
      location.pathname.startsWith(child.path),
    );
  };

  return (
    <div className="flex h-full flex-col bg-surface pt-6">
      {/* Mobile Close Button */}
      <div className="mb-4 flex items-center justify-between px-4 lg:hidden">
        <span className="text-lg font-bold text-deep">Yönetici</span>
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

      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.label}>
            {/* Parent Item */}
            {item.children ? (
              <button
                onClick={() => toggleMenu(item.label)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isParentActive(item)
                    ? "text-deep"
                    : "text-main/70 hover:bg-main/5 hover:text-main"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </div>
                {/* Dropdown Arrow */}
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
              // Direct Link (Profile)
              <Link
                to={item.path!}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isActive(item.path!)
                    ? "bg-deep/10 text-deep"
                    : "text-main/70 hover:bg-main/5 hover:text-main"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )}

            {/* Children Items (Dropdown) */}
            {item.children && (
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openMenus.includes(item.label) || isParentActive(item)
                    ? "max-h-96 mt-1"
                    : "max-h-0"
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
                          ? "font-semibold text-deep"
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  );
}
