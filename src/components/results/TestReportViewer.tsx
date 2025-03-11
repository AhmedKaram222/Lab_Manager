import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer, Download, FileDown, Save } from "lucide-react";
import FormattedText from "@/components/ui/formatted-text";
import FormattedInput from "@/components/ui/formatted-input";
import { toast } from "@/components/ui/use-toast";

// تحديد نوع تقرير CBC بناءً على العمر والجنس
const getReportTypeForCBC = (
  age: string = "",
  gender: string = "",
): "age1-2" | "age2-6" | "age6-12" | "male" | "female" => {
  // تحويل العمر إلى رقم
  const ageNum = parseInt(age);

  // إذا كان العمر غير صالح، نستخدم الجنس
  if (isNaN(ageNum)) {
    return gender === "ذكر" || gender === "Male" ? "male" : "female";
  }

  // تحديد النوع بناءً على العمر
  if (ageNum >= 1 && ageNum < 2) {
    return "age1-2";
  } else if (ageNum >= 2 && ageNum < 6) {
    return "age2-6";
  } else if (ageNum >= 6 && ageNum < 12) {
    return "age6-12";
  } else {
    // للأعمار 12 وما فوق، نستخدم الجنس
    return gender === "ذكر" || gender === "Male" ? "male" : "female";
  }
};
import CBCReport from "../lab-reports/CBCReport";
import LipidProfileReport from "../lab-reports/LipidProfileReport";
import BloodSugarReport from "../lab-reports/BloodSugarReport";
import RenalFunctionReport from "../lab-reports/RenalFunctionReport";
import HPyloriReport from "../lab-reports/HPyloriReport";
import CRPReport from "../lab-reports/CRPReport";
import ProthrombinTimeReport from "../lab-reports/ProthrombinTimeReport";
import PregnancyTestReport from "../lab-reports/PregnancyTestReport";
import StoolAnalysisReport from "../lab-reports/StoolAnalysisReport";
import { downloadTestReport } from "@/lib/pdfUtils";

interface TestReportViewerProps {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  reportDate?: string;
  reportNumber?: string;
  doctorName?: string;
  reportType?: string; // نوع التقرير: cbc, lipid, sugar, etc.
}

