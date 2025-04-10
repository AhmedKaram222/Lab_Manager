import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FormattedInput from "@/components/ui/formatted-input";
import { isOutOfRange } from "./utils";
import TextFormatter from "@/components/ui/text-formatter";
import FormattedText from "@/components/ui/formatted-text";

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
  reportDate = new Date().toLocaleDateString("en-GB"), // تنسيق DD/MM/YYYY
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
                <FormattedInput
                  isOutOfRange={isOutOfRange(
                    results.cholesterol,
                    normalRanges.cholesterol,
                  )}
                  value={results.cholesterol}
                  onChange={(value) => handleResultChange("cholesterol", value)}
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
                <FormattedInput
                  isOutOfRange={isOutOfRange(
                    results.triglycerides,
                    normalRanges.triglycerides,
                  )}
                  value={results.triglycerides}
                  onChange={(value) =>
                    handleResultChange("triglycerides", value)
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
                <FormattedInput
                  isOutOfRange={isOutOfRange(results.hdl, normalRanges.hdl)}
                  value={results.hdl}
                  onChange={(value) => handleResultChange("hdl", value)}
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
                <FormattedInput
                  isOutOfRange={isOutOfRange(results.ldl, normalRanges.ldl)}
                  value={results.ldl}
                  onChange={(value) => handleResultChange("ldl", value)}
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
                <FormattedInput
                  isOutOfRange={isOutOfRange(results.vldl, normalRanges.vldl)}
                  value={results.vldl}
                  onChange={(value) => handleResultChange("vldl", value)}
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
                <FormattedInput
                  isOutOfRange={isOutOfRange(
                    results.ldlHdlRatio,
                    normalRanges.ldlHdlRatio,
                  )}
                  value={results.ldlHdlRatio}
                  onChange={(value) => handleResultChange("ldlHdlRatio", value)}
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
        <div className="mt-4 p-2 border-t border-gray-300">
          <div className="font-bold">Comment:</div>
          <div className="mt-1">
            <TextFormatter
              value={comments}
              onChange={setComments}
              rows={2}
              placeholder="Lipid profile results."
            />
          </div>
          <div className="mt-4 text-right">
            <div className="font-bold">Signature</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LipidProfileReport;
