import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { getPatients, getTestResults, getTestName } from "./TestsService";

interface Test {
  id: string;
  patientName: string;
  testType: string;
  date: string;
  status: string;
}

const testStatusMap = {
  pending: { label: "قيد الانتظار", variant: "outline" },
  inProgress: { label: "جاري التنفيذ", variant: "secondary" },
  completed: { label: "مكتمل", variant: "default" },
};

const generateRecentTests = (): Test[] => {
  const patients = getPatients();
  const testResults = getTestResults();
  const recentTests: Test[] = [];

  // إنشاء قائمة بالتحاليل من بيانات المرضى
  patients.forEach((patient) => {
    if (patient.test1) {
      recentTests.push({
        id: `${patient.id}_test1`,
        patientName: patient.name,
        testType: getTestName(patient.test1),
        date: patient.date || new Date().toLocaleDateString(),
        status: "pending",
      });
    }
    if (patient.test2) {
      recentTests.push({
        id: `${patient.id}_test2`,
        patientName: patient.name,
        testType: getTestName(patient.test2),
        date: patient.date || new Date().toLocaleDateString(),
        status: "pending",
      });
    }
    if (patient.test3) {
      recentTests.push({
        id: `${patient.id}_test3`,
        patientName: patient.name,
        testType: getTestName(patient.test3),
        date: patient.date || new Date().toLocaleDateString(),
        status: "pending",
      });
    }
  });

  // تحديث حالة التحاليل من نتائج التحاليل
  testResults.forEach((result) => {
    const index = recentTests.findIndex(
      (test) =>
        test.patientName === result.patientName &&
        test.testType === result.testType,
    );

    if (index !== -1) {
      recentTests[index].status = result.status || "completed";
    }
  });

  // ترتيب التحاليل حسب التاريخ (الأحدث أولاً)
  recentTests.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  // إرجاع أحدث 5 تحاليل
  return recentTests.slice(0, 5);
};

const RecentTestsTable = () => {
  const [recentTests, setRecentTests] = useState<Test[]>([]);

  useEffect(() => {
    setRecentTests(generateRecentTests());
  }, []);

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
          {recentTests.length > 0 ? (
            recentTests.map((test) => (
              <tr
                key={test.id}
                className="border-b border-border hover:bg-muted/50"
              >
                <td className="py-3 px-4">{test.patientName}</td>
                <td className="py-3 px-4">{test.testType}</td>
                <td className="py-3 px-4">{test.date}</td>
                <td className="py-3 px-4">
                  <Badge
                    variant={testStatusMap[test.status]?.variant || "outline"}
                  >
                    {testStatusMap[test.status]?.label || "قيد الانتظار"}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="py-8 text-center text-muted-foreground"
              >
                لا توجد تحاليل متاحة بعد
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTestsTable;
