import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const testStatusMap = {
  pending: { label: "قيد الانتظار", variant: "outline" },
  inProgress: { label: "جاري التنفيذ", variant: "secondary" },
  completed: { label: "مكتمل", variant: "default" },
};

const tests = [
  {
    id: "1",
    patientName: "أحمد محمد",
    testType: "تحليل دم شامل",
    date: "2023-06-15",
    status: "completed",
  },
  {
    id: "2",
    patientName: "سارة أحمد",
    testType: "وظائف كبد",
    date: "2023-06-15",
    status: "inProgress",
  },
  {
    id: "3",
    patientName: "محمد علي",
    testType: "وظائف كلى",
    date: "2023-06-15",
    status: "pending",
  },
  {
    id: "4",
    patientName: "فاطمة حسن",
    testType: "سكر صائم",
    date: "2023-06-15",
    status: "completed",
  },
  {
    id: "5",
    patientName: "خالد عبدالله",
    testType: "صورة دم كاملة",
    date: "2023-06-15",
    status: "pending",
  },
  {
    id: "6",
    patientName: "ليلى محمود",
    testType: "تحليل بول",
    date: "2023-06-15",
    status: "inProgress",
  },
  {
    id: "7",
    patientName: "عمر حسين",
    testType: "هرمونات",
    date: "2023-06-15",
    status: "pending",
  },
];

const TestsPage = () => {
  const pendingTests = tests.filter((test) => test.status === "pending");
  const inProgressTests = tests.filter((test) => test.status === "inProgress");
  const completedTests = tests.filter((test) => test.status === "completed");

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">التحاليل</h1>
        <Link to="/tests/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            تحليل جديد
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة التحاليل اليومية</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">الكل ({tests.length})</TabsTrigger>
              <TabsTrigger value="pending">
                قيد الانتظار ({pendingTests.length})
              </TabsTrigger>
              <TabsTrigger value="inProgress">
                جاري التنفيذ ({inProgressTests.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                مكتمل ({completedTests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TestsTable tests={tests} />
            </TabsContent>

            <TabsContent value="pending">
              <TestsTable tests={pendingTests} />
            </TabsContent>

            <TabsContent value="inProgress">
              <TestsTable tests={inProgressTests} />
            </TabsContent>

            <TabsContent value="completed">
              <TestsTable tests={completedTests} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface TestsTableProps {
  tests: Array<{
    id: string;
    patientName: string;
    testType: string;
    date: string;
    status: string;
  }>;
}

const TestsTable = ({ tests }: TestsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-right py-3 px-4 font-medium">المريض</th>
            <th className="text-right py-3 px-4 font-medium">نوع التحليل</th>
            <th className="text-right py-3 px-4 font-medium">التاريخ</th>
            <th className="text-right py-3 px-4 font-medium">الحالة</th>
            <th className="text-right py-3 px-4 font-medium">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr
              key={test.id}
              className="border-b border-border hover:bg-muted/50"
            >
              <td className="py-3 px-4">{test.patientName}</td>
              <td className="py-3 px-4">{test.testType}</td>
              <td className="py-3 px-4">{test.date}</td>
              <td className="py-3 px-4">
                <Badge variant={testStatusMap[test.status].variant}>
                  {testStatusMap[test.status].label}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    النتائج
                  </Button>
                  <Button variant="outline" size="sm">
                    تحديث الحالة
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestsPage;
