import Sidebar from "../../../components/Sidebar";
import { Briefcase, Calendar, LayoutDashboard, List, User, Users } from "lucide-react";
import type { SidebarItem } from "../../../components/Sidebar";

const items: SidebarItem[] = [
  { label: "Dashboard", path: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
  {
    label: "Randevular",
    icon: <Calendar className="h-5 w-5" />,
    children: [{ label: "Tüm Randevular", path: "/admin/appointments" }],
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
  { label: "Profilim", path: "/admin/profile", icon: <User className="h-5 w-5" /> },
];

export default function AdminSidebar() {
  return <Sidebar items={items} mobileTitle="Yönetici" logoSubtitle="Yönetim Merkezi" />;
}
