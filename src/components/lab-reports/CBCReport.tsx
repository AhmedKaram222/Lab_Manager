import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CBCReportProps {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  reportDate?: string;
  reportNumber?: string;
  doctorName?: string;
  // يمكن تحديد نوع التقرير (للبالغين، للأطفال، إلخ)
  reportType?: "adult" | "child" | "male" | "female";
}

const CBCReport = ({
  patientName = "",
  patientAge = "",
  patientGender = "",
  reportDate = new Date().toLocaleDateString(),
  reportNumber = "",
  doctorName = "",
  reportType = "adult",
}: CBCReportProps) => {
  // حالة لتخزين القيم القابلة للتعديل للقيم المرجعية
  const [normalRanges, setNormalRanges] = useState({
    // القيم المرجعية للبالغين
    adult: {
      erythrocyticCount: "4 - 5.2",
      hemoglobin: "12.0 - 15.0",
      hematocrit: "36 - 46",
      mcv: "80 - 100",
      mch: "27 - 32",
      mchc: "32 - 36",
      plateletCount: "150 - 410",
      totalLeukocyticCount: "4.0 - 10.0",
      segmented: "0 - 3",
      neutrophils: "35 - 75",
      lymphocytes: "20 - 45",
      monocytes: "2 - 8",
      eosinophils: "1 - 6",
      basophils: "0 - 1",
      segmentedAbs: "0.1 - 0.3",
      neutrophilsAbs: "2 - 7",
      lymphocytesAbs: "1 - 3",
      monocytesAbs: "0.2 - 1",
      eosinophilsAbs: "0.02 - 0.5",
      basophilsAbs: "0.02 - 0.1",
    },
    // القيم المرجعية للأطفال
    child: {
      erythrocyticCount: "3.9 - 5.1",
      hemoglobin: "11.0 - 14.0",
      hematocrit: "34 - 40",
      mcv: "75 - 87",
      mch: "24 - 30",
      mchc: "31 - 37",
      plateletCount: "200 - 550",
      totalLeukocyticCount: "5.0 - 15.0",
      segmented: "0 - 3",
      neutrophils: "20 - 45",
      lymphocytes: "35 - 75",
      monocytes: "2 - 10",
      eosinophils: "1 - 7",
      basophils: "0 - 1",
      segmentedAbs: "0.1 - 0.3",
      neutrophilsAbs: "1 - 7",
      lymphocytesAbs: "1.5 - 8",
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
      mchc: "32 - 36",
      plateletCount: "150 - 410",
      totalLeukocyticCount: "4.0 - 10.0",
      segmented: "0 - 3",
      neutrophils: "35 - 75",
      lymphocytes: "20 - 45",
      monocytes: "2 - 8",
      eosinophils: "2 - 8",
      basophils: "0 - 1",
      segmentedAbs: "0.1 - 0.3",
      neutrophilsAbs: "2 - 7",
      lymphocytesAbs: "1 - 3.5",
      monocytesAbs: "0.2 - 1",
      eosinophilsAbs: "0.02 - 1",
      basophilsAbs: "0.02 - 0.1",
    },
    // القيم المرجعية للإناث
    female: {
      erythrocyticCount: "4 - 5.2",
      hemoglobin: "11.5 - 15.5",
      hematocrit: "35 - 45",
      mcv: "80 - 100",
      mch: "27 - 32",
      mchc: "32 - 36",
      plateletCount: "150 - 410",
      totalLeukocyticCount: "4.0 - 10.0",
      segmented: "0 - 3",
      neutrophils: "35 - 75",
      lymphocytes: "20 - 45",
      monocytes: "2 - 8",
      eosinophils: "1 - 6",
      basophils: "0 - 1",
      segmentedAbs: "0.1 - 0.3",
      neutrophilsAbs: "2 - 7",
      lymphocytesAbs: "1 - 3",
      monocytesAbs: "0.2 - 1",
      eosinophilsAbs: "0.02 - 0.5",
      basophilsAbs: "0.02 - 0.1",
    },
  });

  // حالة لتخزين التعليقات
  const [comments, setComments] = useState("");

  // حالة لتخزين نتائج التحليل
  const [results, setResults] = useState({
    erythrocyticCount: "",
    hemoglobin: "",
    hematocrit: "",
    mcv: "",
    mch: "",
    mchc: "",
    plateletCount: "",
    totalLeukocyticCount: "",
    segmented: "",
    neutrophils: "",
    lymphocytes: "",
    monocytes: "",
    eosinophils: "",
    basophils: "",
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
      <CardHeader className="text-center bg-black text-white py-2 print-visible">
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
              <td className="border border-gray-300 p-2">Erythrocytic count</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.erythrocyticCount}
                  onChange={(e) =>
                    handleResultChange("erythrocyticCount", e.target.value)
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
                <Input
                  className="text-center h-8 p-1"
                  value={results.hemoglobin}
                  onChange={(e) =>
                    handleResultChange("hemoglobin", e.target.value)
                  }
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
                <Input
                  className="text-center h-8 p-1"
                  value={results.hematocrit}
                  onChange={(e) =>
                    handleResultChange("hematocrit", e.target.value)
                  }
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
                <Input
                  className="text-center h-8 p-1"
                  value={results.mcv}
                  onChange={(e) => handleResultChange("mcv", e.target.value)}
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
                <Input
                  className="text-center h-8 p-1"
                  value={results.mch}
                  onChange={(e) => handleResultChange("mch", e.target.value)}
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
                <Input
                  className="text-center h-8 p-1"
                  value={results.mchc}
                  onChange={(e) => handleResultChange("mchc", e.target.value)}
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
                <Input
                  className="text-center h-8 p-1"
                  value={results.plateletCount}
                  onChange={(e) =>
                    handleResultChange("plateletCount", e.target.value)
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
                <Input
                  className="text-center h-8 p-1"
                  value={results.totalLeukocyticCount}
                  onChange={(e) =>
                    handleResultChange("totalLeukocyticCount", e.target.value)
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
          <div className="font-bold p-2 border-t border-b border-gray-300">
            Differential leucocytic count:
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left"></th>
                <th
                  className="border border-gray-300 p-2 text-center"
                  colSpan={2}
                >
                  Relative
                </th>
                <th
                  className="border border-gray-300 p-2 text-center"
                  colSpan={2}
                >
                  Absolute
                </th>
              </tr>
              <tr>
                <th className="border border-gray-300 p-2 text-left">Bands</th>
                <th className="border border-gray-300 p-2 text-center">
                  Result %
                </th>
                <th className="border border-gray-300 p-2 text-center">
                  Normal
                </th>
                <th className="border border-gray-300 p-2 text-center">
                  Result X10^3
                </th>
                <th className="border border-gray-300 p-2 text-center">
                  Normal
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Segmented</td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.segmented}
                    onChange={(e) =>
                      handleResultChange("segmented", e.target.value)
                    }
                  />
                  %
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.segmented}
                    onChange={(e) =>
                      handleNormalRangeChange("segmented", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.segmentedAbs}
                    onChange={(e) =>
                      handleResultChange("segmentedAbs", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={currentNormalRanges.segmentedAbs}
                    onChange={(e) =>
                      handleNormalRangeChange("segmentedAbs", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Neutrophils</td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.neutrophils}
                    onChange={(e) =>
                      handleResultChange("neutrophils", e.target.value)
                    }
                  />
                  %
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
                <td className="border border-gray-300 p-2">Lymphocytes</td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.lymphocytes}
                    onChange={(e) =>
                      handleResultChange("lymphocytes", e.target.value)
                    }
                  />
                  %
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
                <td className="border border-gray-300 p-2">Monocytes</td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.monocytes}
                    onChange={(e) =>
                      handleResultChange("monocytes", e.target.value)
                    }
                  />
                  %
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
                <td className="border border-gray-300 p-2">Eosinophils</td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.eosinophils}
                    onChange={(e) =>
                      handleResultChange("eosinophils", e.target.value)
                    }
                  />
                  %
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
                <td className="border border-gray-300 p-2">Basophils</td>
                <td className="border border-gray-300 p-2 text-center">
                  <Input
                    className="text-center h-8 p-1"
                    value={results.basophils}
                    onChange={(e) =>
                      handleResultChange("basophils", e.target.value)
                    }
                  />
                  %
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
        <div className="mt-4 p-2 border-t border-gray-300">
          <div className="font-bold">Comment:</div>
          <Textarea
            className="w-full mt-1"
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

export default CBCReport;
