import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface StoolAnalysisReportProps {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  reportDate?: string;
  reportNumber?: string;
  doctorName?: string;
}

const StoolAnalysisReport = ({
  patientName = "",
  patientAge = "",
  patientGender = "",
  reportDate = new Date().toLocaleDateString(),
  reportNumber = "",
  doctorName = "",
}: StoolAnalysisReportProps) => {
  // حالة لتخزين القيم القابلة للتعديل للقيم المرجعية
  const [normalRanges, setNormalRanges] = useState({
    color: "Brown",
    odor: "Offensive",
    consistency: "Semi - Formed",
    mucus: "Absent",
    pus: "Absent",
    blood: "Absent",
    parasite: "Absent",
    undigestedFood: "Absent",
    pusCells: "0 - 5 / HPF",
    rbcs: "0 - 5 / HPF",
    starchGranules: "+",
    fatGlobules: "+",
    vegetableCells: "+",
    muscleFibers: "+",
    protozoaVegetative: "Absent",
    protozonCysts: "Absent",
    helminthsLarvae: "Absent",
    helminthsOva: "Absent",
  });

  // حالة لتخزين نتائج التحليل
  const [results, setResults] = useState({
    color: "",
    odor: "",
    consistency: "",
    mucus: "",
    pus: "",
    blood: "",
    parasite: "",
    undigestedFood: "",
    pusCells: "",
    rbcs: "",
    starchGranules: "",
    fatGlobules: "",
    vegetableCells: "",
    muscleFibers: "",
    protozoaVegetative: "",
    protozonCysts: "",
    helminthsLarvae: "",
    helminthsOva: "",
  });

  // حالة لتخزين التعليقات
  const [comments, setComments] = useState("");

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
      data-report-type="stool"
    >
      <CardHeader className="text-center bg-black text-white py-2 print-visible">
        <CardTitle>Stool Analysis</CardTitle>
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

        {/* جدول نتائج تحليل البراز */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Test</th>
              <th className="border border-gray-300 p-2 text-center">Result</th>
              <th className="border border-gray-300 p-2 text-center">Normal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-bold" colSpan={3}>
                Physical examination:
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Color</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.color}
                  onChange={(e) => handleResultChange("color", e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.color}
                  onChange={(e) =>
                    handleNormalRangeChange("color", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Odor</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.odor}
                  onChange={(e) => handleResultChange("odor", e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.odor}
                  onChange={(e) =>
                    handleNormalRangeChange("odor", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Consistency</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.consistency}
                  onChange={(e) =>
                    handleResultChange("consistency", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.consistency}
                  onChange={(e) =>
                    handleNormalRangeChange("consistency", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Mucus</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.mucus}
                  onChange={(e) => handleResultChange("mucus", e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.mucus}
                  onChange={(e) =>
                    handleNormalRangeChange("mucus", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Pus</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.pus}
                  onChange={(e) => handleResultChange("pus", e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.pus}
                  onChange={(e) =>
                    handleNormalRangeChange("pus", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Blood</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.blood}
                  onChange={(e) => handleResultChange("blood", e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.blood}
                  onChange={(e) =>
                    handleNormalRangeChange("blood", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Parasite</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.parasite}
                  onChange={(e) =>
                    handleResultChange("parasite", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.parasite}
                  onChange={(e) =>
                    handleNormalRangeChange("parasite", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Undigested Food</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.undigestedFood}
                  onChange={(e) =>
                    handleResultChange("undigestedFood", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.undigestedFood}
                  onChange={(e) =>
                    handleNormalRangeChange("undigestedFood", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-bold" colSpan={3}>
                Microscopic examination:
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Pus Cells</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.pusCells}
                  onChange={(e) =>
                    handleResultChange("pusCells", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.pusCells}
                  onChange={(e) =>
                    handleNormalRangeChange("pusCells", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">RBCs</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.rbcs}
                  onChange={(e) => handleResultChange("rbcs", e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.rbcs}
                  onChange={(e) =>
                    handleNormalRangeChange("rbcs", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Starch Granules</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.starchGranules}
                  onChange={(e) =>
                    handleResultChange("starchGranules", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.starchGranules}
                  onChange={(e) =>
                    handleNormalRangeChange("starchGranules", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Fat Globules</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.fatGlobules}
                  onChange={(e) =>
                    handleResultChange("fatGlobules", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.fatGlobules}
                  onChange={(e) =>
                    handleNormalRangeChange("fatGlobules", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Vegetable Cells</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.vegetableCells}
                  onChange={(e) =>
                    handleResultChange("vegetableCells", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.vegetableCells}
                  onChange={(e) =>
                    handleNormalRangeChange("vegetableCells", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Muscle Fibers</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.muscleFibers}
                  onChange={(e) =>
                    handleResultChange("muscleFibers", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.muscleFibers}
                  onChange={(e) =>
                    handleNormalRangeChange("muscleFibers", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-bold" colSpan={3}>
                Parasites:
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                Protozoa (Vegetative)
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.protozoaVegetative}
                  onChange={(e) =>
                    handleResultChange("protozoaVegetative", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.protozoaVegetative}
                  onChange={(e) =>
                    handleNormalRangeChange(
                      "protozoaVegetative",
                      e.target.value,
                    )
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Protozoa (Cysts)</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.protozonCysts}
                  onChange={(e) =>
                    handleResultChange("protozonCysts", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.protozonCysts}
                  onChange={(e) =>
                    handleNormalRangeChange("protozonCysts", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Helminths (Larvae)</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.helminthsLarvae}
                  onChange={(e) =>
                    handleResultChange("helminthsLarvae", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.helminthsLarvae}
                  onChange={(e) =>
                    handleNormalRangeChange("helminthsLarvae", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Helminths (Ova)</td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={results.helminthsOva}
                  onChange={(e) =>
                    handleResultChange("helminthsOva", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Input
                  className="text-center h-8 p-1"
                  value={normalRanges.helminthsOva}
                  onChange={(e) =>
                    handleNormalRangeChange("helminthsOva", e.target.value)
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

export default StoolAnalysisReport;
