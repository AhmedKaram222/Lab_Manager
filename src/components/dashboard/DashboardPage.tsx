import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, FileText, DollarSign } from "lucide-react";
import { getPatients, getTestResults } from "../tests/TestsService";
import RecentTestsTable from "../tests/RecentTestsTable";

const DashboardPage = () => {
  // استرجاع بيانات المرضى والتحاليل
  const [stats, setStats] = useState({
    totalPatients: 0,
    dailyTests: 0,
    completedTests: 0,
    dailyRevenue: 0,
    pendingTests: 0,
    completionPercentage: 0,
  });

  useEffect(() => {
    // استرجاع بيانات المرضى
    const patients = getPatients();
    const testResults = getTestResults();

    // الحصول على التاريخ الحالي
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // حساب المرضى اليوم
    const todayPatients = patients.filter((patient) => {
      if (!patient.date) return false;
      const patientDate = new Date(patient.date);
      patientDate.setHours(0, 0, 0, 0);
      return patientDate.getTime() === today.getTime();
    });

    // حساب التحاليل اليومية
    let dailyTestsCount = 0;
    let dailyRevenue = 0;

    todayPatients.forEach((patient) => {
      if (patient.test1) dailyTestsCount++;
      if (patient.test2) dailyTestsCount++;
      if (patient.test3) dailyTestsCount++;

      // حساب الإيرادات
      dailyRevenue += patient.total || 0;
    });

    // حساب التحاليل المكتملة
    const completedTestsCount = testResults.filter((result) => {
      if (!result.date) return false;
      const resultDate = new Date(result.date);
      resultDate.setHours(0, 0, 0, 0);
      return (
        resultDate.getTime() === today.getTime() &&
        result.status === "completed"
      );
    }).length;

    // حساب التحاليل المعلقة
    const pendingTestsCount = dailyTestsCount - completedTestsCount;

    // حساب نسبة الإكمال
    const completionPercentage =
      dailyTestsCount > 0
        ? Math.round((completedTestsCount / dailyTestsCount) * 100)
        : 0;

    setStats({
      totalPatients: patients.length,
      dailyTests: dailyTestsCount,
      completedTests: completedTestsCount,
      dailyRevenue: dailyRevenue,
      pendingTests: pendingTestsCount,
      completionPercentage: completionPercentage,
    });
  }, []);

  // حساب المرضى اليوم
  const todayPatients = getPatients().filter((patient) => {
    if (!patient.date) return false;
    const patientDate = new Date(patient.date);
    const today = new Date();
    return patientDate.toDateString() === today.toDateString();
  });

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المرضى"
          value={stats.totalPatients.toString()}
          icon={<Users className="h-6 w-6" />}
          description={`${todayPatients.length} اليوم`}
        />
        <StatCard
          title="التحاليل اليومية"
          value={stats.dailyTests.toString()}
          icon={<FileText className="h-6 w-6" />}
          description={`${stats.pendingTests} قيد الانتظار`}
        />
        <StatCard
          title="التحاليل المكتملة"
          value={stats.completedTests.toString()}
          icon={<Activity className="h-6 w-6" />}
          description={`${stats.completionPercentage}% من الإجمالي`}
        />
        <StatCard
          title="الإيرادات اليومية"
          value={`${stats.dailyRevenue} ج.م`}
          icon={<DollarSign className="h-6 w-6" />}
          description="إيرادات اليوم"
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
            <QuickAction title="تسجيل مريض جديد" path="/patient-registration" />
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
