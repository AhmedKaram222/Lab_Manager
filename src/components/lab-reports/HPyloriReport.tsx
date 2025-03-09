import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface HPyloriReportProps {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  reportDate?: string;
  reportNumber?: string;
  doctorName?: string;
  reportType?: "qualitative" | "quantitative";
}

const HPyloriReport = ({
  patientName = "",
  patientAge = "",
  patientGender = "",
  reportDate = new Date().toLocaleDateString(),
  reportNumber = "",
  doctorName = "",
  reportType = "qualitative",
}: HPyloriReportProps) => {
  // حالة لتخزين القيم القابلة للتعديل للقيم المرجعية
  const [normalRanges, setNormalRanges] = useState({
    qualitative: "Negative",
    quantitative: "Negative < 0.9\nEquivocal 0.9 - 1.1\nPositive > 1.1",
  });

  // حالة لتخزين التعليقات
  const [comments, setComments] = useState("");

  // حالة لتخزين نتائج التحليل
  const [results, setResults] = useState({
    qualitative: "",
    quantitative: "",
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
      data-report-type="hpylori"
    >
      <CardHeader className="text-center bg-black text-white py-2 print-visible">
        <CardTitle>H.Pylori Test</CardTitle>
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

        {/* جدول نتائج تحليل H.Pylori */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Test</th>
              {reportType === "qualitative" ? (
                <>
                  <th className="border border-gray-300 p-2 text-center">
                    Result
                  </th>
                  <th className="border border-gray-300 p-2 text-center">
                    Normal
                  </th>
                </>
              ) : (
                <>
                  <th className="border border-gray-300 p-2 text-center">
                    Result
                  </th>
                  <th className="border border-gray-300 p-2 text-center">
                    Unit
                  </th>
                  <th className="border border-gray-300 p-2 text-center">
                    Reference Range
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {reportType === "qualitative" ? (
              <tr>
                <td className="border border-gray-300 p-2 font-bold">
                  H.Pylori Ag
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.qualitative}
                    onChange={(e) =>
                      handleResultChange("qualitative", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={normalRanges.qualitative}
                    onChange={(e) =>
                      handleNormalRangeChange("qualitative", e.target.value)
                    }
                  />
                </td>
              </tr>
            ) : (
              <tr>
                <td className="border border-gray-300 p-2 font-bold">
                  H.Pylori Ag
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.quantitative}
                    onChange={(e) =>
                      handleResultChange("quantitative", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  ng / ml
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <textarea
                    className="w-full h-20 p-1 text-sm"
                    value={normalRanges.quantitative}
                    onChange={(e) =>
                      handleNormalRangeChange("quantitative", e.target.value)
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

export default HPyloriReport;
