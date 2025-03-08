import { useState } from "react";
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

// قائمة التحاليل المتاحة مع أسعارها
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

const formSchema = z.object({
  testId: z.string(),
  name: z.string().min(3, { message: "يجب إدخال اسم التحليل" }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "يجب إدخال سعر صحيح",
  }),
  description: z.string().optional(),
});

type Test = z.infer<typeof formSchema> & {
  id: string;
};

const TestsForm = () => {
  const [tests, setTests] = useState<Test[]>(
    availableTests.map((test) => ({
      id: test.id,
      testId: test.id,
      name: test.name,
      price: test.price.toString(),
      description: "",
    })),
  );
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [nextId, setNextId] = useState(availableTests.length + 1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testId: "",
      name: "",
      price: "",
      description: "",
    },
  });

  function resetForm() {
    form.reset({
      testId: "",
      name: "",
      price: "",
      description: "",
    });
    setSelectedTest(null);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newTest: Test = {
      id: selectedTest ? selectedTest.id : nextId.toString(),
      ...values,
    };

    if (selectedTest) {
      // تحديث تحليل موجود
      setTests(tests.map((t) => (t.id === selectedTest.id ? newTest : t)));
    } else {
      // إضافة تحليل جديد
      setTests([...tests, newTest]);
      setNextId(nextId + 1);
    }

    resetForm();
  }

  function handleEdit(test: Test) {
    setSelectedTest(test);
    form.reset({
      testId: test.testId,
      name: test.name,
      price: test.price,
      description: test.description || "",
    });
  }

  function handleDelete(id: string) {
    setTests(tests.filter((t) => t.id !== id));
    if (selectedTest && selectedTest.id === id) {
      resetForm();
    }
  }

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">إدارة التحاليل</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedTest ? "تعديل بيانات التحليل" : "إضافة تحليل جديد"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="testId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كود التحليل</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل كود التحليل" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم التحليل</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسم التحليل" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>السعر</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="أدخل سعر التحليل"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وصف التحليل</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل وصف التحليل (اختياري)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="submit">
                    {selectedTest ? "حفظ التعديلات" : "إضافة تحليل"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    إلغاء
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>قائمة التحاليل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-right">
                      الكود
                    </th>
                    <th className="border border-border p-2 text-right">
                      الاسم
                    </th>
                    <th className="border border-border p-2 text-right">
                      السعر
                    </th>
                    <th className="border border-border p-2 text-right">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test) => (
                    <tr key={test.id} className="hover:bg-muted/50">
                      <td className="border border-border p-2">
                        {test.testId}
                      </td>
                      <td className="border border-border p-2">{test.name}</td>
                      <td className="border border-border p-2">
                        {test.price} ج.م
                      </td>
                      <td className="border border-border p-2">
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(test)}
                          >
                            تعديل
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(test.id)}
                          >
                            حذف
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
    </div>
  );
};

export default TestsForm;
