import Sidebar from "../../../components/Sidebar";
import { Calendar, User } from "lucide-react";
import type { SidebarItem } from "../../../components/Sidebar";

const items: SidebarItem[] = [
  { label: "Randevularım", path: "/staff", icon: <Calendar className="h-5 w-5" /> },
  { label: "Profilim", path: "/staff/profile", icon: <User className="h-5 w-5" /> },
];

export default function StaffSidebar() {
  return <Sidebar items={items} mobileTitle="Personel Menüsü" logoSubtitle="Personel Paneli" />;
}
