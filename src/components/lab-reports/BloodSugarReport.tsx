import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FormattedInput from "@/components/ui/formatted-input";
import { isOutOfRange } from "./utils";
import TextFormatter from "@/components/ui/text-formatter";
import FormattedText from "@/components/ui/formatted-text";

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
  reportDate = new Date().toLocaleDateString("en-GB"), // تنسيق DD/MM/YYYY
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
                  <FormattedInput
                    isOutOfRange={isOutOfRange(results.fbs, normalRanges.fbs)}
                    value={results.fbs}
                    onChange={(value) => handleResultChange("fbs", value)}
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
                  <FormattedInput
                    isOutOfRange={isOutOfRange(results.rbs, normalRanges.rbs)}
                    value={results.rbs}
                    onChange={(value) => handleResultChange("rbs", value)}
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
                  <FormattedInput
                    isOutOfRange={isOutOfRange(results.pps, normalRanges.pps)}
                    value={results.pps}
                    onChange={(value) => handleResultChange("pps", value)}
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
        <div className="mt-4 p-2 border-t border-gray-300">
          <div className="font-bold">Comment:</div>
          <div className="mt-1">
            <TextFormatter
              value={comments}
              onChange={setComments}
              rows={2}
              placeholder="Normal blood sugar levels."
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

export default BloodSugarReport;
