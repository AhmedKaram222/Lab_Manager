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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Save,
  UserPlus,
  Trash,
  Pencil,
  Database,
  CloudUpload,
  Users,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const labFormSchema = z.object({
  labName: z
    .string()
    .min(3, { message: "يجب أن يكون اسم المعمل 3 أحرف على الأقل" }),
  address: z.string().min(5, { message: "يجب إدخال عنوان صحيح" }),
  phone: z
    .string()
    .min(11, { message: "يجب أن يكون رقم الهاتف 11 رقم على الأقل" }),
  email: z
    .string()
    .email({ message: "يرجى إدخال بريد إلكتروني صحيح" })
    .optional()
    .or(z.literal("")),
  logo: z.string().optional(),
  notes: z.string().optional(),
});

const userFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "يجب أن يكون اسم المستخدم 3 أحرف على الأقل" }),
  password: z
    .string()
    .min(6, { message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل" }),
  role: z.enum(["admin", "user"]),
  permissions: z.record(z.boolean()).optional(),
});

const testFormSchema = z.object({
  name: z.string().min(3, { message: "يجب إدخال اسم التحليل" }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "يجب إدخال سعر صحيح",
  }),
  description: z.string().optional(),
});

const doctorFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "يجب أن يكون اسم الطبيب 3 أحرف على الأقل" }),
  specialty: z.string().min(2, { message: "يجب إدخال التخصص" }),
  phone: z.string().optional(),
});

// قائمة المستخدمين
const initialUsers = [
  {
    id: "1",
    username: "admin",
    password: "******",
    role: "admin",
    permissions: {},
  },
  {
    id: "2",
    username: "user1",
    password: "******",
    role: "user",
    permissions: {
      viewPatients: true,
      addPatients: true,
      editPatients: false,
      deletePatients: false,
      viewTests: true,
      addTests: false,
      viewResults: true,
      addResults: true,
      viewStatistics: false,
      viewSettings: false,
    },
  },
];

// قائمة الأطباء
const initialDoctors = [
  { id: "1", name: "د. أحمد محمد", specialty: "باطنة", phone: "01012345678" },
  {
    id: "2",
    name: "د. سارة أحمد",
    specialty: "نساء وتوليد",
    phone: "01112345678",
  },
  { id: "3", name: "د. محمد علي", specialty: "أطفال", phone: "01212345678" },
  { id: "4", name: "د. فاطمة حسن", specialty: "جلدية", phone: "01512345678" },
];

// قائمة التحاليل
const initialTests = [
  {
    id: "1",
    name: "تحليل دم شامل",
    price: "150",
    description: "تحليل شامل لمكونات الدم",
  },
  { id: "2", name: "وظائف كبد", price: "200", description: "قياس وظائف الكبد" },
  { id: "3", name: "وظائف كلى", price: "180", description: "قياس وظائف الكلى" },
  {
    id: "4",
    name: "سكر صائم",
    price: "80",
    description: "قياس نسبة السكر في الدم",
  },
  {
    id: "5",
    name: "صورة دم كاملة",
    price: "120",
    description: "تحليل مفصل لمكونات الدم",
  },
];

const permissionsList = [
  { id: "viewPatients", label: "عرض المرضى" },
  { id: "addPatients", label: "إضافة مرضى" },
  { id: "editPatients", label: "تعديل بيانات المرضى" },
  { id: "deletePatients", label: "حذف المرضى" },
  { id: "viewTests", label: "عرض التحاليل" },
  { id: "addTests", label: "إضافة وتعديل التحاليل" },
  { id: "viewResults", label: "عرض النتائج" },
  { id: "addResults", label: "إضافة نتائج" },
  { id: "viewStatistics", label: "عرض الإحصائيات" },
  { id: "viewSettings", label: "عرض وتعديل الإعدادات" },
];

