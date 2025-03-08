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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash, Plus, Save } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, { message: "يجب أن يكون الاسم 3 أحرف على الأقل" }),
  specialty: z.string().min(2, { message: "يجب إدخال التخصص" }),
  phone: z.string().optional(),
});

type Doctor = z.infer<typeof formSchema> & {
  id: string;
};

const DoctorsManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: "1", name: "د. أحمد محمد", specialty: "باطنة", phone: "01012345678" },
    {
      id: "2",
      name: "د. سارة أحمد",
      specialty: "نساء وتوليد",
      phone: "01112345678",
    },
    { id: "3", name: "د. محمد علي", specialty: "أطفال", phone: "01212345678" },
    { id: "4", name: "د. فاطمة حسن", specialty: "جلدية", phone: "01512345678" },
  ]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [nextId, setNextId] = useState(5);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      specialty: "",
      phone: "",
    },
  });

  function resetForm() {
    form.reset({
      name: "",
      specialty: "",
      phone: "",
    });
    setSelectedDoctor(null);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newDoctor: Doctor = {
      id: selectedDoctor ? selectedDoctor.id : nextId.toString(),
      ...values,
    };

    if (selectedDoctor) {
      // تحديث طبيب موجود
      setDoctors(
        doctors.map((d) => (d.id === selectedDoctor.id ? newDoctor : d)),
      );
    } else {
      // إضافة طبيب جديد
      setDoctors([...doctors, newDoctor]);
      setNextId(nextId + 1);
    }

    resetForm();
  }

  function handleEdit(doctor: Doctor) {
    setSelectedDoctor(doctor);
    form.reset({
      name: doctor.name,
      specialty: doctor.specialty,
      phone: doctor.phone || "",
    });
  }

  function handleDelete(id: string) {
    setDoctors(doctors.filter((d) => d.id !== id));
    if (selectedDoctor && selectedDoctor.id === id) {
      resetForm();
    }
  }

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">إدارة الأطباء</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDoctor ? "تعديل بيانات الطبيب" : "إضافة طبيب جديد"}
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الطبيب</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسم الطبيب" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>التخصص</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل التخصص" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل رقم الهاتف (اختياري)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="submit">
                    {selectedDoctor ? (
                      <>
                        <Save className="h-4 w-4 ml-2" />
                        حفظ التعديلات
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة طبيب
                      </>
                    )}
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
            <CardTitle>قائمة الأطباء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-right">
                      الاسم
                    </th>
                    <th className="border border-border p-2 text-right">
                      التخصص
                    </th>
                    <th className="border border-border p-2 text-right">
                      رقم الهاتف
                    </th>
                    <th className="border border-border p-2 text-right">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-muted/50">
                      <td className="border border-border p-2">
                        {doctor.name}
                      </td>
                      <td className="border border-border p-2">
                        {doctor.specialty}
                      </td>
                      <td className="border border-border p-2">
                        {doctor.phone || "-"}
                      </td>
                      <td className="border border-border p-2">
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(doctor)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(doctor.id)}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorsManagement;
