import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, User, FileText } from "lucide-react";

// استيراد وظائف التعامل مع البيانات
import { getPatients } from "../tests/TestsService";

const tests = [
  {
    id: "1",
    patientName: "أحمد محمد",
    testType: "تحليل دم شامل",
    date: "2023-06-15",
    status: "completed",
  },
  {
    id: "2",
    patientName: "سارة أحمد",
    testType: "وظائف كبد",
    date: "2023-06-15",
    status: "inProgress",
  },
  {
    id: "3",
    patientName: "محمد علي",
    testType: "وظائف كلى",
    date: "2023-06-15",
    status: "pending",
  },
];

const testStatusMap = {
  pending: { label: "قيد الانتظار", variant: "outline" },
  inProgress: { label: "جاري التنفيذ", variant: "secondary" },
  completed: { label: "مكتمل", variant: "default" },
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [activeTab, setActiveTab] = useState("patients");
  const [patients, setPatients] = useState<any[]>([]);

  // استرجاع بيانات المرضى عند تحميل الصفحة
  useEffect(() => {
    // استرجاع بيانات المرضى من التخزين المحلي
    const storedPatients = getPatients();
    setPatients(storedPatients);
  }, []);

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery) return true;

    if (searchType === "name") {
      return patient.name && patient.name.includes(searchQuery);
    } else if (searchType === "phone") {
      return patient.phone && patient.phone.includes(searchQuery);
    } else if (searchType === "fileCode") {
      return patient.fileCode && patient.fileCode.includes(searchQuery);
    }

    return true;
  });

  // Filter tests based on search query
  const filteredTests = tests.filter((test) => {
    if (!searchQuery) return true;

    if (searchType === "name") {
      return test.patientName.includes(searchQuery);
    } else if (searchType === "testType") {
      return test.testType.includes(searchQuery);
    }

    return true;
  });

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold">البحث المتقدم</h1>

      <Card>
        <CardHeader>
          <CardTitle>بحث عن مرضى وتحاليل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث هنا..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger>
                  <SelectValue placeholder="نوع البحث" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">الاسم</SelectItem>
                  <SelectItem value="phone">رقم الهاتف</SelectItem>
                  <SelectItem value="fileCode">رقم الملف</SelectItem>
                  <SelectItem value="testType">نوع التحليل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              بحث
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="patients">
                <User className="h-4 w-4 mr-2" />
                المرضى
              </TabsTrigger>
              <TabsTrigger value="tests">
                <FileText className="h-4 w-4 mr-2" />
                التحاليل
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patients">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-right py-3 px-4 font-medium">
                        الاسم
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        العمر
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        رقم الهاتف
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        تاريخ التسجيل
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="border-b border-border hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">{patient.name}</td>
                        <td className="py-3 px-4">{patient.age}</td>
                        <td className="py-3 px-4">{patient.phone || "-"}</td>
                        <td className="py-3 px-4">{patient.date || "-"}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              عرض
                            </Button>
                            <Button variant="outline" size="sm">
                              تعديل
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="tests">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-right py-3 px-4 font-medium">
                        المريض
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        نوع التحليل
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        التاريخ
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        الحالة
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.map((test) => (
                      <tr
                        key={test.id}
                        className="border-b border-border hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">{test.patientName}</td>
                        <td className="py-3 px-4">{test.testType}</td>
                        <td className="py-3 px-4">{test.date}</td>
                        <td className="py-3 px-4">
                          {testStatusMap[test.status].label}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              عرض
                            </Button>
                            <Button variant="outline" size="sm">
                              النتائج
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchPage;