const LabSettings = () => {
  const [activeTab, setActiveTab] = useState("lab");
  const [savedSettings, setSavedSettings] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [tests, setTests] = useState(initialTests);
  const [selectedUser, setSelectedUser] = useState<
    (z.infer<typeof userFormSchema> & { id: string }) | null
  >(null);
  const [selectedDoctor, setSelectedDoctor] = useState<
    (z.infer<typeof doctorFormSchema> & { id: string }) | null
  >(null);
  const [selectedTest, setSelectedTest] = useState<
    (z.infer<typeof testFormSchema> & { id: string }) | null
  >(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDoctorDialogOpen, setIsDoctorDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupStatus, setBackupStatus] = useState("");
  const [nextUserId, setNextUserId] = useState(3);
  const [nextDoctorId, setNextDoctorId] = useState(5);
  const [nextTestId, setNextTestId] = useState(6);

  // استرجاع بيانات المعمل والمستخدمين والأطباء والتحاليل من التخزين المحلي
  useEffect(() => {
    // استرجاع بيانات المعمل
    const storedLabInfo = localStorage.getItem("labInfo");
    if (storedLabInfo) {
      const labInfo = JSON.parse(storedLabInfo);
      Object.keys(labInfo).forEach((key) => {
        labForm.setValue(key, labInfo[key]);
      });
    } else {
      const storedLabName = localStorage.getItem("labName");
      if (storedLabName) {
        labForm.setValue("labName", storedLabName);
      }
    }

    // استرجاع بيانات المستخدمين
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
      // تحديث nextUserId ليكون أكبر من آخر معرف موجود
      if (parsedUsers.length > 0) {
        const maxId = Math.max(...parsedUsers.map((u) => parseInt(u.id)));
        setNextUserId(maxId + 1);
      }
    }

    // استرجاع بيانات الأطباء
    const storedDoctors = localStorage.getItem("doctors");
    if (storedDoctors) {
      const parsedDoctors = JSON.parse(storedDoctors);
      setDoctors(parsedDoctors);
      // تحديث nextDoctorId ليكون أكبر من آخر معرف موجود
      if (parsedDoctors.length > 0) {
        const maxId = Math.max(...parsedDoctors.map((d) => parseInt(d.id)));
        setNextDoctorId(maxId + 1);
      }
    }

    // استرجاع بيانات التحاليل
    const storedTests = localStorage.getItem("tests");
    if (storedTests) {
      const parsedTests = JSON.parse(storedTests);
      setTests(parsedTests);
      // تحديث nextTestId ليكون أكبر من آخر معرف موجود
      if (parsedTests.length > 0) {
        const maxId = Math.max(...parsedTests.map((t) => parseInt(t.id)));
        setNextTestId(maxId + 1);
      }
    }
  }, []);

  const labForm = useForm<z.infer<typeof labFormSchema>>({
    resolver: zodResolver(labFormSchema),
    defaultValues: {
      labName: "معمل التحاليل الطبية",
      address: "شارع الجمهورية، القاهرة",
      phone: "01012345678",
      email: "info@lab.com",
      logo: "",
      notes: "",
    },
  });

  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "user",
      permissions: {},
    },
  });

  const doctorForm = useForm<z.infer<typeof doctorFormSchema>>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      specialty: "",
      phone: "",
    },
  });

  const testForm = useForm<z.infer<typeof testFormSchema>>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
    },
  });

  function onLabSubmit(values: z.infer<typeof labFormSchema>) {
    console.log(values);
    // حفظ اسم المعمل في التخزين المحلي
    localStorage.setItem("labName", values.labName);

    // حفظ بيانات المعمل كاملة
    localStorage.setItem("labInfo", JSON.stringify(values));

    // في حالة وجود قاعدة بيانات حقيقية، سيتم إرسال البيانات إلى الخادم
    // saveLaboratoryInfoToDatabase(values);

    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  }

  function onUserSubmit(values: z.infer<typeof userFormSchema>) {
    console.log(values);

    // التحقق من عدم تكرار اسم المستخدم
    if (
      !selectedUser &&
      users.some((user) => user.username === values.username)
    ) {
      alert("اسم المستخدم موجود بالفعل، يرجى اختيار اسم آخر");
      return;
    }

    let updatedUsers;
    if (selectedUser) {
      // تحديث مستخدم موجود
      updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...values, id: selectedUser.id } : user,
      );
      setUsers(updatedUsers);
    } else {
      // إضافة مستخدم جديد
      updatedUsers = [...users, { ...values, id: nextUserId.toString() }];
      setUsers(updatedUsers);
      setNextUserId(nextUserId + 1);
    }

    // حفظ البيانات في التخزين المحلي (localStorage)
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // في حالة وجود قاعدة بيانات حقيقية، سيتم إرسال البيانات إلى الخادم
    // saveUserToDatabase(values);

    resetUserForm();
    setIsUserDialogOpen(false);
  }

  function onDoctorSubmit(values: z.infer<typeof doctorFormSchema>) {
    console.log(values);

    let updatedDoctors;
    if (selectedDoctor) {
      // تحديث طبيب موجود
      updatedDoctors = doctors.map((doctor) =>
        doctor.id === selectedDoctor.id
          ? { ...values, id: selectedDoctor.id }
          : doctor,
      );
      setDoctors(updatedDoctors);
    } else {
      // إضافة طبيب جديد
      updatedDoctors = [...doctors, { ...values, id: nextDoctorId.toString() }];
      setDoctors(updatedDoctors);
      setNextDoctorId(nextDoctorId + 1);
    }

    // حفظ البيانات في التخزين المحلي (localStorage)
    localStorage.setItem("doctors", JSON.stringify(updatedDoctors));

    // في حالة وجود قاعدة بيانات حقيقية، سيتم إرسال البيانات إلى الخادم
    // saveDoctorToDatabase(values);

    resetDoctorForm();
    setIsDoctorDialogOpen(false);
  }

  function onTestSubmit(values: z.infer<typeof testFormSchema>) {
    console.log(values);

    let updatedTests;
    if (selectedTest) {
      // تحديث تحليل موجود
      updatedTests = tests.map((test) =>
        test.id === selectedTest.id ? { ...values, id: selectedTest.id } : test,
      );
      setTests(updatedTests);
    } else {
      // إضافة تحليل جديد
      updatedTests = [...tests, { ...values, id: nextTestId.toString() }];
      setTests(updatedTests);
      setNextTestId(nextTestId + 1);
    }

    // حفظ البيانات في التخزين المحلي (localStorage)
    localStorage.setItem("tests", JSON.stringify(updatedTests));

    // في حالة وجود قاعدة بيانات حقيقية، سيتم إرسال البيانات إلى الخادم
    // saveTestToDatabase(values);

    resetTestForm();
    setIsTestDialogOpen(false);
  }

  function resetUserForm() {
    userForm.reset({
      username: "",
      password: "",
      role: "user",
      permissions: {},
    });
    setSelectedUser(null);
  }

  function resetDoctorForm() {
    doctorForm.reset({
      name: "",
      specialty: "",
      phone: "",
    });
    setSelectedDoctor(null);
  }

  function resetTestForm() {
    testForm.reset({
      name: "",
      price: "",
      description: "",
    });
    setSelectedTest(null);
  }

  function handleEditUser(
    user: z.infer<typeof userFormSchema> & { id: string },
  ) {
    setSelectedUser(user);
    userForm.reset({
      username: user.username,
      password: "******", // لا نعرض كلمة المرور الحقيقية
      role: user.role,
      permissions: user.permissions || {},
    });
    setIsUserDialogOpen(true);
  }

  function handleDeleteUser(id: string) {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);

      // تحديث البيانات في التخزين المحلي
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // في حالة وجود قاعدة بيانات حقيقية، سيتم حذف البيانات من الخادم
      // deleteUserFromDatabase(id);
    }
  }

  function handleEditDoctor(
    doctor: z.infer<typeof doctorFormSchema> & { id: string },
  ) {
    setSelectedDoctor(doctor);
    doctorForm.reset({
      name: doctor.name,
      specialty: doctor.specialty,
      phone: doctor.phone || "",
    });
    setIsDoctorDialogOpen(true);
  }

  function handleDeleteDoctor(id: string) {
    if (confirm("هل أنت متأكد من حذف هذا الطبيب؟")) {
      const updatedDoctors = doctors.filter((doctor) => doctor.id !== id);
      setDoctors(updatedDoctors);

      // تحديث البيانات في التخزين المحلي
      localStorage.setItem("doctors", JSON.stringify(updatedDoctors));

      // في حالة وجود قاعدة بيانات حقيقية، سيتم حذف البيانات من الخادم
      // deleteDoctorFromDatabase(id);
    }
  }

  function handleEditTest(
    test: z.infer<typeof testFormSchema> & { id: string },
  ) {
    setSelectedTest(test);
    testForm.reset({
      name: test.name,
      price: test.price,
      description: test.description || "",
    });
    setIsTestDialogOpen(true);
  }

  function handleDeleteTest(id: string) {
    if (confirm("هل أنت متأكد من حذف هذا التحليل؟")) {
      const updatedTests = tests.filter((test) => test.id !== id);
      setTests(updatedTests);

      // تحديث البيانات في التخزين المحلي
      localStorage.setItem("tests", JSON.stringify(updatedTests));

      // في حالة وجود قاعدة بيانات حقيقية، سيتم حذف البيانات من الخادم
      // deleteTestFromDatabase(id);
    }
  }

  function handleBackup() {
    setBackupProgress(0);
    setBackupStatus("جاري إنشاء النسخة الاحتياطية...");

    // محاكاة عملية النسخ الاحتياطي
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackupStatus("تم إنشاء النسخة الاحتياطية بنجاح");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  }

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">إعدادات النظام</h1>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="lab">معلومات المعمل</TabsTrigger>
          <TabsTrigger value="users">المستخدمين</TabsTrigger>
          <TabsTrigger value="doctors">الأطباء</TabsTrigger>
          <TabsTrigger value="tests">التحاليل</TabsTrigger>
          <TabsTrigger value="backup">النسخ الاحتياطي</TabsTrigger>
        </TabsList>

        {/* معلومات المعمل */}
        <TabsContent value="lab">
          <Card>
            <CardHeader>
              <CardTitle>معلومات المعمل الأساسية</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...labForm}>
                <form
                  onSubmit={labForm.handleSubmit(onLabSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={labForm.control}
                    name="labName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم المعمل</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسم المعمل" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={labForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل عنوان المعمل" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={labForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الهاتف</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل رقم الهاتف" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={labForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل البريد الإلكتروني (اختياري)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={labForm.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>شعار المعمل</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // هنا يمكن تحويل الصورة إلى Base64 أو رفعها إلى الخادم
                                field.onChange(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        {field.value && (
                          <div className="mt-2">
                            <img
                              src={field.value}
                              alt="شعار المعمل"
                              className="h-20 object-contain"
                            />
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={labForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ملاحظات إضافية</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل أي ملاحظات إضافية تظهر في التقارير"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">
                    <Save className="h-4 w-4 ml-2" />
                    حفظ الإعدادات
                  </Button>

                  {savedSettings && (
                    <div className="bg-green-100 text-green-800 p-3 rounded-md mt-4">
                      تم حفظ الإعدادات بنجاح
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* المستخدمين */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>إدارة المستخدمين</CardTitle>
              <Dialog
                open={isUserDialogOpen}
                onOpenChange={setIsUserDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button onClick={resetUserForm}>
                    <UserPlus className="h-4 w-4 ml-2" />
                    إضافة مستخدم جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedUser ? "تعديل مستخدم" : "إضافة مستخدم جديد"}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...userForm}>
                    <form
                      onSubmit={userForm.handleSubmit(onUserSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={userForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المستخدم</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="أدخل اسم المستخدم"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>كلمة المرور</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="أدخل كلمة المرور"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>نوع المستخدم</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <RadioGroupItem value="admin" id="admin" />
                                  <Label htmlFor="admin">
                                    مدير مسؤول (كل الصلاحيات)
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <RadioGroupItem value="user" id="user" />
                                  <Label htmlFor="user">
                                    مستخدم (صلاحيات محددة)
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {userForm.watch("role") === "user" && (
                        <div className="space-y-3">
                          <FormLabel>الصلاحيات</FormLabel>
                          <div className="border rounded-md p-4 space-y-2">
                            {permissionsList.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center space-x-2 space-x-reverse"
                              >
                                <Checkbox
                                  id={permission.id}
                                  checked={userForm.watch(
                                    `permissions.${permission.id}`,
                                  )}
                                  onCheckedChange={(checked) => {
                                    userForm.setValue(
                                      `permissions.${permission.id}`,
                                      checked,
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={permission.id}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {permission.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <DialogFooter>
                        <Button type="submit">
                          {selectedUser ? "حفظ التعديلات" : "إضافة مستخدم"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-right">
                        اسم المستخدم
                      </th>
                      <th className="border border-border p-2 text-right">
                        نوع المستخدم
                      </th>
                      <th className="border border-border p-2 text-right">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/50">
                        <td className="border border-border p-2">
                          {user.username}
                        </td>
                        <td className="border border-border p-2">
                          {user.role === "admin" ? "مدير مسؤول" : "مستخدم"}
                        </td>
                        <td className="border border-border p-2">
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditUser(user)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.username === "admin"} // لا يمكن حذف المستخدم الرئيسي
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
        </TabsContent>

        {/* الأطباء */}
        <TabsContent value="doctors">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>إدارة الأطباء</CardTitle>
              <Dialog
                open={isDoctorDialogOpen}
                onOpenChange={setIsDoctorDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button onClick={resetDoctorForm}>
                    <UserPlus className="h-4 w-4 ml-2" />
                    إضافة طبيب جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedDoctor
                        ? "تعديل بيانات الطبيب"
                        : "إضافة طبيب جديد"}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...doctorForm}>
                    <form
                      onSubmit={doctorForm.handleSubmit(onDoctorSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={doctorForm.control}
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
                        control={doctorForm.control}
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
                        control={doctorForm.control}
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

                      <DialogFooter>
                        <Button type="submit">
                          {selectedDoctor ? "حفظ التعديلات" : "إضافة طبيب"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-right">
                        اسم الطبيب
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
                              onClick={() => handleEditDoctor(doctor)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDoctor(doctor.id)}
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
        </TabsContent>

        {/* التحاليل */}
        <TabsContent value="tests">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>إدارة التحاليل</CardTitle>
              <Dialog
                open={isTestDialogOpen}
                onOpenChange={setIsTestDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button onClick={resetTestForm}>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة تحليل جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedTest
                        ? "تعديل بيانات التحليل"
                        : "إضافة تحليل جديد"}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...testForm}>
                    <form
                      onSubmit={testForm.handleSubmit(onTestSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={testForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم التحليل</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="أدخل اسم التحليل"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={testForm.control}
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
                        control={testForm.control}
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

                      <DialogFooter>
                        <Button type="submit">
                          {selectedTest ? "حفظ التعديلات" : "إضافة تحليل"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-right">
                        اسم التحليل
                      </th>
                      <th className="border border-border p-2 text-right">
                        السعر
                      </th>
                      <th className="border border-border p-2 text-right">
                        الوصف
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
                          {test.name}
                        </td>
                        <td className="border border-border p-2">
                          {test.price} ج.م
                        </td>
                        <td className="border border-border p-2">
                          {test.description || "-"}
                        </td>
                        <td className="border border-border p-2">
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditTest(test)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTest(test.id)}
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
        </TabsContent>

        {/* النسخ الاحتياطي */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>النسخ الاحتياطي واستعادة البيانات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">النسخ الاحتياطي</h3>
                <p className="text-muted-foreground">
                  قم بعمل نسخة احتياطية من بيانات المعمل للحفاظ عليها من
                  الفقدان.
                </p>

                <Dialog
                  open={isBackupDialogOpen}
                  onOpenChange={setIsBackupDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Database className="h-4 w-4 ml-2" />
                      إنشاء نسخة احتياطية
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>النسخ الاحتياطي</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1">
                            {backupStatus}
                          </div>
                          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${backupProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>حفظ على Google Drive</span>
                          <Switch id="google-drive" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>حفظ نسخة محلية</span>
                          <Switch id="local-backup" defaultChecked />
                        </div>
                      </div>

                      <div className="flex justify-between mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsBackupDialogOpen(false)}
                          disabled={backupProgress > 0 && backupProgress < 100}
                        >
                          إغلاق
                        </Button>
                        <Button
                          onClick={handleBackup}
                          disabled={backupProgress > 0 && backupProgress < 100}
                        >
                          <CloudUpload className="h-4 w-4 ml-2" />
                          {backupProgress === 0
                            ? "بدء النسخ الاحتياطي"
                            : backupProgress === 100
                              ? "تم بنجاح"
                              : "جاري النسخ..."}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-medium">استعادة البيانات</h3>
                <p className="text-muted-foreground">
                  استعادة البيانات من نسخة احتياطية سابقة.
                </p>

                <div className="flex flex-col space-y-2">
                  <Button variant="outline">
                    <Database className="h-4 w-4 ml-2" />
                    استعادة من ملف
                  </Button>
                  <Button variant="outline">
                    <CloudUpload className="h-4 w-4 ml-2" />
                    استعادة من Google Drive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LabSettings;
