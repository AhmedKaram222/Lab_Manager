// خدمة إدارة التحاليل والمرضى

// استيراد بيانات المرضى من التخزين المحلي
export const getPatients = () => {
  const storedPatients = localStorage.getItem("patients");
  console.log("Retrieved patients from localStorage:", storedPatients);
  return storedPatients ? JSON.parse(storedPatients) : [];
};

// حفظ بيانات المرضى في التخزين المحلي
export const savePatients = (patients: any[]) => {
  localStorage.setItem("patients", JSON.stringify(patients));
};

// استيراد بيانات التحاليل من التخزين المحلي
export const getTests = () => {
  const storedTests = localStorage.getItem("tests");
  return storedTests ? JSON.parse(storedTests) : [];
};

// استيراد نتائج التحاليل من التخزين المحلي
export const getTestResults = () => {
  const storedResults = localStorage.getItem("testResults");
  return storedResults ? JSON.parse(storedResults) : [];
};

// حفظ نتائج التحاليل في التخزين المحلي
export const saveTestResults = (results: any[]) => {
  localStorage.setItem("testResults", JSON.stringify(results));
};

// إضافة نتيجة تحليل جديدة
export const addTestResult = (result: any) => {
  const results = getTestResults();
  results.push(result);
  saveTestResults(results);
  return result;
};

// الحصول على بيانات مريض بواسطة المعرف
export const getPatientById = (id: string) => {
  const patients = getPatients();
  return patients.find(
    (patient: any) => patient.id === id || patient.fileCode === id,
  );
};

// الحصول على نتائج تحاليل مريض بواسطة معرف المريض
export const getPatientResults = (patientId: string) => {
  const results = getTestResults();
  return results.filter((result: any) => result.patientId === patientId);
};

// الحصول على اسم التحليل بناءً على المعرف
export const getTestName = (testId: string) => {
  const testNames: { [key: string]: string } = {
    "1": "تحليل دم شامل",
    "2": "وظائف كبد",
    "3": "وظائف كلى",
    "4": "سكر صائم",
    "5": "صورة دم كاملة",
    "6": "تحليل بول",
    "7": "هرمونات",
    "8": "دهون",
    "9": "فيتامين د",
    "10": "فيروسات كبدية",
  };
  return testNames[testId] || "تحليل غير معروف";
};

// الحصول على نوع التقرير بناءً على نوع التحليل
export const getReportTypeFromTestName = (testType: string) => {
  if (testType.includes("دم")) {
    return "cbc";
  } else if (testType.includes("كبد")) {
    return "renal";
  } else if (testType.includes("كلى")) {
    return "renal";
  } else if (testType.includes("سكر")) {
    return "sugar";
  } else if (testType.includes("بول")) {
    return "stool";
  } else if (testType.includes("هرمونات")) {
    return "crp";
  } else if (testType.includes("دهون")) {
    return "lipid";
  } else if (testType.includes("فيتامين")) {
    return "crp";
  } else if (testType.includes("فيروسات")) {
    return "hpylori";
  }
  return "cbc";
};
