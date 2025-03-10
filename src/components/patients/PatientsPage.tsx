import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Pencil, Trash, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { getPatients } from "../tests/TestsService";

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [patients, setPatients] = useState<any[]>([]);
  const [todayPatients, setTodayPatients] = useState<any[]>([]);

  // استرجاع بيانات المرضى عند تحميل الصفحة
  useEffect(() => {
    // استرجاع بيانات المرضى من التخزين المحلي
    const storedPatients = getPatients();
    setPatients(storedPatients);

    // تحديد المرضى المسجلين اليوم
    const today = new Date().toISOString().split("T")[0];
    const todayPatients = storedPatients.filter((patient) => {
      if (!patient.date) return false;
      return patient.date.includes(today);
    });
    setTodayPatients(todayPatients);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // تصفية المرضى بناءً على مصطلح البحث
  const filteredPatients = patients.filter(
    (patient) =>
      (patient.name && patient.name.includes(searchTerm)) ||
      (patient.phone && patient.phone.includes(searchTerm)) ||
      (patient.fileCode && patient.fileCode.includes(searchTerm)),
  );

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">المرضى</h1>
        <Link to="/patient-registration">
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            إضافة مريض جديد
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>قائمة المرضى</CardTitle>
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن مريض..."
                className="pr-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">الكل ({patients.length})</TabsTrigger>
              <TabsTrigger value="recent">
                الأحدث ({todayPatients.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-right py-3 px-4 font-medium">
                        رقم الملف
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        الاسم
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        العمر
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        النوع
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
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <tr
                          key={patient.id}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="py-3 px-4">{patient.fileCode}</td>
                          <td className="py-3 px-4">{patient.name}</td>
                          <td className="py-3 px-4">{patient.age}</td>
                          <td className="py-3 px-4">
                            {patient.gender === "male" ? "ذكر" : "أنثى"}
                          </td>
                          <td className="py-3 px-4">{patient.phone}</td>
                          <td className="py-3 px-4">{patient.date}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-muted-foreground"
                        >
                          لا توجد بيانات متاحة بعد
                        </td>
                      </tr>
                    )}
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

export default PatientsPage;
