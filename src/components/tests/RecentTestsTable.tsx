import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const testStatusMap = {
  pending: { label: "قيد الانتظار", variant: "outline" },
  inProgress: { label: "جاري التنفيذ", variant: "secondary" },
  completed: { label: "مكتمل", variant: "default" },
};

const recentTests = [
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
];

const RecentTestsTable = () => {
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
          {recentTests.map((test) => (
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
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTestsTable;
