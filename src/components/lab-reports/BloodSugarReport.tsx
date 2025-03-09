import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface BloodSugarReportProps {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  reportDate?: string;
  reportNumber?: string;
  doctorName?: string;
  reportType?: "fasting" | "random" | "postprandial" | "all";
}

const BloodSugarReport = ({
  patientName = "",
  patientAge = "",
  patientGender = "",
  reportDate = new Date().toLocaleDateString(),
  reportNumber = "",
  doctorName = "",
  reportType = "all",
}: BloodSugarReportProps) => {
  // حالة لتخزين القيم القابلة للتعديل للقيم المرجعية
  const [normalRanges, setNormalRanges] = useState({
    fbs: "60 - 110",
    rbs: "60 - 140",
    pps: "60 - 140",
  });

  // حالة لتخزين التعليقات
  const [comments, setComments] = useState("");

  // حالة لتخزين نتائج التحليل
  const [results, setResults] = useState({
    fbs: "",
    rbs: "",
    pps: "",
  });

  // تحديث قيمة مرجعية
  const handleNormalRangeChange = (field: string, value: string) => {
    setNormalRanges({
      ...normalRanges,
      [field]: value,
    });
  };

  // تحديث نتيجة
  const handleResultChange = (field: string, value: string) => {
    setResults({
      ...results,
      [field]: value,
    });
  };

  return (
    <Card
      className="w-full max-w-4xl mx-auto bg-white report-card"
      data-report-type="sugar"
    >
      <CardHeader className="text-center bg-black text-white py-2 print-visible">
        <CardTitle>Blood Sugar Test</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* معلومات المريض - يمكن إضافتها حسب الحاجة */}
        {(patientName ||
          patientAge ||
          patientGender ||
          reportDate ||
          reportNumber ||
          doctorName) && (
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              {patientName && (
                <div>
                  <span className="font-bold">Patient Name:</span> {patientName}
                </div>
              )}
              {patientAge && (
                <div>
                  <span className="font-bold">Age:</span> {patientAge}
                </div>
              )}
              {patientGender && (
                <div>
                  <span className="font-bold">Gender:</span> {patientGender}
                </div>
              )}
              {reportDate && (
                <div>
                  <span className="font-bold">Date:</span> {reportDate}
                </div>
              )}
              {reportNumber && (
                <div>
                  <span className="font-bold">Report No:</span> {reportNumber}
                </div>
              )}
              {doctorName && (
                <div>
                  <span className="font-bold">Doctor:</span> {doctorName}
                </div>
              )}
            </div>
          </div>
        )}

        {/* جدول نتائج تحليل السكر */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Test</th>
              <th className="border border-gray-300 p-2 text-center">Result</th>
              <th className="border border-gray-300 p-2 text-center">Unit</th>
              <th className="border border-gray-300 p-2 text-center">
                Ref.Range
              </th>
            </tr>
          </thead>
          <tbody>
            {(reportType === "fasting" || reportType === "all") && (
              <tr>
                <td className="border border-gray-300 p-2 font-bold">
                  Fasting Blood Sugar [ FBS ]
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.fbs}
                    onChange={(e) => handleResultChange("fbs", e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  mg/dl
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={normalRanges.fbs}
                    onChange={(e) =>
                      handleNormalRangeChange("fbs", e.target.value)
                    }
                  />
                </td>
              </tr>
            )}
            {(reportType === "random" || reportType === "all") && (
              <tr>
                <td className="border border-gray-300 p-2 font-bold">
                  Random Blood Sugar [ RBS ]
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.rbs}
                    onChange={(e) => handleResultChange("rbs", e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  mg/dl
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={normalRanges.rbs}
                    onChange={(e) =>
                      handleNormalRangeChange("rbs", e.target.value)
                    }
                  />
                </td>
              </tr>
            )}
            {(reportType === "postprandial" || reportType === "all") && (
              <tr>
                <td className="border border-gray-300 p-2 font-bold">
                  Postprandial Blood Sugar [ PPS ]
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.pps}
                    onChange={(e) => handleResultChange("pps", e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  mg/dl
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={normalRanges.pps}
                    onChange={(e) =>
                      handleNormalRangeChange("pps", e.target.value)
                    }
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* قسم التعليقات */}
        <div className="mt-4 p-4 border-t border-gray-200">
          <div className="font-bold mb-2">Comments:</div>
          <Textarea
            className="w-full"
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any comments or notes here..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BloodSugarReport;
