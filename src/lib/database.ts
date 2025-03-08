// هذا الملف يحتوي على وظائف التعامل مع قاعدة البيانات
// في الإصدار الحالي، نستخدم localStorage كبديل مؤقت لقاعدة البيانات

// نماذج البيانات
export interface Patient {
  id: string;
  fileCode: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  test1?: string;
  test2?: string;
  test3?: string;
  discount: string;
  paid: string;
  notes?: string;
  doctor?: string;
  date: string;
  total: number;
  remaining: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone?: string;
}

export interface Test {
  id: string;
  name: string;
  price: string;
  description?: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: "admin" | "user";
  permissions?: Record<string, boolean>;
}

export interface LabInfo {
  labName: string;
  address: string;
  phone: string;
  email?: string;
  logo?: string;
  notes?: string;
}

export interface MonthlyProfit {
  month: string;
  year: string;
  revenue: number;
  expenses: Record<string, number>;
  netProfit: number;
}

export interface YearlyProfit {
  year: string;
  revenue: number;
  expenses: Record<string, number>;
  netProfit: number;
  monthlyData: Record<string, number>;
}

// وظائف التعامل مع المرضى
export const getPatients = (): Patient[] => {
  const data = localStorage.getItem("patients");
  return data ? JSON.parse(data) : [];
};

export const savePatient = (patient: Patient): void => {
  const patients = getPatients();
  const index = patients.findIndex((p) => p.id === patient.id);

  if (index >= 0) {
    // تحديث مريض موجود
    patients[index] = patient;
  } else {
    // إضافة مريض جديد
    patients.push(patient);
  }

  localStorage.setItem("patients", JSON.stringify(patients));
};

export const deletePatient = (id: string): void => {
  const patients = getPatients().filter((p) => p.id !== id);
  localStorage.setItem("patients", JSON.stringify(patients));
};

// وظائف التعامل مع الأطباء
export const getDoctors = (): Doctor[] => {
  const data = localStorage.getItem("doctors");
  return data ? JSON.parse(data) : [];
};

export const saveDoctor = (doctor: Doctor): void => {
  const doctors = getDoctors();
  const index = doctors.findIndex((d) => d.id === doctor.id);

  if (index >= 0) {
    // تحديث طبيب موجود
    doctors[index] = doctor;
  } else {
    // إضافة طبيب جديد
    doctors.push(doctor);
  }

  localStorage.setItem("doctors", JSON.stringify(doctors));
};

export const deleteDoctor = (id: string): void => {
  const doctors = getDoctors().filter((d) => d.id !== id);
  localStorage.setItem("doctors", JSON.stringify(doctors));
};

// وظائف التعامل مع التحاليل
export const getTests = (): Test[] => {
  const data = localStorage.getItem("tests");
  return data ? JSON.parse(data) : [];
};

export const saveTest = (test: Test): void => {
  const tests = getTests();
  const index = tests.findIndex((t) => t.id === test.id);

  if (index >= 0) {
    // تحديث تحليل موجود
    tests[index] = test;
  } else {
    // إضافة تحليل جديد
    tests.push(test);
  }

  localStorage.setItem("tests", JSON.stringify(tests));
};

export const deleteTest = (id: string): void => {
  const tests = getTests().filter((t) => t.id !== id);
  localStorage.setItem("tests", JSON.stringify(tests));
};

// وظائف التعامل مع المستخدمين
export const getUsers = (): User[] => {
  const data = localStorage.getItem("users");
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === user.id);

  if (index >= 0) {
    // تحديث مستخدم موجود
    users[index] = user;
  } else {
    // إضافة مستخدم جديد
    users.push(user);
  }

  localStorage.setItem("users", JSON.stringify(users));
};

export const deleteUser = (id: string): void => {
  const users = getUsers().filter((u) => u.id !== id);
  localStorage.setItem("users", JSON.stringify(users));
};

// وظائف التعامل مع معلومات المعمل
export const getLabInfo = (): LabInfo | null => {
  const data = localStorage.getItem("labInfo");
  return data ? JSON.parse(data) : null;
};

export const saveLabInfo = (info: LabInfo): void => {
  localStorage.setItem("labInfo", JSON.stringify(info));
  // حفظ اسم المعمل بشكل منفصل للاستخدام السريع
  localStorage.setItem("labName", info.labName);
};

// وظائف التعامل مع الأرباح
export const getMonthlyProfits = (): MonthlyProfit[] => {
  const data = localStorage.getItem("monthlyProfits");
  return data ? JSON.parse(data) : [];
};

export const saveMonthlyProfit = (profit: MonthlyProfit): void => {
  const profits = getMonthlyProfits();
  const index = profits.findIndex(
    (p) => p.month === profit.month && p.year === profit.year,
  );

  if (index >= 0) {
    // تحديث ربح موجود
    profits[index] = profit;
  } else {
    // إضافة ربح جديد
    profits.push(profit);
  }

  localStorage.setItem("monthlyProfits", JSON.stringify(profits));
};

export const getYearlyProfits = (): YearlyProfit[] => {
  const data = localStorage.getItem("yearlyProfits");
  return data ? JSON.parse(data) : [];
};

export const saveYearlyProfit = (profit: YearlyProfit): void => {
  const profits = getYearlyProfits();
  const index = profits.findIndex((p) => p.year === profit.year);

  if (index >= 0) {
    // تحديث ربح موجود
    profits[index] = profit;
  } else {
    // إضافة ربح جديد
    profits.push(profit);
  }

  localStorage.setItem("yearlyProfits", JSON.stringify(profits));
};
