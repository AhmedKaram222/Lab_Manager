import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { getPatients, getTestResults } from "../tests/TestsService";

const calculateStats = (period: "daily" | "weekly" | "monthly") => {
  // استرجاع بيانات المرضى والتحاليل
  const patients = getPatients();
  const testResults = getTestResults();

  // الحصول على التاريخ الحالي
  const currentDate = new Date();
  let startDate = new Date();

  // تحديد تاريخ البداية حسب الفترة
  if (period === "daily") {
    startDate.setHours(0, 0, 0, 0);
  } else if (period === "weekly") {
    startDate.setDate(currentDate.getDate() - 7);
  } else if (period === "monthly") {
    startDate.setMonth(currentDate.getMonth() - 1);
  }

  // تصفية المرضى حسب الفترة
  const filteredPatients = patients.filter((patient) => {
    if (!patient.date) return false;
    const patientDate = new Date(patient.date);
    return patientDate >= startDate && patientDate <= currentDate;
  });

  // تصفية نتائج التحاليل حسب الفترة
  const filteredResults = testResults.filter((result) => {
    if (!result.date) return false;
    const resultDate = new Date(result.date);
    return resultDate >= startDate && resultDate <= currentDate;
  });

  // حساب إجمالي التحاليل
  let totalTests = 0;
  let revenue = 0;

  // حساب عدد التحاليل والإيرادات من المرضى المسجلين
  filteredPatients.forEach((patient) => {
    if (patient.test1) totalTests++;
    if (patient.test2) totalTests++;
    if (patient.test3) totalTests++;

    // حساب الإيرادات
    revenue += patient.total || 0;
  });

  // حساب التحاليل المكتملة والمعلقة
  const completedTests = filteredResults.filter(
    (result) => result.status === "completed",
  ).length;
  const pendingTests = totalTests - completedTests;

  return {
    totalTests,
    completedTests,
    pendingTests,
    revenue,
  };
};

// حساب توزيع أنواع التحاليل
const calculateTestTypeDistribution = () => {
  const patients = getPatients();
  const testCounts: Record<string, number> = {};
  const testNames: Record<string, string> = {
    "1": "تحليل دم شامل",
    "2": "وظائف كبد",
    "3": "وظائف كلى",
    "4": "سكر صائم",
    "5": "صورة دم كاملة",
    "6": "تحليل بول",
    "7": "هرمونات",
    "8": "دهون",
    "9": "فيتامين د",
    "10": "فيروسات كبدية",
  };

  // حساب عدد كل نوع من التحاليل
  patients.forEach((patient) => {
    if (patient.test1) {
      const testName = testNames[patient.test1] || "تحليل غير معروف";
      testCounts[testName] = (testCounts[testName] || 0) + 1;
    }
    if (patient.test2) {
      const testName = testNames[patient.test2] || "تحليل غير معروف";
      testCounts[testName] = (testCounts[testName] || 0) + 1;
    }
    if (patient.test3) {
      const testName = testNames[patient.test3] || "تحليل غير معروف";
      testCounts[testName] = (testCounts[testName] || 0) + 1;
    }
  });

  // حساب إجمالي التحاليل
  const totalCount = Object.values(testCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  // تحويل البيانات إلى التنسيق المطلوب
  const result = Object.entries(testCounts).map(([name, count]) => ({
    name,
    count,
    percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
  }));

  // ترتيب النتائج تنازليًا حسب العدد
  return result.sort((a, b) => b.count - a.count);
};

const dailyStats = calculateStats("daily");
const weeklyStats = calculateStats("weekly");
const monthlyStats = calculateStats("monthly");
const testTypes = calculateTestTypeDistribution();

const StatisticsPage = () => {
  const [stats, setStats] = useState({
    daily: dailyStats,
    weekly: weeklyStats,
    monthly: monthlyStats,
    testTypes: testTypes,
  });

  // تحديث الإحصائيات عند تحميل الصفحة
  useEffect(() => {
    setStats({
      daily: calculateStats("daily"),
      weekly: calculateStats("weekly"),
      monthly: calculateStats("monthly"),
      testTypes: calculateTestTypeDistribution(),
    });
  }, []);

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold">الإحصائيات</h1>

      <Tabs defaultValue="daily">
        <TabsList className="mb-4">
          <TabsTrigger value="daily">
            <Calendar className="h-4 w-4 mr-2" />
            يومي
          </TabsTrigger>
          <TabsTrigger value="weekly">
            <Calendar className="h-4 w-4 mr-2" />
            أسبوعي
          </TabsTrigger>
          <TabsTrigger value="monthly">
            <Calendar className="h-4 w-4 mr-2" />
            شهري
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <StatsSummary stats={stats.daily} />
        </TabsContent>

        <TabsContent value="weekly">
          <StatsSummary stats={stats.weekly} />
        </TabsContent>

        <TabsContent value="monthly">
          <StatsSummary stats={stats.monthly} />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>توزيع أنواع التحاليل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.testTypes.length > 0 ? (
                stats.testTypes.map((type) => (
                  <div key={type.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span>{type.name}</span>
                      <span className="text-muted-foreground">
                        {type.count} تحليل ({type.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${type.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  لا توجد بيانات متاحة بعد
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>مؤشرات الأداء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    نسبة إكمال التحاليل
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.daily.totalTests > 0
                      ? Math.round(
                          (stats.daily.completedTests /
                            stats.daily.totalTests) *
                            100,
                        )
                      : 0}
                    %
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Activity className="h-6 w-6" />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    متوسط وقت التحليل
                  </p>
                  <p className="text-2xl font-bold">45 دقيقة</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    متوسط الإيراد لكل تحليل
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.daily.totalTests > 0
                      ? Math.round(stats.daily.revenue / stats.daily.totalTests)
                      : 0}{" "}
                    ج.م
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatsProps {
  stats: {
    totalTests: number;
    completedTests: number;
    pendingTests: number;
    revenue: number;
  };
}

const StatsSummary = ({ stats }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي التحاليل</p>
              <p className="text-2xl font-bold mt-1">{stats.totalTests}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">التحاليل المكتملة</p>
              <p className="text-2xl font-bold mt-1">{stats.completedTests}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalTests > 0
                  ? Math.round((stats.completedTests / stats.totalTests) * 100)
                  : 0}
                % من الإجمالي
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                التحاليل قيد الانتظار
              </p>
              <p className="text-2xl font-bold mt-1">{stats.pendingTests}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalTests > 0
                  ? Math.round((stats.pendingTests / stats.totalTests) * 100)
                  : 0}
                % من الإجمالي
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">الإيرادات</p>
              <p className="text-2xl font-bold mt-1">{stats.revenue} ج.م</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPage;
