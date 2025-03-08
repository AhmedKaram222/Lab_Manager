import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

const patients = [
  {
    id: "1",
    name: "أحمد محمد",
    age: 45,
    phone: "01012345678",
    lastVisit: "2023-06-10",
  },
  {
    id: "2",
    name: "سارة أحمد",
    age: 32,
    phone: "01112345678",
    lastVisit: "2023-06-12",
  },
  {
    id: "3",
    name: "محمد علي",
    age: 28,
    phone: "01212345678",
    lastVisit: "2023-06-13",
  },
  {
    id: "4",
    name: "فاطمة حسن",
    age: 50,
    phone: "01512345678",
    lastVisit: "2023-06-14",
  },
  {
    id: "5",
    name: "خالد عبدالله",
    age: 35,
    phone: "01612345678",
    lastVisit: "2023-06-15",
  },
];

const PatientsPage = () => {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">المرضى</h1>
        <Link to="/patients/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            مريض جديد
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>قائمة المرضى</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="بحث عن مريض..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-3 px-4 font-medium">الاسم</th>
                  <th className="text-right py-3 px-4 font-medium">العمر</th>
                  <th className="text-right py-3 px-4 font-medium">
                    رقم الهاتف
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    آخر زيارة
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">{patient.name}</td>
                    <td className="py-3 px-4">{patient.age}</td>
                    <td className="py-3 px-4">{patient.phone}</td>
                    <td className="py-3 px-4">{patient.lastVisit}</td>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsPage;
