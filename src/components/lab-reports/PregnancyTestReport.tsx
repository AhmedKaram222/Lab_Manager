import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isOutOfRange } from "./utils";
import TextFormatter from "@/components/ui/text-formatter";
import FormattedText from "@/components/ui/formatted-text";

interface PregnancyTestReportProps {
  patientName?: string;
  patientAge?: string;
  reportDate?: string;
  reportNumber?: string;
  doctorName?: string;
}

const PregnancyTestReport = ({
  patientName = "",
  patientAge = "",
  reportDate = new Date().toLocaleDateString("en-GB"), // تنسيق DD/MM/YYYY
  reportNumber = "",
  doctorName = "",
}: PregnancyTestReportProps) => {
  // حالة لتخزين نتيجة التحليل
  const [result, setResult] = useState("");

  // حالة لتخزين التعليقات
  const [comments, setComments] = useState("");

  return (
    <Card
      className="w-full max-w-4xl mx-auto bg-white report-card"
      data-report-type="pregnancy"
    >
      <CardHeader className="text-center bg-black text-white py-2 print-visible">
        <CardTitle>Serum Pregnancy Test</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* معلومات المريض - يمكن إضافتها حسب الحاجة */}
        {(patientName ||
          patientAge ||
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

        {/* جدول نتائج تحليل الحمل */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Test</th>
              <th className="border border-gray-300 p-2 text-center">Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-bold">
                Qualitative hCG
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className={`text-center h-8 p-1 ${result && result.toLowerCase() !== "negative" ? "font-bold text-red-600" : ""}`}
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
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
              placeholder="Pregnancy test results."
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

export default PregnancyTestReport;
