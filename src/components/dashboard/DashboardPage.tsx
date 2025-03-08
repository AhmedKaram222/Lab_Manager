import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, FileText, DollarSign } from "lucide-react";
import RecentTestsTable from "../tests/RecentTestsTable";

const DashboardPage = () => {
  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المرضى"
          value="120"
          icon={<Users className="h-6 w-6" />}
          description="+5 اليوم"
        />
        <StatCard
          title="التحاليل اليومية"
          value="24"
          icon={<FileText className="h-6 w-6" />}
          description="8 قيد الانتظار"
        />
        <StatCard
          title="التحاليل المكتملة"
          value="16"
          icon={<Activity className="h-6 w-6" />}
          description="67% من الإجمالي"
        />
        <StatCard
          title="الإيرادات اليومية"
          value="1,250 ج.م"
          icon={<DollarSign className="h-6 w-6" />}
          description="+15% من أمس"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>أحدث التحاليل</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTestsTable />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuickAction title="تسجيل مريض جديد" path="/patients/new" />
            <QuickAction title="إضافة تحليل جديد" path="/tests/new" />
            <QuickAction title="عرض نتائج التحاليل" path="/results" />
            <QuickAction title="البحث عن مريض" path="/search" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuickActionProps {
  title: string;
  path: string;
}

const QuickAction = ({ title, path }: QuickActionProps) => {
  return (
    <a
      href={path}
      className="block p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-center"
    >
      {title}
    </a>
  );
};

export default DashboardPage;
