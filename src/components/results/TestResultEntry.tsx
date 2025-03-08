import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Save, Printer, FileText, Download, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// قائمة التحاليل المتاحة
const availableTests = [
  { id: "1", name: "تحليل دم شامل", price: 150 },
  { id: "2", name: "وظائف كبد", price: 200 },
  { id: "3", name: "وظائف كلى", price: 180 },
  { id: "4", name: "سكر صائم", price: 80 },
  { id: "5", name: "صورة دم كاملة", price: 120 },
  { id: "6", name: "تحليل بول", price: 70 },
  { id: "7", name: "هرمونات", price: 250 },
  { id: "8", name: "دهون", price: 220 },
  { id: "9", name: "فيتامين د", price: 300 },
  { id: "10", name: "فيروسات كبدية", price: 400 },
];

// قائمة المرضى
const patients = [
  { id: "1", name: "أحمد محمد", age: 45, gender: "male" },
  { id: "2", name: "سارة أحمد", age: 32, gender: "female" },
  { id: "3", name: "محمد علي", age: 28, gender: "male" },
  { id: "4", name: "فاطمة حسن", age: 50, gender: "female" },
  { id: "5", name: "خالد عبدالله", age: 35, gender: "male" },
];

// قائمة الأطباء
const doctors = [
  { id: "1", name: "د. أحمد محمد" },
  { id: "2", name: "د. سارة أحمد" },
  { id: "3", name: "د. محمد علي" },
  { id: "4", name: "د. فاطمة حسن" },
];

// نماذج التحاليل
const bloodTestTemplate = [
  { name: "الهيموجلوبين", unit: "g/dL", normalRange: "13.5-17.5", value: "" },
  {
    name: "كريات الدم الحمراء",
    unit: "10^6/μL",
    normalRange: "4.5-5.5",
    value: "",
  },
  {
    name: "كريات الدم البيضاء",
    unit: "10^3/μL",
    normalRange: "4.5-11.0",
    value: "",
  },
  {
    name: "الصفائح الدموية",
    unit: "10^3/μL",
    normalRange: "150-450",
    value: "",
  },
  { name: "الهيماتوكريت", unit: "%", normalRange: "41-50", value: "" },
];

const liverTestTemplate = [
  { name: "ALT", unit: "U/L", normalRange: "7-56", value: "" },
  { name: "AST", unit: "U/L", normalRange: "5-40", value: "" },
  {
    name: "البيليروبين الكلي",
    unit: "mg/dL",
    normalRange: "0.1-1.2",
    value: "",
  },
  {
    name: "البيليروبين المباشر",
    unit: "mg/dL",
    normalRange: "0.0-0.3",
    value: "",
  },
  { name: "البروتين الكلي", unit: "g/dL", normalRange: "6.0-8.3", value: "" },
  { name: "الألبومين", unit: "g/dL", normalRange: "3.5-5.0", value: "" },
];

const kidneyTestTemplate = [
  { name: "اليوريا", unit: "mg/dL", normalRange: "7-20", value: "" },
  { name: "الكرياتينين", unit: "mg/dL", normalRange: "0.6-1.2", value: "" },
  { name: "حمض اليوريك", unit: "mg/dL", normalRange: "3.5-7.2", value: "" },
];

const glucoseTestTemplate = [
  { name: "سكر صائم", unit: "mg/dL", normalRange: "70-100", value: "" },
];

const testTemplates = {
  "1": bloodTestTemplate,
  "2": liverTestTemplate,
  "3": kidneyTestTemplate,
  "4": glucoseTestTemplate,
};

const formSchema = z.object({
  patientId: z.string({ required_error: "يرجى اختيار المريض" }),
  testId: z.string({ required_error: "يرجى اختيار نوع التحليل" }),
  doctorId: z.string().optional(),
  date: z.string().default(() => format(new Date(), "yyyy-MM-dd")),
  notes: z.string().optional(),
});

