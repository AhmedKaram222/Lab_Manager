import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  UserPlus,
  FileText,
  Settings,
  Users,
  BarChart2,
  Search,
  LogOut,
  Plus,
} from "lucide-react";

const MainMenu = () => {
  const today = new Date();
  const formattedDate = format(today, "yyyy-MM-dd", { locale: ar });
  const dayName = format(today, "EEEE", { locale: ar });
  const labName = "برنامج ادارة معمل تحاليل طبية";

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="p-4 border-b border-border bg-card">
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">{dayName}</div>
          <div className="text-xl font-bold">{labName}</div>
          <div className="text-lg font-medium">{formattedDate}</div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">
          القائمة الرئيسية
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MenuCard
            title="شاشة تسجيل البيانات"
            icon={<UserPlus className="h-12 w-12" />}
            path="/patient-registration"
            description="تسجيل بيانات المرضى الجدد وإدارة ملفاتهم"
          />

          <MenuCard
            title="التحاليل"
            icon={<FileText className="h-12 w-12" />}
            path="/tests"
            description="إدارة وعرض جميع التحاليل"
          />

          <MenuCard
            title="نتائج التحاليل"
            icon={<FileText className="h-12 w-12" />}
            path="/results"
            description="عرض وطباعة نتائج التحاليل للمرضى"
          />

          <MenuCard
            title="إدارة الأطباء"
            icon={<Users className="h-12 w-12" />}
            path="/doctors"
            description="إضافة وتعديل بيانات الأطباء المتعاملين مع المعمل"
          />

          <MenuCard
            title="البحث المتقدم"
            icon={<Search className="h-12 w-12" />}
            path="/search"
            description="البحث في سجلات المرضى والتحاليل"
          />

          <MenuCard
            title="التقارير والإحصائيات"
            icon={<BarChart2 className="h-12 w-12" />}
            path="/statistics"
            description="عرض تقارير وإحصائيات أداء المعمل"
          />

          <MenuCard
            title="إعدادات النظام"
            icon={<Settings className="h-12 w-12" />}
            path="/settings"
            description="تعديل إعدادات المعمل وبيانات النظام"
          />
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" className="min-w-[200px]">
            <LogOut className="h-4 w-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </div>
  );
};

interface MenuCardProps {
  title: string;
  icon: React.ReactNode;
  path: string;
  description: string;
}

const MenuCard = ({ title, icon, path, description }: MenuCardProps) => {
  return (
    <Link to={path}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MainMenu;
