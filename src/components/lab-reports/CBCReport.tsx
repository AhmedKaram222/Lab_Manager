import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FormattedInput from "@/components/ui/formatted-input";
import { isOutOfRange } from "./utils";
import TextFormatter from "@/components/ui/text-formatter";
import FormattedText from "@/components/ui/formatted-text";

interface CBCReportProps {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  reportDate?: string;
  reportNumber?: string;
  doctorName?: string;
  // يمكن تحديد نوع التقرير (للبالغين، للأطفال، إلخ)
  reportType?: "age1-2" | "age2-6" | "age6-12" | "male" | "female";
}

const CBCReport = ({
  patientName = "",
  patientAge = "",
  patientGender = "",
  reportDate = new Date().toLocaleDateString("en-GB"), // تنسيق DD/MM/YYYY
  reportNumber = "",
  doctorName = "",
  reportType = "male",
}: CBCReportProps) => {
  // حالة لتخزين القيم القابلة للتعديل للقيم المرجعية
  const [normalRanges, setNormalRanges] = useState({
    // القيم المرجعية للأطفال من 1-2 سنة
    "age1-2": {
      erythrocyticCount: "3.9 - 5.1",
      hemoglobin: "11.0 - 14.0",
      hematocrit: "30 - 38",
      mcv: "72 - 84",
      mch: "25 - 29",
      mchc: "32.0 - 36.0",
      plateletCount: "200 - 550",
      totalLeukocyticCount: "6.0 - 16.0",
      Bands: "0 - 3",
      segmented: "",
      neutrophils: "20 - 45",
      lymphocytes: "35 - 75",
      monocytes: "2 - 10",
      eosinophils: "1 - 7",
      basophils: "0 - 1",
      BandsAbs: "",
      segmentedAbs: "",
      neutrophilsAbs: "1.0 - 7",
      lymphocytesAbs: "3.5 - 11",
      monocytesAbs: "0.2 - 1",
      eosinophilsAbs: "0.1 - 1",
      basophilsAbs: "0.02 - 0.1",
    },
    // القيم المرجعية للأطفال من 2-6 سنوات
    "age2-6": {
      erythrocyticCount: "4.0 - 5.2",
      hemoglobin: "11.0 - 14.0",
      hematocrit: "34 - 40",
      mcv: "75 - 87",
      mch: "24 - 30",
      mchc: "31 - 37",
      plateletCount: "200 - 490",
      totalLeukocyticCount: "5.0 - 15.0",
      Bands: "0 - 3",
      segmented: "",
      neutrophils: "30 - 45",
      lymphocytes: "40 - 65",
      monocytes: "2 - 10",
      eosinophils: "1 - 7",
      basophils: "0 - 1",
      BandsAbs: "",
      segmentedAbs: "",
      neutrophilsAbs: "1.5 - 8",
      lymphocytesAbs: "3 - 9",
      monocytesAbs: "0.2 - 1",
      eosinophilsAbs: "0.1 - 1",
      basophilsAbs: "0.02 - 0.1",
    },
    // القيم المرجعية للأطفال من 6-12 سنة
    "age6-12": {
      erythrocyticCount: "4.0 - 5.2",
      hemoglobin: "11.5 - 15.5",
      hematocrit: "35 - 45",
      mcv: "77 - 95",
      mch: "25 - 33",
      mchc: "31 - 37",
      plateletCount: "170 - 450",
      totalLeukocyticCount: "5.0 - 13.0",
      Bands: "0 - 3",
      segmented: "",
      neutrophils: "35 - 52",
      lymphocytes: "40 - 60",
      monocytes: "2 - 10",
      eosinophils: "1 - 6",
      basophils: "0 - 1",
      BandsAbs: "",
      segmentedAbs: "",
      neutrophilsAbs: "2 - 8",
      lymphocytesAbs: "1 - 5",
      monocytesAbs: "0.2 - 1",
      eosinophilsAbs: "0.1 - 1",
      basophilsAbs: "0.02 - 0.1",
    },
    // القيم المرجعية للذكور
    male: {
      erythrocyticCount: "4.5 - 5.5",
      hemoglobin: "13.0 - 17.0",
      hematocrit: "40 - 50",
      mcv: "80 - 100",
      mch: "27 - 32",
      mchc: "31.5 - 34.5",
      plateletCount: "150 - 410",
      totalLeukocyticCount: "4.0 - 10.0",
      Bands: "0 - 3",
      segmented: "",
      neutrophils: "35 - 75",
      lymphocytes: "20 - 45",
      monocytes: "2 - 8",
      eosinophils: "1 - 6",
      basophils: "0 - 1",
      BandsAbs: " ",
      segmentedAbs: " ",
      neutrophilsAbs: "2 - 7",
      lymphocytesAbs: "1 - 3.5",
      monocytesAbs: "0.2 - 1",
      eosinophilsAbs: "0.02 - 0.5",
      basophilsAbs: "0.02 - 1.0",
    },
    // القيم المرجعية للإناث
    female: {
      erythrocyticCount: "3.8 - 4.8",
      hemoglobin: "12.0 - 15.0",
      hematocrit: "36 - 46",
      mcv: "80 - 100",
      mch: "27 - 32",
      mchc: "31 - 37",
      plateletCount: "150 - 410",
      totalLeukocyticCount: "4.0 - 10.0",
      Bands: "0 - 3",
      segmented: "",
      neutrophils: "35 - 75",
      lymphocytes: "20 - 45",
      monocytes: "2 - 8",
      eosinophils: "1 - 6",
      basophils: "0 - 1",
      BandsAbs: "",
      segmentedAbs: "",
      neutrophilsAbs: "2 - 7",
      lymphocytesAbs: "1 - 3.5",
      monocytesAbs: "0.2 - 1",
      eosinophilsAbs: "0.02 - 0.5",
      basophilsAbs: "0.02 - 0.1",
    },
  });

  // حالة لتخزين التعليقات
  const [comments, setComments] = useState("");

  // حالة لتخزين نتائج التحليل بالترتيب المطلوب
  const [results, setResults] = useState({
    erythrocyticCount: "",
    hemoglobin: "",
    hematocrit: "",
    mcv: "",
    mch: "",
    mchc: "",
    plateletCount: "",
    totalLeukocyticCount: "",
    Bands: "",
    segmented: "",
    neutrophils: "",
    lymphocytes: "",
    monocytes: "",
    eosinophils: "",
    basophils: "",
    BandsAbs: "",
    segmentedAbs: "",
    neutrophilsAbs: "",
    lymphocytesAbs: "",
    monocytesAbs: "",
    eosinophilsAbs: "",
    basophilsAbs: "",
  });

  // الحصول على القيم المرجعية المناسبة بناءً على نوع التقرير
  const currentNormalRanges = normalRanges[reportType];

  // تحديث قيمة مرجعية
  const handleNormalRangeChange = (field: string, value: string) => {
    setNormalRanges({
      ...normalRanges,
      [reportType]: {
        ...normalRanges[reportType],
        [field]: value,
      },
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
      data-report-type="cbc"
      style={{ pageBreakInside: "avoid" }}
    >
      <CardHeader className="text-center bg-primary text-white py-2 print-visible">
        <CardTitle>Complete Blood Count</CardTitle>
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

        {/* جدول نتائج تعداد الدم الكامل */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary/10">
              <th className="border border-gray-300 p-2 text-left font-bold">
                Test
              </th>
              <th className="border border-gray-300 p-2 text-center font-bold">
                Result
              </th>
              <th className="border border-gray-300 p-2 text-center font-bold">
                Unit
              </th>
              <th className="border border-gray-300 p-2 text-center font-bold">
                Ref.Range
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">Erythrocytic count</td>
              <td className="border border-gray-300 p-2 text-center">
                <FormattedInput
                  isOutOfRange={isOutOfRange(
                    results.erythrocyticCount,
                    currentNormalRanges.erythrocyticCount,
                  )}
                  value={results.erythrocyticCount}
                  onChange={(value) =>
                    handleResultChange("erythrocyticCount", value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                x 10^6/cmm
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={currentNormalRanges.erythrocyticCount}
                  onChange={(e) =>
                    handleNormalRangeChange("erythrocyticCount", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Hemoglobin</td>
              <td className="border border-gray-300 p-2 text-center">
                <FormattedInput
                  isOutOfRange={isOutOfRange(
                    results.hemoglobin,
                    currentNormalRanges.hemoglobin,
                  )}
                  value={results.hemoglobin}
                  onChange={(value) => handleResultChange("hemoglobin", value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">g/dl</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={currentNormalRanges.hemoglobin}
                  onChange={(e) =>
                    handleNormalRangeChange("hemoglobin", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                Hematocrit (P.C.V.)
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <FormattedInput
                  isOutOfRange={isOutOfRange(
                    results.hematocrit,
                    currentNormalRanges.hematocrit,
                  )}
                  value={results.hematocrit}
                  onChange={(value) => handleResultChange("hematocrit", value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">%</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={currentNormalRanges.hematocrit}
                  onChange={(e) =>
                    handleNormalRangeChange("hematocrit", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">M.C.V.</td>
              <td className="border border-gray-300 p-2 text-center">
                <FormattedInput
                  isOutOfRange={isOutOfRange(
                    results.mcv,
                    currentNormalRanges.mcv,
                  )}
                  value={results.mcv}
                  onChange={(value) => handleResultChange("mcv", value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">fl</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={currentNormalRanges.mcv}
                  onChange={(e) =>
                    handleNormalRangeChange("mcv", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">M.C.H.</td>
              <td className="border border-gray-300 p-2 text-center">
                <FormattedInput
                  isOutOfRange={isOutOfRange(
                    results.mch,
                    currentNormalRanges.mch,
                  )}
                  value={results.mch}
                  onChange={(value) => handleResultChange("mch", value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">pg</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={currentNormalRanges.mch}
                  onChange={(e) =>
                    handleNormalRangeChange("mch", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">M.C.H.C</td>
              <td className="border border-gray-300 p-2 text-center">
                <FormattedInput
                  isOutOfRange={isOutOfRange(
                    results.mchc,
                    currentNormalRanges.mchc,
                  )}
                  value={results.mchc}
                  onChange={(value) => handleResultChange("mchc", value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">g/dl</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={currentNormalRanges.mchc}
                  onChange={(e) =>
                    handleNormalRangeChange("mchc", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Platelet count</td>
              <td className="border border-gray-300 p-2 text-center">
                <FormattedInput
                  isOutOfRange={isOutOfRange(
                    results.plateletCount,
                    currentNormalRanges.plateletCount,
                  )}
                  value={results.plateletCount}
                  onChange={(value) =>
                    handleResultChange("plateletCount", value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                x 10^3/cmm
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={currentNormalRanges.plateletCount}
                  onChange={(e) =>
                    handleNormalRangeChange("plateletCount", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                Total leucocytic count
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <FormattedInput
                  isOutOfRange={isOutOfRange(
                    results.totalLeukocyticCount,
                    currentNormalRanges.totalLeukocyticCount,
                  )}
                  value={results.totalLeukocyticCount}
                  onChange={(value) =>
                    handleResultChange("totalLeukocyticCount", value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                x 10^3/cmm
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={currentNormalRanges.totalLeukocyticCount}
                  onChange={(e) =>
                    handleNormalRangeChange(
                      "totalLeukocyticCount",
                      e.target.value,
                    )
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* جدول العد التفريقي لخلايا الدم البيضاء */}
        <div className="mt-4">
          <div className="font-bold p-2 border-t border-b border-gray-300 bg-primary/10">
            Differential leucocytic count:
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary/5">
                <th className="border border-gray-300 p-2 text-left font-bold">
                  Cell Type
                </th>
                <th className="border border-gray-300 p-2 text-center font-bold">
                  Result %
                </th>
                <th className="border border-gray-300 p-2 text-center font-bold">
                  Normal Range %
                </th>
                <th className="border border-gray-300 p-2 text-center font-bold">
                  Absolute (X10^3)
                </th>
                <th className="border border-gray-300 p-2 text-center font-bold">
                  Normal Range
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-medium">
                  Bands
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className={`text-center h-8 p-1 ${isOutOfRange(results.Bands, currentNormalRanges.Bands) ? "font-bold text-red-600" : ""}`}
                    value={results.Bands}
                    onChange={(e) => {
                      handleResultChange("Bands", e.target.value);
                      // تحديث قيمة Segmented بنفس القيمة
                      handleResultChange("segmented", e.target.value);
                    }}
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.Bands}
                    onChange={(e) => {
                      handleNormalRangeChange("Bands", e.target.value);
                      // تحديث القيمة المرجعية لـ Segmented بنفس القيمة
                      handleNormalRangeChange("segmented", e.target.value);
                    }}
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.BandsAbs}
                    onChange={(e) => {
                      handleResultChange("BandsAbs", e.target.value);
                      // تحديث قيمة segmentedAbs بنفس القيمة
                      handleResultChange("segmentedAbs", e.target.value);
                    }}
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.BandsAbs}
                    onChange={(e) => {
                      handleNormalRangeChange("BandsAbs", e.target.value);
                      // تحديث القيمة المرجعية لـ segmentedAbs بنفس القيمة
                      handleNormalRangeChange("segmentedAbs", e.target.value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-medium">
                  Segmented
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.segmented}
                    onChange={(e) => {
                      handleResultChange("segmented", e.target.value);
                      // تحديث قيمة Bands بنفس القيمة
                      handleResultChange("Bands", e.target.value);
                    }}
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.segmented}
                    onChange={(e) => {
                      handleNormalRangeChange("segmented", e.target.value);
                      // تحديث القيمة المرجعية لـ Bands بنفس القيمة
                      handleNormalRangeChange("Bands", e.target.value);
                    }}
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.segmentedAbs}
                    onChange={(e) => {
                      handleResultChange("segmentedAbs", e.target.value);
                      // تحديث قيمة BandsAbs بنفس القيمة
                      handleResultChange("BandsAbs", e.target.value);
                    }}
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.segmentedAbs}
                    onChange={(e) => {
                      handleNormalRangeChange("segmentedAbs", e.target.value);
                      // تحديث القيمة المرجعية لـ BandsAbs بنفس القيمة
                      handleNormalRangeChange("BandsAbs", e.target.value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-medium">
                  Neutrophils
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className={`text-center h-8 p-1 ${isOutOfRange(results.neutrophils, currentNormalRanges.neutrophils) ? "font-bold text-red-600" : ""}`}
                    value={results.neutrophils}
                    onChange={(e) =>
                      handleResultChange("neutrophils", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.neutrophils}
                    onChange={(e) =>
                      handleNormalRangeChange("neutrophils", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.neutrophilsAbs}
                    onChange={(e) =>
                      handleResultChange("neutrophilsAbs", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.neutrophilsAbs}
                    onChange={(e) =>
                      handleNormalRangeChange("neutrophilsAbs", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-medium">
                  Lymphocytes
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className={`text-center h-8 p-1 ${isOutOfRange(results.lymphocytes, currentNormalRanges.lymphocytes) ? "font-bold text-red-600" : ""}`}
                    value={results.lymphocytes}
                    onChange={(e) =>
                      handleResultChange("lymphocytes", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.lymphocytes}
                    onChange={(e) =>
                      handleNormalRangeChange("lymphocytes", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.lymphocytesAbs}
                    onChange={(e) =>
                      handleResultChange("lymphocytesAbs", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.lymphocytesAbs}
                    onChange={(e) =>
                      handleNormalRangeChange("lymphocytesAbs", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-medium">
                  Monocytes
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className={`text-center h-8 p-1 ${isOutOfRange(results.monocytes, currentNormalRanges.monocytes) ? "font-bold text-red-600" : ""}`}
                    value={results.monocytes}
                    onChange={(e) =>
                      handleResultChange("monocytes", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.monocytes}
                    onChange={(e) =>
                      handleNormalRangeChange("monocytes", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.monocytesAbs}
                    onChange={(e) =>
                      handleResultChange("monocytesAbs", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.monocytesAbs}
                    onChange={(e) =>
                      handleNormalRangeChange("monocytesAbs", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-medium">
                  Eosinophils
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className={`text-center h-8 p-1 ${isOutOfRange(results.eosinophils, currentNormalRanges.eosinophils) ? "font-bold text-red-600" : ""}`}
                    value={results.eosinophils}
                    onChange={(e) =>
                      handleResultChange("eosinophils", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.eosinophils}
                    onChange={(e) =>
                      handleNormalRangeChange("eosinophils", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.eosinophilsAbs}
                    onChange={(e) =>
                      handleResultChange("eosinophilsAbs", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.eosinophilsAbs}
                    onChange={(e) =>
                      handleNormalRangeChange("eosinophilsAbs", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-medium">
                  Basophils
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className={`text-center h-8 p-1 ${isOutOfRange(results.basophils, currentNormalRanges.basophils) ? "font-bold text-red-600" : ""}`}
                    value={results.basophils}
                    onChange={(e) =>
                      handleResultChange("basophils", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.basophils}
                    onChange={(e) =>
                      handleNormalRangeChange("basophils", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.basophilsAbs}
                    onChange={(e) =>
                      handleResultChange("basophilsAbs", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.basophilsAbs}
                    onChange={(e) =>
                      handleNormalRangeChange("basophilsAbs", e.target.value)
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* التعليقات */}
        <div className="mt-4 p-2 border-t border-gray-300 bg-primary/5">
          <div className="font-bold">Comment:</div>
          <div className="mt-1">
            <TextFormatter
              value={comments}
              onChange={setComments}
              rows={3}
              placeholder="Add any comments or notes here..."
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

export default CBCReport;
