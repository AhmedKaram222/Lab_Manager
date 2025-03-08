import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Search,
  BarChart2,
  Home,
  UserPlus,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "الرئيسية", path: "/", icon: Home },
  { name: "لوحة التحكم", path: "/dashboard", icon: LayoutDashboard },
  { name: "تسجيل البيانات", path: "/patient-registration", icon: UserPlus },
  { name: "المرضى", path: "/patients", icon: Users },
  { name: "التحاليل", path: "/tests", icon: FileText },
  { name: "النتائج", path: "/results", icon: FileText },
  { name: "البحث", path: "/search", icon: Search },
  { name: "الإحصائيات", path: "/statistics", icon: BarChart2 },
  { name: "الإعدادات", path: "/settings", icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-l border-border h-screen overflow-y-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-6">معمل التحاليل</h1>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
