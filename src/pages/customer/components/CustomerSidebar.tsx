import Sidebar from "../../../components/Sidebar";
import { Briefcase, Calendar, User } from "lucide-react";
import type { SidebarItem } from "../../../components/Sidebar";

const items: SidebarItem[] = [
  { label: "Hizmetler", path: "/services", icon: <Briefcase className="h-5 w-5" /> },
  { label: "Randevularım", path: "/appointments", icon: <Calendar className="h-5 w-5" /> },
  { label: "Profilim", path: "/profile", icon: <User className="h-5 w-5" /> },
];

export default function CustomerSidebar() {
  return <Sidebar items={items} mobileTitle="Menü" logoSubtitle="Müşteri Paneli" />;
}
