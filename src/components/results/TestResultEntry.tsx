import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  FileText,
  Printer,
  FileDown,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getPatients,
  getTestResults,
  addTestResult,
  getTestName,
  getReportTypeFromTestName,
} from "../tests/TestsService";
import TestReportViewer from "./TestReportViewer";
import { downloadTestReport } from "@/lib/pdfUtils";
import { toast } from "@/components/ui/use-toast";

const TestResultEntry = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [pendingTests, setPendingTests] = useState<any[]>([]);
  const [showTestForm, setShowTestForm] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  // استرجاع بيانات المرضى عند تحميل الصفحة
  useEffect(() => {
    // استرجاع بيانات المرضى من التخزين المحلي
    const storedPatients = getPatients();
    setPatients(storedPatients);

    // إنشاء قائمة بالتحاليل المعلقة
    const pendingTestsList = [];
    for (const patient of storedPatients) {
      // إضافة تحاليل المريض إلى القائمة
      if (patient.test1) {
        pendingTestsList.push({
          id: `${patient.id}_test1`,
          patientId: patient.id,
          fileCode: patient.fileCode,
          patientName: patient.name,
          testType: getTestName(patient.test1),
          date: patient.date || new Date().toLocaleDateString(),
          status: "pending",
          age: patient.age,
          gender: patient.gender === "male" ? "ذكر" : "أنثى",
        });
      }
      if (patient.test2) {
        pendingTestsList.push({
          id: `${patient.id}_test2`,
          patientId: patient.id,
          fileCode: patient.fileCode,
          patientName: patient.name,
          testType: getTestName(patient.test2),
          date: patient.date || new Date().toLocaleDateString(),
          status: "pending",
          age: patient.age,
          gender: patient.gender === "male" ? "ذكر" : "أنثى",
        });
      }
      if (patient.test3) {
        pendingTestsList.push({
          id: `${patient.id}_test3`,
          patientId: patient.id,
          fileCode: patient.fileCode,
          patientName: patient.name,
          testType: getTestName(patient.test3),
          date: patient.date || new Date().toLocaleDateString(),
          status: "pending",
          age: patient.age,
          gender: patient.gender === "male" ? "ذكر" : "أنثى",
        });
      }
    }
    setPendingTests(pendingTestsList);

    // استرجاع نتائج التحاليل المحفوظة
    const storedResults = getTestResults();
    setTestResults(storedResults);
  }, []);

  // استخدام دالة getTestName من TestsService

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // تصفية التحاليل بناءً على مصطلح البحث
  const filteredTests = pendingTests.filter(
    (test) =>
      test.patientName.includes(searchTerm) ||
      test.fileCode.includes(searchTerm) ||
      test.testType.includes(searchTerm),
  );

  // فتح نموذج إدخال نتائج التحليل
  const handleEnterResults = (test: any) => {
    setSelectedTest(test);
    setShowTestForm(true);
  };

  // حفظ نتائج التحليل
  const handleSaveResults = () => {
    if (selectedTest) {
      // إنشاء نتيجة تحليل جديدة
      const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "");
      const patientCount =
        patients
          .filter((p) => {
            const patientDate = new Date(p.date)
              .toLocaleDateString("en-GB")
              .replace(/\//g, "");
            return patientDate === today;
          })
          .findIndex((p) => p.id === selectedTest.patientId) + 1;

      const newResult = {
        id: `result_${today}_${patientCount > 0 ? patientCount : 1}`,
        patientId: selectedTest.patientId,
        patientName: selectedTest.patientName,
        testType: selectedTest.testType,
        date: selectedTest.date,
        resultDate: new Date().toLocaleDateString("en-GB"), // تنسيق DD/MM/YYYY
        age: selectedTest.age,
        gender: selectedTest.gender,
        status: "completed",
      };

      // إضافة النتيجة إلى قائمة النتائج
      const updatedResults = [...testResults, newResult];
      setTestResults(updatedResults);
      localStorage.setItem("testResults", JSON.stringify(updatedResults));

      // إزالة التحليل من قائمة التحاليل المعلقة
      const updatedPendingTests = pendingTests.filter(
        (test) => test.id !== selectedTest.id,
      );
      setPendingTests(updatedPendingTests);

      // إغلاق نموذج إدخال النتائج
      setShowTestForm(false);
      setSelectedTest(null);

      // العودة إلى صفحة النتائج
      navigate("/results");
    }
  };

  // العودة إلى قائمة التحاليل
  const handleBackToList = () => {
    setShowTestForm(false);
    setSelectedTest(null);
  };

  // تحميل التقرير كملف PDF
  const handleDownloadPDF = async () => {
    if (!selectedTest) return;

    setIsDownloading(true);
    try {
      // تحديد نوع التقرير بناءً على نوع التحليل
      const reportTabType = getReportTypeFromTestName(selectedTest.testType);
      let reportType = "Medical Report";

      switch (reportTabType) {
        case "cbc":
          reportType = "Complete Blood Count";
          break;
        case "sugar":
          reportType = "Blood Sugar";
          break;
        case "renal":
          reportType = "Renal Function";
          break;
        case "lipid":
          reportType = "Lipid Profile";
          break;
        case "stool":
          reportType = "Stool Analysis";
          break;
        case "hpylori":
          reportType = "H.Pylori Test";
          break;
        case "crp":
          reportType = "CRP Test";
          break;
        case "pt":
          reportType = "Prothrombin Time";
          break;
        default:
          reportType = "Medical Report";
      }

      const success = await downloadTestReport(
        reportType,
        selectedTest.patientName,
      );

      if (success) {
        toast({
          title: "تم تنزيل التقرير بنجاح",
          description: `تم تنزيل تقرير ${selectedTest.testType} بصيغة PDF`,
          variant: "default",
        });
      } else {
        toast({
          title: "خطأ في تنزيل التقرير",
          description: "حدث خطأ أثناء إنشاء ملف PDF",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "خطأ في تنزيل التقرير",
        description: "حدث خطأ غير متوقع أثناء إنشاء ملف PDF",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // عرض نموذج إدخال نتائج التحليل
  if (showTestForm && selectedTest) {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">إدخال نتائج التحليل</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة إلى القائمة
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // إضافة فئة للطباعة على عنصر الجسم
                document.body.classList.add("printing-report");

                // تأخير قصير للسماح بتحديث DOM
                setTimeout(() => {
                  try {
                    // استخدام واجهة برمجة التطبيقات للطباعة لعرض مربع حوار الطابعات
                    const mediaQueryList = window.matchMedia("print");

                    // إضافة مستمع للحدث لمعرفة متى تنتهي الطباعة
                    const handlePrintEvent = (mql) => {
                      if (!mql.matches) {
                        // تمت الطباعة أو تم إلغاؤها
                        document.body.classList.remove("printing-report");
                        mediaQueryList.removeListener(handlePrintEvent);
                      }
                    };

                    mediaQueryList.addListener(handlePrintEvent);
                    window.print();
                  } catch (error) {
                    console.error("Print error:", error);
                    // إزالة الفئة في حالة حدوث خطأ
                    document.body.classList.remove("printing-report");
                  }
                }, 100);
              }}
            >
              <Printer className="h-4 w-4 ml-2" />
              طباعة
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              <FileDown className="h-4 w-4 ml-2" />
              {isDownloading ? "جاري التنزيل..." : "تنزيل PDF"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedTest.testType} - {selectedTest.patientName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium mb-1">اسم المريض:</p>
                <p>{selectedTest.patientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">رقم الملف:</p>
                <p>{selectedTest.fileCode}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">نوع التحليل:</p>
                <p>{selectedTest.testType}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">تاريخ الطلب:</p>
                <p>{selectedTest.date}</p>
              </div>
            </div>

            {/* عرض نموذج التحليل المناسب */}
            <div
              className="mt-6"
              id="test-report-content"
              data-pdf-container="true"
              style={{ position: "relative" }}
            >
              <TestReportViewer
                patientName={selectedTest.patientName}
                patientAge={selectedTest.age}
                patientGender={selectedTest.gender}
                reportNumber={selectedTest.fileCode}
                reportType={getReportTypeFromTestName(selectedTest.testType)}
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveResults}>
                <Save className="h-4 w-4 ml-2" />
                حفظ النتائج
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold">إدخال نتائج التحاليل</h1>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>البحث عن تحليل</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث باسم المريض أو رقم الملف"
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
              <TabsTrigger value="inprogress">جاري التنفيذ</TabsTrigger>
              <TabsTrigger value="all">جميع التحاليل</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-right py-3 px-4 font-medium">
                        رقم الملف
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        اسم المريض
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        نوع التحليل
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        تاريخ الطلب
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
                    {filteredTests.length > 0 ? (
                      filteredTests.map((test) => (
                        <tr
                          key={test.id}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="py-3 px-4">{test.fileCode}</td>
                          <td className="py-3 px-4">{test.patientName}</td>
                          <td className="py-3 px-4">{test.testType}</td>
                          <td className="py-3 px-4">{test.date}</td>
                          <td className="py-3 px-4">
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                              قيد الانتظار
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEnterResults(test)}
                              >
                                <FileText className="h-4 w-4 ml-2" />
                                إدخال النتائج
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-muted-foreground"
                        >
                          لا توجد تحاليل قيد الانتظار
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="inprogress">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-right py-3 px-4 font-medium">
                        رقم الملف
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        اسم المريض
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        نوع التحليل
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        تاريخ الطلب
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
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        لا توجد تحاليل جاري تنفيذها
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="all">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-right py-3 px-4 font-medium">
                        رقم الملف
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        اسم المريض
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        نوع التحليل
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        تاريخ الطلب
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
                    {filteredTests.length > 0 ? (
                      filteredTests.map((test) => (
                        <tr
                          key={test.id}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="py-3 px-4">{test.fileCode}</td>
                          <td className="py-3 px-4">{test.patientName}</td>
                          <td className="py-3 px-4">{test.testType}</td>
                          <td className="py-3 px-4">{test.date}</td>
                          <td className="py-3 px-4">
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                              قيد الانتظار
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEnterResults(test)}
                              >
                                <FileText className="h-4 w-4 ml-2" />
                                إدخال النتائج
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-muted-foreground"
                        >
                          لا توجد تحاليل متاحة
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResultEntry;
