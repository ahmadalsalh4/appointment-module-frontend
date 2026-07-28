import { Link, useLocation } from "react-router";
import { useState } from "react";
import { ChevronDown, LogOut, Menu, RefreshCw, X } from "lucide-react";
import { useAuth } from "../contexts/auth/useAuth";
import { useLogoutMutation } from "../hooks/useAuthQueries";
import { useMyRolesQuery } from "../hooks/useMyRolesQuery";
import ThemeToggle from "../pages/components/ThemeToggle";
import SwitchRoleDialog from "./SwitchRoleDialog";
import type { ReactNode } from "react";
import type { UserRole } from "../other/types";

export interface SidebarItem {
  label: string;
  icon: ReactNode;
  path?: string;
  children?: { label: string; path: string }[];
}

interface SidebarProps {
  items: SidebarItem[];
  mobileTitle: string;
  logoSubtitle: string;
  activeStyle?: "filled" | "muted";
}

function SidebarContent({
  items,
  mobileTitle,
  logoSubtitle,
  onClose,
}: SidebarProps & { onClose?: () => void }) {
  const location = useLocation();
  const { role, otherRoles: initialOtherRoles } = useAuth();
  const { data: myRoles } = useMyRolesQuery();
  const otherRoles = myRoles?.other_roles ?? initialOtherRoles ?? [];
  const { mutate: logout } = useLogoutMutation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [switchTarget, setSwitchTarget] = useState<UserRole | null>(null);

  const openSwitchDialog = (targetRole: UserRole) => {
    if (onClose) onClose();
    setSwitchTarget(targetRole);
  };

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
    );
  };

  const isChildActive = (path: string) => location.pathname === path;

  const isDirectActive = (path: string) => {
    if (location.pathname === path) return true;
    if (!location.pathname.startsWith(`${path}/`)) return false;
    const directPaths = items.filter((i) => !i.children && i.path).map((i) => i.path!);
    return !directPaths.some(
      (other) =>
        other !== path &&
        other.startsWith(`${path}/`) &&
        location.pathname.startsWith(other),
    );
  };

  const hasActiveChild = (item: SidebarItem) =>
    item.children?.some((c) => isChildActive(c.path)) ?? false;

  return (
    <div className="flex h-full flex-col bg-surface pt-6">
      <div className="mb-4 flex items-center justify-between px-4 lg:hidden">
        <span className="text-lg font-bold text-deep">{mobileTitle}</span>
        <button onClick={onClose} className="text-main/70 hover:text-main">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="mb-8 hidden px-6 lg:block">
        <h1 className="text-xl font-extrabold tracking-tight text-deep">
          Randevu Sistemi
        </h1>
        <p className="text-xs text-main/50 mt-1">{logoSubtitle}</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 overflow-y-auto pb-4">
        {items.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <button
                onClick={() => toggleMenu(item.label)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  hasActiveChild(item)
                    ? "text-deep bg-deep/5"
                    : "text-main/70 hover:bg-main/5 hover:text-main"
                }`}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openMenus.includes(item.label) || hasActiveChild(item) ? "rotate-180" : ""}`}
                />
              </button>
            ) : (
              <Link
                to={item.path!}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isDirectActive(item.path!)
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
                  openMenus.includes(item.label) || hasActiveChild(item)
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
                        isChildActive(child.path)
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

      {otherRoles.length > 0 && (
        <div className="mt-auto border-t border-main/5 pt-4">
          <p className="px-4 text-[10px] font-bold text-main/30 uppercase tracking-widest mb-2">
            Rol Değiştir
          </p>
          {otherRoles.map((r) => (
            <button
              key={r}
              onClick={() => openSwitchDialog(r)}
              className="w-full text-left px-4 py-2 text-sm text-main/60 hover:text-deep hover:bg-deep/5 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {r === "customer" ? "Müşteri paneline geç" : r === "staff" ? "Personel paneline geç" : "Yönetici paneline geç"}
            </button>
          ))}
        </div>
      )}

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

      <SwitchRoleDialog
        open={!!switchTarget}
        targetRole={switchTarget ?? role ?? "customer"}
        onClose={() => setSwitchTarget(null)}
      />
    </div>
  );
}

export default function Sidebar(props: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-deep text-surface shadow-lg transition hover:bg-deep/90 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-surface transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent {...props} onClose={closeMobileMenu} />
      </div>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent {...props} />
      </div>
    </>
  );
}
