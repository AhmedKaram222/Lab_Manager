import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, DollarSign, TrendingUp, Calendar } from "lucide-react";

const dailyStats = {
  totalTests: 24,
  completedTests: 16,
  pendingTests: 8,
  revenue: 1250,
};

const weeklyStats = {
  totalTests: 145,
  completedTests: 120,
  pendingTests: 25,
  revenue: 8750,
};

const monthlyStats = {
  totalTests: 620,
  completedTests: 580,
  pendingTests: 40,
  revenue: 37500,
};

const testTypes = [
  { name: "تحليل دم شامل", count: 8, percentage: 33 },
  { name: "وظائف كبد", count: 5, percentage: 21 },
  { name: "وظائف كلى", count: 4, percentage: 17 },
  { name: "سكر صائم", count: 3, percentage: 13 },
  { name: "صورة دم كاملة", count: 2, percentage: 8 },
  { name: "تحليل بول", count: 1, percentage: 4 },
  { name: "هرمونات", count: 1, percentage: 4 },
];

const StatisticsPage = () => {
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
          <StatsSummary stats={dailyStats} />
        </TabsContent>

        <TabsContent value="weekly">
          <StatsSummary stats={weeklyStats} />
        </TabsContent>

        <TabsContent value="monthly">
          <StatsSummary stats={monthlyStats} />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>توزيع أنواع التحاليل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testTypes.map((type) => (
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
              ))}
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
                  <p className="text-2xl font-bold">67%</p>
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
                  <p className="text-2xl font-bold">52 ج.م</p>
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
                {Math.round((stats.completedTests / stats.totalTests) * 100)}%
                من الإجمالي
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
                {Math.round((stats.pendingTests / stats.totalTests) * 100)}% من
                الإجمالي
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
