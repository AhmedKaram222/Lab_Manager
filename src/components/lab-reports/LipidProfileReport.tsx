import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface LipidProfileReportProps {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  reportDate?: string;
  reportNumber?: string;
  doctorName?: string;
}

const LipidProfileReport = ({
  patientName = "",
  patientAge = "",
  patientGender = "",
  reportDate = new Date().toLocaleDateString(),
  reportNumber = "",
  doctorName = "",
}: LipidProfileReportProps) => {
  // حالة لتخزين القيم القابلة للتعديل للقيم المرجعية
  const [normalRanges, setNormalRanges] = useState({
    cholesterol: "Less than 200...Normal\n200-239...Borderline\n>240...High",
    triglycerides: "35 - 135",
    hdl: "Low Risk > 65\nModerate risk 45 - 65\nHigh Risk < 45",
    ldl: "Low risk...<130\nModerate risk...130-160\nHigh risk...>160",
    vldl: "Up to 30",
    ldlHdlRatio:
      "Low risk...0.5-3.0\nModerate risk...3.0-6.0\nHigh risk...>6.0",
  });

  // حالة لتخزين التعليقات
  const [comments, setComments] = useState("");

  // حالة لتخزين نتائج التحليل
  const [results, setResults] = useState({
    cholesterol: "",
    triglycerides: "",
    hdl: "",
    ldl: "",
    vldl: "",
    ldlHdlRatio: "",
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
      data-report-type="lipid"
    >
      <CardHeader className="text-center bg-black text-white py-2 print-visible">
        <CardTitle>Lipid Profile</CardTitle>
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

        {/* جدول نتائج تحليل الدهون */}
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
            <tr>
              <td className="border border-gray-300 p-2 font-bold underline">
                Cholesterol
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.cholesterol}
                  onChange={(e) =>
                    handleResultChange("cholesterol", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">mg/dl</td>
              <td className="border border-gray-300 p-2 text-center">
                <textarea
                  className="w-full h-20 p-1 text-sm"
                  value={normalRanges.cholesterol}
                  onChange={(e) =>
                    handleNormalRangeChange("cholesterol", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Triglycerides</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.triglycerides}
                  onChange={(e) =>
                    handleResultChange("triglycerides", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">mg/dl</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.triglycerides}
                  onChange={(e) =>
                    handleNormalRangeChange("triglycerides", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">HDL</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.hdl}
                  onChange={(e) => handleResultChange("hdl", e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">mg/dl</td>
              <td className="border border-gray-300 p-2 text-center">
                <textarea
                  className="w-full h-20 p-1 text-sm"
                  value={normalRanges.hdl}
                  onChange={(e) =>
                    handleNormalRangeChange("hdl", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">LDL</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.ldl}
                  onChange={(e) => handleResultChange("ldl", e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">mg/dl</td>
              <td className="border border-gray-300 p-2 text-center">
                <textarea
                  className="w-full h-20 p-1 text-sm"
                  value={normalRanges.ldl}
                  onChange={(e) =>
                    handleNormalRangeChange("ldl", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">VLDL</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.vldl}
                  onChange={(e) => handleResultChange("vldl", e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">mg/dl</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.vldl}
                  onChange={(e) =>
                    handleNormalRangeChange("vldl", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">LDL - HDL ratio</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.ldlHdlRatio}
                  onChange={(e) =>
                    handleResultChange("ldlHdlRatio", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center"></td>
              <td className="border border-gray-300 p-2 text-center">
                <textarea
                  className="w-full h-20 p-1 text-sm"
                  value={normalRanges.ldlHdlRatio}
                  onChange={(e) =>
                    handleNormalRangeChange("ldlHdlRatio", e.target.value)
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

export default LipidProfileReport;
