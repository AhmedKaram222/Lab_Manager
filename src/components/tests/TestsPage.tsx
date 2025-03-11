import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  FileText,
  Plus,
  Trash,
  Eye,
  CheckCircle,
  FileDown,
  Printer,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

const TestsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // قائمة التحاليل
  const [tests, setTests] = useState<any[]>([]);
  const [pendingTests, setPendingTests] = useState<any[]>([]);
  const [completedTests, setCompletedTests] = useState<any[]>([]);

  // استرجاع بيانات التحاليل عند تحميل الصفحة
  useEffect(() => {
    // استرجاع التحاليل المكتملة من التخزين المحلي
    const storedCompletedTests = localStorage.getItem("completedTests");
    if (storedCompletedTests) {
      const parsedTests = JSON.parse(storedCompletedTests);
      setCompletedTests(parsedTests);
    }

    // استرجاع التحاليل قيد الانتظار من التخزين المحلي
    const storedPendingTests = localStorage.getItem("pendingTests");
    if (storedPendingTests) {
      const parsedTests = JSON.parse(storedPendingTests);
      setPendingTests(parsedTests);
    }

    // دمج جميع التحاليل
    const allTests = [
      ...(storedCompletedTests ? JSON.parse(storedCompletedTests) : []),
      ...(storedPendingTests ? JSON.parse(storedPendingTests) : []),
    ];
    setTests(allTests);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // تصفية التحاليل بناءً على مصطلح البحث
  const filteredTests = tests.filter(
    (test) =>
      test.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testType?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredPendingTests = pendingTests.filter(
    (test) =>
      test.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testType?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredCompletedTests = completedTests.filter(
    (test) =>
      test.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testType?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // عرض التحاليل المناسبة بناءً على التبويب النشط
  const getActiveTabTests = () => {
    switch (activeTab) {
      case "pending":
        return filteredPendingTests;
      case "completed":
        return filteredCompletedTests;
      default:
        return filteredTests;
    }
  };

  const activeTests = getActiveTabTests();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">قائمة التحاليل</h1>
        <Link to="/patient-registration">
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            تحليل جديد
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>التحاليل</CardTitle>
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن تحليل..."
                className="pr-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">الكل ({tests.length})</TabsTrigger>
              <TabsTrigger value="pending">
                قيد الانتظار ({pendingTests.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                مكتمل ({completedTests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {activeTests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-right py-3 px-4 font-medium">
                          المريض
                        </th>
                        <th className="text-right py-3 px-4 font-medium">
                          نوع التحليل
                        </th>
                        <th className="text-right py-3 px-4 font-medium">
                          التاريخ
                        </th>
                        <th className="text-right py-3 px-4 font-medium">
                          الحالة
                        </th>
                        <th className="text-right py-3 px-4 font-medium">
                          الإجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTests.map((test) => (
                        <tr
                          key={test.id}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="py-3 px-4">{test.patientName}</td>
                          <td className="py-3 px-4">{test.testType}</td>
                          <td className="py-3 px-4">{test.date}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                test.status === "completed"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {test.status === "completed"
                                ? "مكتمل"
                                : "قيد الانتظار"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(`/results?testId=${test.id}`)
                                }
                              >
                                <Eye className="h-4 w-4 ml-2" />
                                عرض
                              </Button>
                              {test.status === "completed" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4 ml-2" />
                                    تم الإكمال
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      // طباعة التقرير
                                      navigate(
                                        `/results?testId=${test.id}&print=true`,
                                      );
                                    }}
                                  >
                                    <Printer className="h-4 w-4 ml-2" />
                                    طباعة
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      // تنزيل التقرير كملف PDF
                                      navigate(
                                        `/results?testId=${test.id}&download=true`,
                                      );
                                    }}
                                  >
                                    <FileDown className="h-4 w-4 ml-2" />
                                    PDF
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد تحاليل متاحة. يمكنك إضافة تحليل جديد بالضغط على زر
                  "تحليل جديد"
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestsPage;