const TestReportViewer = ({
  patientName = "محمد أحمد",
  patientAge = "35",
  patientGender = "ذكر",
  reportDate = new Date().toLocaleDateString("en-GB"), // تنسيق DD/MM/YYYY
  reportNumber = `result_${new Date().toLocaleDateString("en-GB").replace(/\//g, "")}`,
  doctorName = "د. أحمد محمد",
  reportType,
}: TestReportViewerProps) => {
  const [activeTab, setActiveTab] = useState("cbc");

  // تعيين التبويب النشط بناءً على نوع التقرير إذا تم تمريره
  useEffect(() => {
    if (reportType) {
      setActiveTab(reportType);
    }
  }, [reportType]);
  const [isDownloading, setIsDownloading] = useState(false);

  // تعيين اسم التقرير بناءً على التبويب النشط
  const getReportTypeName = () => {
    const reportTypes: Record<string, string> = {
      cbc: "Complete Blood Count",
      lipid: "Lipid Profile",
      sugar: "Blood Sugar",
      renal: "Renal Function",
      hpylori: "H.Pylori Test",
      crp: "CRP Test",
      pt: "Prothrombin Time",
      pregnancy: "Pregnancy Test",
      stool: "Stool Analysis",
    };
    return reportTypes[activeTab] || "Medical Report";
  };

  const handlePrint = () => {
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
        // إزالة الفئات في حالة حدوث خطأ
        document.body.classList.remove("printing-report");
      }
    }, 100);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const reportTypeName = getReportTypeName();
      const success = await downloadTestReport(reportTypeName, patientName);

      if (success) {
        toast({
          title: "تم تنزيل التقرير بنجاح",
          description: `تم تنزيل تقرير ${reportTypeName} بصيغة PDF`,
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

  // حفظ نتيجة التحليل
  const handleSaveTestResult = (reportType: string) => {
    // إنشاء كائن نتيجة التحليل
    const testResult = {
      id: reportNumber || `result_${new Date().getTime()}`,
      patientId: reportNumber?.split("_")[2] || "1",
      patientName: patientName,
      testType: getReportTypeName(),
      date: new Date().toLocaleDateString(),
      resultDate: new Date().toLocaleDateString(),
      age: patientAge,
      gender: patientGender,
      status: "completed",
      reportType: reportType,
    };

    // حفظ النتيجة في التخزين المحلي
    const storedCompletedTests = localStorage.getItem("completedTests") || "[]";
    const completedTests = JSON.parse(storedCompletedTests);

    // التحقق من عدم وجود نتيجة مكررة
    const existingTestIndex = completedTests.findIndex(
      (test) => test.id === testResult.id,
    );
    if (existingTestIndex !== -1) {
      // تحديث النتيجة الموجودة
      completedTests[existingTestIndex] = testResult;
    } else {
      // إضافة نتيجة جديدة
      completedTests.push(testResult);
    }

    // حفظ التغييرات
    localStorage.setItem("completedTests", JSON.stringify(completedTests));

    // عرض رسالة نجاح
    toast({
      title: "تم حفظ النتيجة بنجاح",
      description: `تم حفظ نتيجة تحليل ${getReportTypeName()} للمريض ${patientName}`,
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>عرض نتائج التحاليل</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              طباعة
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              <FileDown className="h-4 w-4 mr-2" />
              {isDownloading ? "جاري التنزيل..." : "تنزيل PDF"}
            </Button>
            <Button
              variant="default"
              onClick={() => handleSaveTestResult(activeTab)}
            >
              <Save className="h-4 w-4 mr-2" />
              حفظ النتيجة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 mb-4">
              <TabsTrigger value="cbc">CBC</TabsTrigger>
              <TabsTrigger value="lipid">Lipid Profile</TabsTrigger>
              <TabsTrigger value="sugar">Blood Sugar</TabsTrigger>
              <TabsTrigger value="renal">Renal Function</TabsTrigger>
              <TabsTrigger value="hpylori">H.Pylori</TabsTrigger>
              <TabsTrigger value="crp">CRP</TabsTrigger>
              <TabsTrigger value="pt">PT</TabsTrigger>
              <TabsTrigger value="pregnancy">Pregnancy</TabsTrigger>
              <TabsTrigger value="stool">Stool Analysis</TabsTrigger>
            </TabsList>

            <div
              id="test-report-content"
              className="report-content-wrapper"
              data-pdf-container="true"
              style={{ position: "relative", pageBreakInside: "avoid" }}
            >
              <TabsContent value="cbc">
                <CBCReport
                  patientName={patientName}
                  patientAge={patientAge}
                  patientGender={patientGender === "ذكر" ? "Male" : "Female"}
                  reportDate={reportDate}
                  reportNumber={reportNumber}
                  doctorName={doctorName}
                  reportType={getReportTypeForCBC(patientAge, patientGender)}
                />
              </TabsContent>

              <TabsContent value="lipid">
                <LipidProfileReport
                  patientName={patientName}
                  patientAge={patientAge}
                  patientGender={patientGender === "ذكر" ? "Male" : "Female"}
                  reportDate={reportDate}
                  reportNumber={reportNumber}
                  doctorName={doctorName}
                />
              </TabsContent>

              <TabsContent value="sugar">
                <BloodSugarReport
                  patientName={patientName}
                  patientAge={patientAge}
                  patientGender={patientGender === "ذكر" ? "Male" : "Female"}
                  reportDate={reportDate}
                  reportNumber={reportNumber}
                  doctorName={doctorName}
                  reportType="all"
                />
              </TabsContent>

              <TabsContent value="renal">
                <RenalFunctionReport
                  patientName={patientName}
                  patientAge={patientAge}
                  patientGender={patientGender === "ذكر" ? "Male" : "Female"}
                  reportDate={reportDate}
                  reportNumber={reportNumber}
                  doctorName={doctorName}
                />
              </TabsContent>

              <TabsContent value="hpylori">
                <HPyloriReport
                  patientName={patientName}
                  patientAge={patientAge}
                  patientGender={patientGender === "ذكر" ? "Male" : "Female"}
                  reportDate={reportDate}
                  reportNumber={reportNumber}
                  doctorName={doctorName}
                  reportType="qualitative"
                />
              </TabsContent>

              <TabsContent value="crp">
                <CRPReport
                  patientName={patientName}
                  patientAge={patientAge}
                  patientGender={patientGender === "ذكر" ? "Male" : "Female"}
                  reportDate={reportDate}
                  reportNumber={reportNumber}
                  doctorName={doctorName}
                />
              </TabsContent>

              <TabsContent value="pt">
                <ProthrombinTimeReport
                  patientName={patientName}
                  patientAge={patientAge}
                  patientGender={patientGender === "ذكر" ? "Male" : "Female"}
                  reportDate={reportDate}
                  reportNumber={reportNumber}
                  doctorName={doctorName}
                />
              </TabsContent>

              <TabsContent value="pregnancy">
                <PregnancyTestReport
                  patientName={patientName}
                  patientAge={patientAge}
                  reportDate={reportDate}
                  reportNumber={reportNumber}
                  doctorName={doctorName}
                />
              </TabsContent>

              <TabsContent value="stool">
                <StoolAnalysisReport
                  patientName={patientName}
                  patientAge={patientAge}
                  patientGender={patientGender === "ذكر" ? "Male" : "Female"}
                  reportDate={reportDate}
                  reportNumber={reportNumber}
                  doctorName={doctorName}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestReportViewer;
