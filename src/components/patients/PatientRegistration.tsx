import { useState, useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Pencil, Trash, Plus, X, Save } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// استيراد التحاليل والأطباء من قاعدة البيانات
const PatientRegistration = () => {
  const [availableTests, setAvailableTests] = useState([
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
  ]);

  const [doctors, setDoctors] = useState([
    { id: "1", name: "د. أحمد محمد" },
    { id: "2", name: "د. سارة أحمد" },
    { id: "3", name: "د. محمد علي" },
    { id: "4", name: "د. فاطمة حسن" },
  ]);

  // استدعاء التحاليل من قاعدة البيانات
  useEffect(() => {
    // في حالة وجود قاعدة بيانات حقيقية، سيتم استبدال هذا الكود بطلب API
    const fetchTests = async () => {
      try {
        // هنا سيتم استدعاء البيانات من قاعدة البيانات
        // const response = await fetch('/api/tests');
        // const data = await response.json();
        // setAvailableTests(data);

        // للتجربة نستخدم البيانات المحلية من جدول الإعدادات
        const testsFromSettings = JSON.parse(
          localStorage.getItem("tests") || "[]",
        );
        if (testsFromSettings.length > 0) {
          setAvailableTests(
            testsFromSettings.map((test) => ({
              id: test.id,
              name: test.name,
              price: parseFloat(test.price),
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    // استدعاء الأطباء من قاعدة البيانات
    const fetchDoctors = async () => {
      try {
        // هنا سيتم استدعاء البيانات من قاعدة البيانات
        // const response = await fetch('/api/doctors');
        // const data = await response.json();
        // setDoctors(data);

        // للتجربة نستخدم البيانات المحلية من جدول الإعدادات
        const doctorsFromSettings = JSON.parse(
          localStorage.getItem("doctors") || "[]",
        );
        if (doctorsFromSettings.length > 0) {
          setDoctors(
            doctorsFromSettings.map((doctor) => ({
              id: doctor.id,
              name: doctor.name,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchTests();
    fetchDoctors();
  }, []);

  const formSchema = z.object({
    fileCode: z.string(),
    name: z.string().min(3, { message: "يجب أن يكون الاسم 3 أحرف على الأقل" }),
    age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "يجب إدخال عمر صحيح",
    }),
    gender: z.enum(["male", "female"]),
    phone: z
      .string()
      .length(11, { message: "يجب أن يكون رقم الهاتف 11 رقم بالضبط" })
      .regex(/^[0-9]+$/, { message: "يجب أن يحتوي رقم الهاتف على أرقام فقط" }),
    test1: z.string().optional(),
    test2: z.string().optional(),
    test3: z.string().optional(),
    discount: z.string().default("0"),
    paid: z.string().default("0"),
    notes: z.string().optional(),
    doctor: z.string().optional(),
  });

  type Patient = z.infer<typeof formSchema> & {
    id: string;
    date: string;
    total: number;
    remaining: number;
  };

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [nextId, setNextId] = useState(1);
  const [labName, setLabName] = useState("برنامج ادارة معمل تحاليل طبية");
  const today = new Date();
  const formattedDate = format(today, "yyyy-MM-dd", { locale: ar });
  const dayName = format(today, "EEEE", { locale: ar });

  // استرجاع اسم المعمل من التخزين المحلي
  useEffect(() => {
    const storedLabName = localStorage.getItem("labName");
    if (storedLabName) {
      setLabName(storedLabName);
    }

    // استرجاع بيانات المرضى المحفوظة سابقاً
    const storedPatients = localStorage.getItem("patients");
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
      // تحديث nextId ليكون أكبر من آخر معرف موجود
      const maxId = Math.max(
        ...JSON.parse(storedPatients).map((p) => parseInt(p.id)),
      );
      setNextId(maxId + 1);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileCode: nextId.toString(),
      name: "",
      age: "",
      gender: "male",
      phone: "",
      test1: "",
      test2: "",
      test3: "",
      discount: "0",
      paid: "0",
      notes: "",
      doctor: "",
    },
  });

  // تحديث كود الملف تلقائيًا
  useEffect(() => {
    form.setValue("fileCode", nextId.toString());
  }, [nextId, form]);

  // حساب المبالغ
  const [test1Price, setTest1Price] = useState(0);
  const [test2Price, setTest2Price] = useState(0);
  const [test3Price, setTest3Price] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState(0);
  const [remaining, setRemaining] = useState(0);

  // تحديث الأسعار عند تغيير التحاليل
  useEffect(() => {
    const test1 = form.watch("test1");
    const test2 = form.watch("test2");
    const test3 = form.watch("test3");
    const discountValue = Number(form.watch("discount")) || 0;
    const paidValue = Number(form.watch("paid")) || 0;

    const price1 = test1
      ? availableTests.find((t) => t.id === test1)?.price || 0
      : 0;
    const price2 = test2
      ? availableTests.find((t) => t.id === test2)?.price || 0
      : 0;
    const price3 = test3
      ? availableTests.find((t) => t.id === test3)?.price || 0
      : 0;

    setTest1Price(price1);
    setTest2Price(price2);
    setTest3Price(price3);

    const total = price1 + price2 + price3;
    setTotalPrice(total);
    setDiscount(discountValue);
    setPaid(paidValue);
    setRemaining(total - discountValue - paidValue);
  }, [form.watch, availableTests]);

  function resetForm() {
    form.reset({
      fileCode: nextId.toString(),
      name: "",
      age: "",
      gender: "male",
      phone: "",
      test1: "",
      test2: "",
      test3: "",
      discount: "0",
      paid: "0",
      notes: "",
      doctor: "",
    });
    setSelectedPatient(null);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newPatient: Patient = {
      id: selectedPatient ? selectedPatient.id : nextId.toString(),
      ...values,
      date: formattedDate,
      total: totalPrice,
      remaining: remaining,
    };

    let updatedPatients;
    if (selectedPatient) {
      // تحديث مريض موجود
      updatedPatients = patients.map((p) =>
        p.id === selectedPatient.id ? newPatient : p,
      );
      setPatients(updatedPatients);
    } else {
      // إضافة مريض جديد
      updatedPatients = [...patients, newPatient];
      setPatients(updatedPatients);
      setNextId(nextId + 1);
    }

    // حفظ البيانات في التخزين المحلي (localStorage)
    localStorage.setItem("patients", JSON.stringify(updatedPatients));

    // في حالة وجود قاعدة بيانات حقيقية، سيتم إرسال البيانات إلى الخادم
    // savePatientToDatabase(newPatient);

    resetForm();
  }

  function handleEdit(patient: Patient) {
    setSelectedPatient(patient);
    form.reset({
      fileCode: patient.fileCode,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      test1: patient.test1 || "",
      test2: patient.test2 || "",
      test3: patient.test3 || "",
      discount: patient.discount,
      paid: patient.paid,
      notes: patient.notes || "",
      doctor: patient.doctor || "",
    });
  }

  function handleDelete(id: string) {
    setPatients(patients.filter((p) => p.id !== id));
    if (selectedPatient && selectedPatient.id === id) {
      resetForm();
    }
  }

  return (
    <div className="bg-background min-h-screen" dir="rtl">
      <div className="p-4 border-b border-border bg-card">
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">{dayName}</div>
          <div className="text-xl font-bold">{labName}</div>
          <div className="text-lg font-medium">{formattedDate}</div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* كود الملف */}
                  <FormField
                    control={form.control}
                    name="fileCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كود الملف</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* اسم المريض */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم المريض</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسم المريض" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* السن */}
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>السن</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل السن" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* النوع */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>النوع</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <RadioGroupItem value="male" id="male" />
                              <label htmlFor="male">ذكر</label>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <RadioGroupItem value="female" id="female" />
                              <label htmlFor="female">أنثى</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* رقم التليفون */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم التليفون</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل رقم التليفون" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* الطبيب */}
                  <FormField
                    control={form.control}
                    name="doctor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الطبيب</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الطبيب" />
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
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="text-lg font-medium mb-4">
                    التحاليل المطلوبة
                  </h3>
                  <div className="space-y-4">
                    {/* التحليل الأول */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <FormField
                        control={form.control}
                        name="test1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>التحليل المطلوب</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                const selectedTest = availableTests.find(
                                  (t) => t.id === value,
                                );
                                if (selectedTest) {
                                  setTest1Price(selectedTest.price);
                                  // تحديث إجمالي السعر والمتبقي
                                  const newTotal =
                                    selectedTest.price +
                                    test2Price +
                                    test3Price;
                                  setTotalPrice(newTotal);
                                  setRemaining(newTotal - discount - paid);
                                }
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر التحليل" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableTests.map((test) => (
                                  <SelectItem key={test.id} value={test.id}>
                                    {test.name} - {test.price} ج.م
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center bg-muted/20 p-2 rounded-md">
                        <span className="text-sm font-medium ml-2">
                          التكلفة:
                        </span>
                        <span className="text-sm font-bold">
                          {test1Price} ج.م
                        </span>
                      </div>
                    </div>

                    {/* التحليل الثاني */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <FormField
                        control={form.control}
                        name="test2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>التحليل المطلوب</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                const selectedTest = availableTests.find(
                                  (t) => t.id === value,
                                );
                                if (selectedTest) {
                                  setTest2Price(selectedTest.price);
                                  // تحديث إجمالي السعر والمتبقي
                                  const newTotal =
                                    test1Price +
                                    selectedTest.price +
                                    test3Price;
                                  setTotalPrice(newTotal);
                                  setRemaining(newTotal - discount - paid);
                                }
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر التحليل" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableTests.map((test) => (
                                  <SelectItem key={test.id} value={test.id}>
                                    {test.name} - {test.price} ج.م
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center bg-muted/20 p-2 rounded-md">
                        <span className="text-sm font-medium ml-2">
                          التكلفة:
                        </span>
                        <span className="text-sm font-bold">
                          {test2Price} ج.م
                        </span>
                      </div>
                    </div>

                    {/* التحليل الثالث */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <FormField
                        control={form.control}
                        name="test3"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>التحليل المطلوب</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                const selectedTest = availableTests.find(
                                  (t) => t.id === value,
                                );
                                if (selectedTest) {
                                  setTest3Price(selectedTest.price);
                                  // تحديث إجمالي السعر والمتبقي
                                  const newTotal =
                                    test1Price +
                                    test2Price +
                                    selectedTest.price;
                                  setTotalPrice(newTotal);
                                  setRemaining(newTotal - discount - paid);
                                }
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر التحليل" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableTests.map((test) => (
                                  <SelectItem key={test.id} value={test.id}>
                                    {test.name} - {test.price} ج.م
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center bg-muted/20 p-2 rounded-md">
                        <span className="text-sm font-medium ml-2">
                          التكلفة:
                        </span>
                        <span className="text-sm font-bold">
                          {test3Price} ج.م
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="text-lg font-medium mb-4">المدفوعات</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* المطلوب */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        المطلوب
                      </label>
                      <div className="flex items-center h-10 px-3 rounded-md border border-input bg-muted/10 font-bold">
                        <span>{totalPrice} ج.م</span>
                      </div>
                    </div>

                    {/* الخصم */}
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الخصم</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => {
                                const value = Number(e.target.value) || 0;
                                field.onChange(e);
                                setDiscount(value);
                                setRemaining(totalPrice - value - paid);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* المدفوع */}
                    <FormField
                      control={form.control}
                      name="paid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المدفوع</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => {
                                const value = Number(e.target.value) || 0;
                                field.onChange(e);
                                setPaid(value);
                                setRemaining(totalPrice - discount - value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* المتبقي */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        المتبقي
                      </label>
                      <div
                        className={`flex items-center h-10 px-3 rounded-md border border-input ${remaining > 0 ? "bg-red-50 text-red-600 font-bold" : "bg-green-50 text-green-600 font-bold"}`}
                      >
                        <span>{remaining} ج.م</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ملاحظات */}
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

                <div className="flex flex-wrap gap-3 justify-center">
                  <Button type="submit" className="min-w-[120px]">
                    {selectedPatient ? (
                      <>
                        <Save className="h-4 w-4 ml-2" />
                        حفظ التعديلات
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="min-w-[120px]"
                    onClick={resetForm}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    تسجيل بيان جديد
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="min-w-[120px]"
                    onClick={() => window.history.back()}
                  >
                    <X className="h-4 w-4 ml-2" />
                    إغلاق
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">سجل المرضى</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-right">
                    كود الملف
                  </th>
                  <th className="border border-border p-2 text-right">
                    اسم المريض
                  </th>
                  <th className="border border-border p-2 text-right">السن</th>
                  <th className="border border-border p-2 text-right">النوع</th>
                  <th className="border border-border p-2 text-right">
                    رقم التليفون
                  </th>
                  <th className="border border-border p-2 text-right">
                    التاريخ
                  </th>
                  <th className="border border-border p-2 text-right">
                    المطلوب
                  </th>
                  <th className="border border-border p-2 text-right">
                    المدفوع
                  </th>
                  <th className="border border-border p-2 text-right">
                    المتبقي
                  </th>
                  <th className="border border-border p-2 text-right">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-muted/50">
                    <td className="border border-border p-2">
                      {patient.fileCode}
                    </td>
                    <td className="border border-border p-2">{patient.name}</td>
                    <td className="border border-border p-2">{patient.age}</td>
                    <td className="border border-border p-2">
                      {patient.gender === "male" ? "ذكر" : "أنثى"}
                    </td>
                    <td className="border border-border p-2">
                      {patient.phone}
                    </td>
                    <td className="border border-border p-2">{patient.date}</td>
                    <td className="border border-border p-2">
                      {patient.total} ج.م
                    </td>
                    <td className="border border-border p-2">
                      {patient.paid} ج.م
                    </td>
                    <td className="border border-border p-2">
                      {patient.remaining} ج.م
                    </td>
                    <td className="border border-border p-2">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(patient)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(patient.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;
