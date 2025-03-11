import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FormattedInput from "@/components/ui/formatted-input";
import { isOutOfRange } from "./utils";
import TextFormatter from "@/components/ui/text-formatter";
import FormattedText from "@/components/ui/formatted-text";

interface RenalFunctionReportProps {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  reportDate?: string;
  reportNumber?: string;
  doctorName?: string;
}

const RenalFunctionReport = ({
  patientName = "",
  patientAge = "",
  patientGender = "",
  reportDate = new Date().toLocaleDateString("en-GB"), // تنسيق DD/MM/YYYY
  reportNumber = "",
  doctorName = "",
}: RenalFunctionReportProps) => {
  // حالة لتخزين القيم القابلة للتعديل للقيم المرجعية
  const [normalRanges, setNormalRanges] = useState({
    creatinine: "0.7 - 1.4",
    urea: "15 - 45",
    uricAcid: "3.4 - 7.0",
  });

  // حالة لتخزين التعليقات
  const [comments, setComments] = useState("");

  // حالة لتخزين نتائج التحليل
  const [results, setResults] = useState({
    creatinine: "",
    urea: "",
    uricAcid: "",
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
      data-report-type="renal"
    >
      <CardHeader className="text-center bg-black text-white py-2 print-visible">
        <CardTitle>Renal Function Tests</CardTitle>
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

        {/* جدول نتائج وظائف الكلى */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Test</th>
              <th className="border border-gray-300 p-2 text-center">Result</th>
              <th className="border border-gray-300 p-2 text-center">Unit</th>
              <th className="border border-gray-300 p-2 text-center">Normal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-bold" colSpan={4}>
                Renal functions
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Creatinine</td>
              <td className="border border-gray-300 p-2 text-center">
                <FormattedInput
                  isOutOfRange={isOutOfRange(
                    results.creatinine,
                    normalRanges.creatinine,
                  )}
                  value={results.creatinine}
                  onChange={(value) => handleResultChange("creatinine", value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">mg/dl</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.creatinine}
                  onChange={(e) =>
                    handleNormalRangeChange("creatinine", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Urea</td>
              <td className="border border-gray-300 p-2 text-center">
                <FormattedInput
                  isOutOfRange={isOutOfRange(results.urea, normalRanges.urea)}
                  value={results.urea}
                  onChange={(value) => handleResultChange("urea", value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">mg/dl</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.urea}
                  onChange={(e) =>
                    handleNormalRangeChange("urea", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Uric Acid</td>
              <td className="border border-gray-300 p-2 text-center">
                <FormattedInput
                  isOutOfRange={isOutOfRange(
                    results.uricAcid,
                    normalRanges.uricAcid,
                  )}
                  value={results.uricAcid}
                  onChange={(value) => handleResultChange("uricAcid", value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">mg/dl</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.uricAcid}
                  onChange={(e) =>
                    handleNormalRangeChange("uricAcid", e.target.value)
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
              placeholder="Renal function test results."
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

export default RenalFunctionReport;
