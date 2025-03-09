import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer, Download, FileDown } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";

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
  reportDate = new Date().toLocaleDateString(),
  reportNumber = "12345",
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

    // تحديد نطاق الطباعة ليكون مثل نطاق PDF
    const reportElement = document.getElementById("test-report-content");
    if (reportElement) {
      const activeTabContent = reportElement.querySelector(
        '[data-state="active"]',
      );
      if (activeTabContent) {
        const reportCard = activeTabContent.querySelector(".report-card");
        if (reportCard) {
          // إضافة فئة خاصة للطباعة
          reportCard.classList.add("print-only");
        }
      }
    }

    window.print();

    // إزالة الفئات بعد الطباعة
    setTimeout(() => {
      document.body.classList.remove("printing-report");
      const printOnlyElements = document.querySelectorAll(".print-only");
      printOnlyElements.forEach((el) => el.classList.remove("print-only"));
    }, 500);
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
                  reportType={patientGender === "ذكر" ? "male" : "female"}
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
