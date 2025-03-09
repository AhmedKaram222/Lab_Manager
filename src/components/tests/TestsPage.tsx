import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, Plus, Trash, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const TestsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // قائمة فارغة للتحاليل
  const [tests, setTests] = useState([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">قائمة التحاليل</h1>
        <Link to="/patient-registration">
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            تحليل جديد
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>التحاليل</CardTitle>
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن تحليل..."
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
              <TabsTrigger value="all">الكل (0)</TabsTrigger>
              <TabsTrigger value="pending">قيد الانتظار (0)</TabsTrigger>
              <TabsTrigger value="completed">مكتمل (0)</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="text-center py-8 text-muted-foreground">
                لا توجد تحاليل متاحة. يمكنك إضافة تحليل جديد بالضغط على زر
                "تحليل جديد"
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestsPage;
