import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Printer, FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const completedTests = [
  {
    id: "1",
    patientName: "أحمد محمد",
    testType: "تحليل دم شامل",
    date: "2023-06-15",
    resultDate: "2023-06-15",
  },
  {
    id: "4",
    patientName: "فاطمة حسن",
    testType: "سكر صائم",
    date: "2023-06-15",
    resultDate: "2023-06-15",
  },
  {
    id: "8",
    patientName: "سمير عادل",
    testType: "وظائف كبد",
    date: "2023-06-14",
    resultDate: "2023-06-14",
  },
  {
    id: "9",
    patientName: "نورا سعيد",
    testType: "هرمونات",
    date: "2023-06-14",
    resultDate: "2023-06-14",
  },
  {
    id: "10",
    patientName: "كريم محمود",
    testType: "تحليل بول",
    date: "2023-06-13",
    resultDate: "2023-06-13",
  },
];

const ResultsPage = () => {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">نتائج التحاليل</h1>
        <Link to="/results/entry">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إدخال نتائج جديدة
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>نتائج التحاليل المكتملة</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="بحث عن نتيجة..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-3 px-4 font-medium">المريض</th>
                  <th className="text-right py-3 px-4 font-medium">
                    نوع التحليل
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    تاريخ التحليل
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    تاريخ النتيجة
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {completedTests.map((test) => (
                  <tr
                    key={test.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">{test.patientName}</td>
                    <td className="py-3 px-4">{test.testType}</td>
                    <td className="py-3 px-4">{test.date}</td>
                    <td className="py-3 px-4">{test.resultDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          عرض
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-2" />
                          طباعة
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsPage;
