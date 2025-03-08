import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Printer,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const monthlyData = {
  revenue: 37500,
  expenses: {
    chemicals: 8500,
    salaries: 12000,
    rent: 3000,
    utilities: 1500,
    other: 2000,
  },
  testCounts: {
    "تحليل دم شامل": { count: 120, revenue: 12000 },
    "وظائف كبد": { count: 85, revenue: 8500 },
    "وظائف كلى": { count: 75, revenue: 7500 },
    "سكر صائم": { count: 60, revenue: 3000 },
    "صورة دم كاملة": { count: 40, revenue: 2000 },
    "تحليل بول": { count: 30, revenue: 1500 },
    هرمونات: { count: 30, revenue: 3000 },
  },
};

const calculateTotalExpenses = (expenses: Record<string, number>) => {
  return Object.values(expenses).reduce(
    (total: number, expense: number) => total + expense,
    0,
  );
};

const calculateNetProfit = (
  revenue: number,
  expenses: Record<string, number>,
) => {
  const totalExpenses = calculateTotalExpenses(expenses);
  return revenue - totalExpenses;
};

const FinancePage = () => {
  const [activeMonth, setActiveMonth] = useState("يونيو 2023");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const totalExpenses = calculateTotalExpenses(monthlyData.expenses);
  const netProfit = calculateNetProfit(
    monthlyData.revenue,
    monthlyData.expenses,
  );
  const profitMargin = Math.round((netProfit / monthlyData.revenue) * 100);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">التقارير المالية</h1>
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Printer className="h-4 w-4 mr-2" />
              طباعة تقرير الأرباح
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-xl mb-4">
                تقرير الأرباح الشهري - {activeMonth}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-4" id="printable-report">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">معمل التحاليل الطبية</h2>
                <p className="text-muted-foreground">
                  تقرير الأرباح الشهري - {activeMonth}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          إجمالي الإيرادات
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {monthlyData.revenue.toLocaleString()} ج.م
                        </p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          إجمالي المصروفات
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {totalExpenses.toLocaleString()} ج.م
                        </p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <TrendingDown className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          صافي الربح
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {netProfit.toLocaleString()} ج.م
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          هامش الربح: {profitMargin}%
                        </p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <DollarSign className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    تفاصيل المصروفات
                  </h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-right py-2 px-4 font-medium">
                          البند
                        </th>
                        <th className="text-left py-2 px-4 font-medium">
                          المبلغ (ج.م)
                        </th>
                        <th className="text-left py-2 px-4 font-medium">
                          النسبة
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(monthlyData.expenses).map(
                        ([key, value]) => {
                          const expenseNames = {
                            chemicals: "كيماويات ومستلزمات",
                            salaries: "رواتب ومرتبات",
                            rent: "إيجار",
                            utilities: "مرافق",
                            other: "مصروفات أخرى",
                          };
                          const percentage = Math.round(
                            ((value as number) / totalExpenses) * 100,
                          );
                          return (
                            <tr key={key} className="border-b border-border">
                              <td className="py-2 px-4">{expenseNames[key]}</td>
                              <td className="py-2 px-4 text-left">
                                {(value as number).toLocaleString()}
                              </td>
                              <td className="py-2 px-4 text-left">
                                {percentage}%
                              </td>
                            </tr>
                          );
                        },
                      )}
                      <tr className="bg-muted/50 font-medium">
                        <td className="py-2 px-4">الإجمالي</td>
                        <td className="py-2 px-4 text-left">
                          {totalExpenses.toLocaleString()}
                        </td>
                        <td className="py-2 px-4 text-left">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    إيرادات التحاليل
                  </h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-right py-2 px-4 font-medium">
                          نوع التحليل
                        </th>
                        <th className="text-left py-2 px-4 font-medium">
                          العدد
                        </th>
                        <th className="text-left py-2 px-4 font-medium">
                          الإيراد (ج.م)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(monthlyData.testCounts).map(
                        ([testName, data]) => (
                          <tr key={testName} className="border-b border-border">
                            <td className="py-2 px-4">{testName}</td>
                            <td className="py-2 px-4 text-left">
                              {data.count}
                            </td>
                            <td className="py-2 px-4 text-left">
                              {data.revenue.toLocaleString()}
                            </td>
                          </tr>
                        ),
                      )}
                      <tr className="bg-muted/50 font-medium">
                        <td className="py-2 px-4">الإجمالي</td>
                        <td className="py-2 px-4 text-left">
                          {Object.values(monthlyData.testCounts).reduce(
                            (total, item) => total + item.count,
                            0,
                          )}
                        </td>
                        <td className="py-2 px-4 text-left">
                          {monthlyData.revenue.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">صافي الربح:</p>
                    <p className="text-2xl font-bold">
                      {netProfit.toLocaleString()} ج.م
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      تاريخ التقرير: {new Date().toLocaleDateString("ar-EG")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      تم إنشاؤه بواسطة: مدير النظام
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => {
                  window.print();
                }}
              >
                <Printer className="h-4 w-4 mr-2" />
                طباعة التقرير
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="monthly">
        <TabsList className="mb-4">
          <TabsTrigger value="monthly">
            <Calendar className="h-4 w-4 mr-2" />
            تقرير شهري
          </TabsTrigger>
          <TabsTrigger value="quarterly">
            <Calendar className="h-4 w-4 mr-2" />
            تقرير ربع سنوي
          </TabsTrigger>
          <TabsTrigger value="yearly">
            <Calendar className="h-4 w-4 mr-2" />
            تقرير سنوي
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      إجمالي الإيرادات
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {monthlyData.revenue.toLocaleString()} ج.م
                    </p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      إجمالي المصروفات
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {totalExpenses.toLocaleString()} ج.م
                    </p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <TrendingDown className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">صافي الربح</p>
                    <p className="text-2xl font-bold mt-1">
                      {netProfit.toLocaleString()} ج.م
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      هامش الربح: {profitMargin}%
                    </p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل المصروفات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(monthlyData.expenses).map(([key, value]) => {
                    const expenseNames = {
                      chemicals: "كيماويات ومستلزمات",
                      salaries: "رواتب ومرتبات",
                      rent: "إيجار",
                      utilities: "مرافق",
                      other: "مصروفات أخرى",
                    };
                    const percentage = Math.round(
                      ((value as number) / totalExpenses) * 100,
                    );
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{expenseNames[key]}</span>
                          <span className="text-muted-foreground">
                            {(value as number).toLocaleString()} ج.م (
                            {percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إيرادات التحاليل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-right py-3 px-4 font-medium">
                          نوع التحليل
                        </th>
                        <th className="text-right py-3 px-4 font-medium">
                          العدد
                        </th>
                        <th className="text-right py-3 px-4 font-medium">
                          الإيراد
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(monthlyData.testCounts).map(
                        ([testName, data]) => (
                          <tr
                            key={testName}
                            className="border-b border-border hover:bg-muted/50"
                          >
                            <td className="py-3 px-4">{testName}</td>
                            <td className="py-3 px-4">{data.count}</td>
                            <td className="py-3 px-4">
                              {data.revenue.toLocaleString()} ج.م
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quarterly">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">
              سيتم إضافة تقارير ربع سنوية قريباً
            </p>
          </div>
        </TabsContent>

        <TabsContent value="yearly">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">
              سيتم إضافة تقارير سنوية قريباً
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancePage;
