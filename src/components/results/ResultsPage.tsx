import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, FileText, Printer, FileDown, Plus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import TestReportViewer from "./TestReportViewer";
import {
  getPatients,
  getTestResults,
  getReportTypeFromTestName,
} from "../tests/TestsService";
import { downloadTestReport } from "@/lib/pdfUtils";
import { toast } from "@/components/ui/use-toast";

const ResultsPage = () => {
  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
    age: string;
    gender: string;
    testType?: string;
    reportType?: string;
  } | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  // استرجاع بيانات المرضى ونتائج التحاليل عند تحميل الصفحة
  useEffect(() => {
    // استرجاع بيانات المرضى من التخزين المحلي
    const storedPatients = getPatients();
    setPatients(storedPatients);

    // إنشاء بيانات افتراضية لنتائج التحاليل إذا لم تكن موجودة
    const storedResults = getTestResults();
    if (storedResults.length === 0) {
      // إنشاء بيانات افتراضية
      const defaultResults = [
        {
          id: "1",
          patientId: "1",
          patientName: "أحمد محمد",
          testType: "تحليل دم شامل",
          date: "2023-06-15",
          resultDate: "2023-06-15",
          age: "45",
          gender: "ذكر",
        },
        {
          id: "4",
          patientId: "2",
          patientName: "فاطمة حسن",
          testType: "سكر صائم",
          date: "2023-06-15",
          resultDate: "2023-06-15",
          age: "32",
          gender: "أنثى",
        },
        {
          id: "8",
          patientId: "3",
          patientName: "سمير عادل",
          testType: "وظائف كبد",
          date: "2023-06-14",
          resultDate: "2023-06-14",
          age: "38",
          gender: "ذكر",
        },
      ];
      setTestResults(defaultResults);
    } else {
      setTestResults(storedResults);
    }

    // إضافة نتائج تحاليل للمرضى الجدد إذا لم تكن موجودة
    if (storedPatients.length > 0) {
      const newResults = [];
      for (const patient of storedPatients) {
        // التحقق مما إذا كان المريض لديه نتائج تحاليل بالفعل
        const hasResults = storedResults.some(
          (result) => result.patientId === patient.id,
        );
        if (!hasResults) {
          // إنشاء نتيجة تحليل افتراضية للمريض الجديد
          const newResult = {
            id: `result_${Date.now()}_${patient.id}`,
            patientId: patient.id,
            patientName: patient.name,
            testType: patient.test1 ? "تحليل دم شامل" : "فحص عام",
            date: patient.date || new Date().toLocaleDateString(),
            resultDate: new Date().toLocaleDateString(),
            age: patient.age,
            gender: patient.gender === "male" ? "ذكر" : "أنثى",
          };
          newResults.push(newResult);
        }
      }

      // إضافة النتائج الجديدة إلى القائمة الحالية
      if (newResults.length > 0) {
        const updatedResults = [...storedResults, ...newResults];
        setTestResults(updatedResults);
        localStorage.setItem("testResults", JSON.stringify(updatedResults));
      }
    }

    // التحقق من وجود معرف تحليل في عنوان URL
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get("testId");
    const shouldPrint = urlParams.get("print") === "true";
    const shouldDownload = urlParams.get("download") === "true";

    if (testId) {
      // البحث عن التحليل بواسطة المعرف
      const test =
        storedResults.find((t) => t.id === testId) ||
        JSON.parse(localStorage.getItem("completedTests") || "[]").find(
          (t) => t.id === testId,
        );

      if (test) {
        setSelectedPatient({
          id: test.id,
          name: test.patientName,
          age: test.age,
          gender: test.gender,
          reportType:
            test.reportType || getReportTypeFromTestName(test.testType),
        });
        setShowReport(true);

        // إذا كان هناك طلب للطباعة أو التنزيل، قم بتنفيذه بعد تحميل التقرير
        if (shouldPrint || shouldDownload) {
          setTimeout(() => {
            if (shouldPrint) {
              // طباعة التقرير
              document.body.classList.add("printing-report");
              window.print();
              setTimeout(() => {
                document.body.classList.remove("printing-report");
                // إعادة توجيه المستخدم إلى صفحة التحاليل بعد الطباعة
                navigate("/tests");
              }, 1000);
            } else if (shouldDownload) {
              // تنزيل التقرير كملف PDF
              handleDownloadPDF(test);
              // إعادة توجيه المستخدم إلى صفحة التحاليل بعد التنزيل
              setTimeout(() => navigate("/tests"), 2000);
            }
          }, 1000);
        }
      }
    }
  }, [navigate]);

  const handleViewResults = (patient: {
    id: string;
    name: string;
    age: string;
    gender: string;
    testType?: string;
  }) => {
    setSelectedPatient(patient);
    setShowReport(true);
  };

  const handleBackToList = () => {
    setShowReport(false);
    setSelectedPatient(null);
  };

  const handleEnterResults = () => {
    navigate("/results/entry");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // تحميل التقرير كملف PDF
  const handleDownloadPDF = async (test: any) => {
    setIsDownloading(true);
    try {
      // تحديد نوع التقرير بناءً على نوع التحليل
      const reportTabType = getReportTypeFromTestName(test.testType);
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

      // تعيين المريض المحدد لعرض التقرير
      const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "");
      const patientCount =
        patients
          .filter((p) => {
            const patientDate = new Date(p.date)
              .toLocaleDateString("en-GB")
              .replace(/\//g, "");
            return patientDate === today;
          })
          .findIndex((p) => p.id === test.patientId) + 1;

      setSelectedPatient({
        id: test.id,
        name: test.patientName,
        age: test.age,
        gender: test.gender,
        testType: reportType,
        reportType: reportTabType,
        reportNumber: `result_${today}_${patientCount > 0 ? patientCount : 1}`,
      });

      // تعيين المريض المحدد وتأخير قصير للسماح بتحديث واجهة المستخدم
      setShowReport(true);
      setTimeout(async () => {
        const success = await downloadTestReport(reportType, test.patientName);

        if (success) {
          toast({
            title: "تم تنزيل التقرير بنجاح",
            description: `تم تنزيل تقرير ${test.testType} بصيغة PDF`,
            variant: "default",
          });
        } else {
          toast({
            title: "خطأ في تنزيل التقرير",
            description: "حدث خطأ أثناء إنشاء ملف PDF",
            variant: "destructive",
          });
        }
        setIsDownloading(false);
        // تأخير إضافي قبل إخفاء التقرير
        setTimeout(() => {
          setShowReport(false);
          setSelectedPatient(null);
        }, 500);
      }, 1000);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "خطأ في تنزيل التقرير",
        description: "حدث خطأ غير متوقع أثناء إنشاء ملف PDF",
        variant: "destructive",
      });
      setIsDownloading(false);
    }
  };

  // تصفية النتائج بناءً على مصطلح البحث
  const filteredResults = testResults.filter(
    (result) =>
      result.patientName.includes(searchTerm) ||
      result.testType.includes(searchTerm),
  );

  if (showReport && selectedPatient) {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">نتائج التحاليل</h1>
          <Button variant="outline" onClick={handleBackToList}>
            العودة إلى القائمة
          </Button>
        </div>

        <TestReportViewer
          patientName={selectedPatient.name}
          patientAge={selectedPatient.age}
          patientGender={selectedPatient.gender}
          reportNumber={selectedPatient.id}
          reportType={selectedPatient.reportType}
        />
      </div>
    );
  }

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
              <Input
                placeholder="بحث عن نتيجة..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
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
                {filteredResults.length > 0 ? (
                  filteredResults.map((test) => (
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleViewResults({
                                id: test.id,
                                name: test.patientName,
                                age: test.age,
                                gender: test.gender,
                                reportType: getReportTypeFromTestName(
                                  test.testType,
                                ),
                              })
                            }
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            عرض
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // تعيين المريض المحدد لعرض التقرير
                              setSelectedPatient({
                                id: test.id,
                                name: test.patientName,
                                age: test.age,
                                gender: test.gender,
                                reportType: getReportTypeFromTestName(
                                  test.testType,
                                ),
                              });

                              // عرض التقرير
                              setShowReport(true);

                              // تأخير قصير للسماح بتحديث واجهة المستخدم
                              setTimeout(() => {
                                // إضافة فئة للطباعة على عنصر الجسم
                                document.body.classList.add("printing-report");

                                // تحديد نطاق الطباعة ليكون مثل نطاق PDF
                                const reportElement = document.getElementById(
                                  "test-report-content",
                                );
                                if (reportElement) {
                                  const activeTabContent =
                                    reportElement.querySelector(
                                      '[data-state="active"]',
                                    );
                                  if (activeTabContent) {
                                    const reportCard =
                                      activeTabContent.querySelector(
                                        ".report-card",
                                      );
                                    if (reportCard) {
                                      // إضافة فئة خاصة للطباعة
                                      reportCard.classList.add("print-only");
                                    }
                                  }
                                }

                                // استخدام واجهة برمجة التطبيقات للطباعة لعرض مربع حوار الطابعات
                                const mediaQueryList =
                                  window.matchMedia("print");

                                // إضافة مستمع للحدث لمعرفة متى تنتهي الطباعة
                                const handlePrintEvent = (mql) => {
                                  if (!mql.matches) {
                                    // تمت الطباعة أو تم إلغاؤها
                                    document.body.classList.remove(
                                      "printing-report",
                                    );
                                    const printOnlyElements =
                                      document.querySelectorAll(".print-only");
                                    printOnlyElements.forEach((el) =>
                                      el.classList.remove("print-only"),
                                    );

                                    // إخفاء التقرير بعد الطباعة
                                    setShowReport(false);
                                    setSelectedPatient(null);

                                    // إزالة المستمع
                                    mediaQueryList.removeListener(
                                      handlePrintEvent,
                                    );
                                  }
                                };

                                mediaQueryList.addListener(handlePrintEvent);
                                window.print();
                              }, 1000);
                            }}
                          >
                            <Printer className="h-4 w-4 mr-2" />
                            طباعة
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPDF(test)}
                            disabled={isDownloading}
                          >
                            <FileDown className="h-4 w-4 mr-2" />
                            {isDownloading ? "جاري..." : "PDF"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      لا توجد نتائج تحاليل متاحة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsPage;
