import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ProthrombinTimeReportProps {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  reportDate?: string;
  reportNumber?: string;
  doctorName?: string;
}

const ProthrombinTimeReport = ({
  patientName = "",
  patientAge = "",
  patientGender = "",
  reportDate = new Date().toLocaleDateString(),
  reportNumber = "",
  doctorName = "",
}: ProthrombinTimeReportProps) => {
  // حالة لتخزين القيم القابلة للتعديل للقيم المرجعية
  const [normalRanges, setNormalRanges] = useState({
    pt: "10 - 14",
    control: "",
    conc: "70 - 110",
    inr: "0.8 - 1.3",
  });

  // حالة لتخزين التعليقات
  const [comments, setComments] = useState("");

  // حالة لتخزين نتائج التحليل
  const [results, setResults] = useState({
    pt: "",
    control: "",
    conc: "",
    inr: "",
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
      data-report-type="pt"
    >
      <CardHeader className="text-center bg-black text-white py-2 print-visible">
        <CardTitle>Prothrombin Time Test</CardTitle>
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

        {/* جدول نتائج تحليل زمن البروثرومبين */}
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-bold">
                Prothrombin Time (PT)
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.pt}
                  onChange={(e) => handleResultChange("pt", e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">Sec</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.pt}
                  onChange={(e) =>
                    handleNormalRangeChange("pt", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-bold">Control</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.control}
                  onChange={(e) =>
                    handleResultChange("control", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">Sec</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.control}
                  onChange={(e) =>
                    handleNormalRangeChange("control", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-bold">Conc</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.conc}
                  onChange={(e) => handleResultChange("conc", e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">%</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.conc}
                  onChange={(e) =>
                    handleNormalRangeChange("conc", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-bold">INR</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.inr}
                  onChange={(e) => handleResultChange("inr", e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center"></td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.inr}
                  onChange={(e) =>
                    handleNormalRangeChange("inr", e.target.value)
                  }
                />
              </td>
            </tr>
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

export default ProthrombinTimeReport;