const TestResultEntry = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<any[]>([]);
  const [testValues, setTestValues] = useState<any[]>([]);
  const [savedResults, setSavedResults] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const printRef = useRef(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      testId: "",
      doctorId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    },
  });

  const watchPatientId = form.watch("patientId");
  const watchTestId = form.watch("testId");

  // تحديث بيانات المريض والتحليل المحدد
  useEffect(() => {
    if (watchPatientId) {
      const patient = patients.find((p) => p.id === watchPatientId);
      setSelectedPatient(patient);
    }

    if (watchTestId) {
      const test = availableTests.find((t) => t.id === watchTestId);
      setSelectedTest(test);
      const template = testTemplates[watchTestId] || [];
      setSelectedTemplate(template);
      setTestValues(template.map((item) => ({ ...item })));
    }
  }, [watchPatientId, watchTestId]);

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...testValues];
    newValues[index].value = value;
    setTestValues(newValues);
  };

  const isValueAbnormal = (value: string, normalRange: string) => {
    if (!value || !normalRange) return false;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;

    const [min, max] = normalRange.split("-").map(parseFloat);
    return numValue < min || numValue > max;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // هنا يتم حفظ النتائج
    console.log(values);
    console.log(testValues);
    setSavedResults(true);
  }

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const handleSavePDF = () => {
    // هنا يتم حفظ الملف بصيغة PDF
    alert("تم حفظ الملف بصيغة PDF");
    setIsSaveDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">إدخال نتائج التحاليل</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>بيانات التحليل</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المريض</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المريض" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name} - {patient.age} سنة
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="testId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع التحليل</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع التحليل" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableTests.map((test) => (
                            <SelectItem key={test.id} value={test.id}>
                              {test.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doctorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الطبيب المعالج</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الطبيب (اختياري)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تاريخ التحليل</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ملاحظات</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل أي ملاحظات إضافية"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap gap-3">
                  <Button type="submit" className="min-w-[120px]">
                    <Check className="h-4 w-4 ml-2" />
                    حفظ النتائج
                  </Button>

                  <Dialog
                    open={isSaveDialogOpen}
                    onOpenChange={setIsSaveDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="min-w-[120px]"
                      >
                        <Save className="h-4 w-4 ml-2" />
                        حفظ
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>حفظ نتائج التحليل</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p>اختر مكان حفظ الملف:</p>
                        <Input
                          type="text"
                          placeholder="C:\\Users\\Documents\\Medical Lab\\Results"
                        />
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={() => setIsSaveDialogOpen(false)}
                          >
                            إلغاء
                          </Button>
                          <Button onClick={handleSavePDF}>
                            <Save className="h-4 w-4 ml-2" />
                            حفظ
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={isPrintDialogOpen}
                    onOpenChange={setIsPrintDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="min-w-[120px]"
                      >
                        <Printer className="h-4 w-4 ml-2" />
                        طباعة
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>طباعة نتائج التحليل</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p>اختر خيارات الطباعة:</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="printer-option"
                              defaultChecked
                            />
                            <label htmlFor="printer-option">
                              إرسال إلى الطابعة
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="pdf-option"
                              defaultChecked
                            />
                            <label htmlFor="pdf-option">حفظ كملف PDF</label>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={() => setIsPrintDialogOpen(false)}
                          >
                            إلغاء
                          </Button>
                          <div className="flex gap-2">
                            <Button onClick={handlePrint}>
                              <Printer className="h-4 w-4 ml-2" />
                              طباعة
                            </Button>
                            <Button onClick={handleSavePDF}>
                              <Download className="h-4 w-4 ml-2" />
                              حفظ PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {savedResults && (
                  <div className="bg-green-100 text-green-800 p-3 rounded-md mt-4">
                    تم حفظ نتائج التحليل بنجاح
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedTest ? selectedTest.name : "نتائج التحليل"}
              {selectedPatient && (
                <span className="text-sm font-normal text-muted-foreground mr-2">
                  للمريض: {selectedPatient.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testValues.length > 0 ? (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-right">
                          الفحص
                        </th>
                        <th className="border border-border p-2 text-right">
                          النتيجة
                        </th>
                        <th className="border border-border p-2 text-right">
                          الوحدة
                        </th>
                        <th className="border border-border p-2 text-right">
                          المعدل الطبيعي
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {testValues.map((item, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="border border-border p-2">
                            {item.name}
                          </td>
                          <td className="border border-border p-2">
                            <Input
                              value={item.value}
                              onChange={(e) =>
                                handleValueChange(index, e.target.value)
                              }
                              className={
                                isValueAbnormal(item.value, item.normalRange)
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          </td>
                          <td className="border border-border p-2">
                            {item.unit}
                          </td>
                          <td className="border border-border p-2">
                            {item.normalRange}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">معاينة التقرير</h3>
                  <div
                    className="border border-border rounded-md p-4"
                    ref={printRef}
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold">
                        معمل التحاليل الطبية
                      </h2>
                      <p className="text-muted-foreground">
                        شارع الجمهورية، القاهرة - هاتف: 01012345678
                      </p>
                    </div>

                    <div className="flex justify-between mb-6">
                      <div>
                        <p>
                          <strong>المريض:</strong> {selectedPatient?.name}
                        </p>
                        <p>
                          <strong>العمر:</strong> {selectedPatient?.age} سنة
                        </p>
                        <p>
                          <strong>النوع:</strong>{" "}
                          {selectedPatient?.gender === "male" ? "ذكر" : "أنثى"}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>التاريخ:</strong> {form.getValues().date}
                        </p>
                        <p>
                          <strong>نوع التحليل:</strong> {selectedTest?.name}
                        </p>
                        <p>
                          <strong>رقم التقرير:</strong>{" "}
                          {Math.floor(Math.random() * 10000)}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-4 text-center">
                      نتائج التحليل
                    </h3>

                    <table className="w-full border-collapse mb-6">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border p-2 text-right">
                            الفحص
                          </th>
                          <th className="border border-border p-2 text-right">
                            النتيجة
                          </th>
                          <th className="border border-border p-2 text-right">
                            الوحدة
                          </th>
                          <th className="border border-border p-2 text-right">
                            المعدل الطبيعي
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {testValues.map((item, index) => (
                          <tr key={index}>
                            <td className="border border-border p-2">
                              {item.name}
                            </td>
                            <td className="border border-border p-2">
                              <span
                                className={
                                  isValueAbnormal(item.value, item.normalRange)
                                    ? "text-red-500 font-bold"
                                    : ""
                                }
                              >
                                {item.value || "-"}
                              </span>
                            </td>
                            <td className="border border-border p-2">
                              {item.unit}
                            </td>
                            <td className="border border-border p-2">
                              {item.normalRange}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {form.getValues().notes && (
                      <div className="mb-6">
                        <h4 className="font-bold mb-2">ملاحظات:</h4>
                        <p>{form.getValues().notes}</p>
                      </div>
                    )}

                    <div className="flex justify-between mt-8 pt-4 border-t border-border">
                      <div>
                        <p className="font-bold">توقيع الطبيب</p>
                        <div className="h-10"></div>
                      </div>
                      <div>
                        <p className="font-bold">ختم المعمل</p>
                        <div className="h-10"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                يرجى اختيار المريض ونوع التحليل لإدخال النتائج
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestResultEntry;
