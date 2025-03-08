import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// وظائف التعامل مع المرضى
export const getPatients = async () => {
  const { data, error } = await supabase.from("patients").select("*");
  if (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
  return data || [];
};

export const savePatient = async (patient: any) => {
  if (patient.id) {
    // تحديث مريض موجود
    const { error } = await supabase
      .from("patients")
      .update(patient)
      .eq("id", patient.id);
    if (error) {
      console.error("Error updating patient:", error);
      return false;
    }
  } else {
    // إضافة مريض جديد
    const { error } = await supabase.from("patients").insert(patient);
    if (error) {
      console.error("Error inserting patient:", error);
      return false;
    }
  }
  return true;
};

export const deletePatient = async (id: string) => {
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) {
    console.error("Error deleting patient:", error);
    return false;
  }
  return true;
};

// وظائف التعامل مع الأطباء
export const getDoctors = async () => {
  const { data, error } = await supabase.from("doctors").select("*");
  if (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
  return data || [];
};

export const saveDoctor = async (doctor: any) => {
  if (doctor.id) {
    // تحديث طبيب موجود
    const { error } = await supabase
      .from("doctors")
      .update(doctor)
      .eq("id", doctor.id);
    if (error) {
      console.error("Error updating doctor:", error);
      return false;
    }
  } else {
    // إضافة طبيب جديد
    const { error } = await supabase.from("doctors").insert(doctor);
    if (error) {
      console.error("Error inserting doctor:", error);
      return false;
    }
  }
  return true;
};

export const deleteDoctor = async (id: string) => {
  const { error } = await supabase.from("doctors").delete().eq("id", id);
  if (error) {
    console.error("Error deleting doctor:", error);
    return false;
  }
  return true;
};

// وظائف التعامل مع التحاليل
export const getTests = async () => {
  const { data, error } = await supabase.from("tests").select("*");
  if (error) {
    console.error("Error fetching tests:", error);
    return [];
  }
  return data || [];
};

export const saveTest = async (test: any) => {
  if (test.id) {
    // تحديث تحليل موجود
    const { error } = await supabase
      .from("tests")
      .update(test)
      .eq("id", test.id);
    if (error) {
      console.error("Error updating test:", error);
      return false;
    }
  } else {
    // إضافة تحليل جديد
    const { error } = await supabase.from("tests").insert(test);
    if (error) {
      console.error("Error inserting test:", error);
      return false;
    }
  }
  return true;
};

export const deleteTest = async (id: string) => {
  const { error } = await supabase.from("tests").delete().eq("id", id);
  if (error) {
    console.error("Error deleting test:", error);
    return false;
  }
  return true;
};

// وظائف التعامل مع نتائج التحاليل
export const getTestResults = async () => {
  const { data, error } = await supabase.from("test_results").select("*");
  if (error) {
    console.error("Error fetching test results:", error);
    return [];
  }
  return data || [];
};

export const saveTestResult = async (result: any) => {
  if (result.id) {
    // تحديث نتيجة موجودة
    const { error } = await supabase
      .from("test_results")
      .update(result)
      .eq("id", result.id);
    if (error) {
      console.error("Error updating test result:", error);
      return false;
    }
  } else {
    // إضافة نتيجة جديدة
    const { error } = await supabase.from("test_results").insert(result);
    if (error) {
      console.error("Error inserting test result:", error);
      return false;
    }
  }
  return true;
};

// وظائف التعامل مع المستخدمين
export const getUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data || [];
};

export const saveUser = async (user: any) => {
  if (user.id) {
    // تحديث مستخدم موجود
    const { error } = await supabase
      .from("users")
      .update(user)
      .eq("id", user.id);
    if (error) {
      console.error("Error updating user:", error);
      return false;
    }
  } else {
    // إضافة مستخدم جديد
    const { error } = await supabase.from("users").insert(user);
    if (error) {
      console.error("Error inserting user:", error);
      return false;
    }
  }
  return true;
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) {
    console.error("Error deleting user:", error);
    return false;
  }
  return true;
};

// وظائف التعامل مع معلومات المعمل
export const getLabInfo = async () => {
  const { data, error } = await supabase.from("lab_info").select("*").single();
  if (error) {
    console.error("Error fetching lab info:", error);
    return null;
  }
  return data;
};

export const saveLabInfo = async (info: any) => {
  // تحقق من وجود معلومات المعمل
  const { data } = await supabase.from("lab_info").select("id");

  if (data && data.length > 0) {
    // تحديث معلومات موجودة
    const { error } = await supabase
      .from("lab_info")
      .update(info)
      .eq("id", data[0].id);
    if (error) {
      console.error("Error updating lab info:", error);
      return false;
    }
  } else {
    // إضافة معلومات جديدة
    const { error } = await supabase.from("lab_info").insert(info);
    if (error) {
      console.error("Error inserting lab info:", error);
      return false;
    }
  }
  return true;
};

// وظائف المصادقة
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error("Error signing in:", error);
    return { success: false, error: error.message };
  }
  return { success: true, user: data.user };
};

export const signUp = async (
  email: string,
  password: string,
  userData: any,
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  if (error) {
    console.error("Error signing up:", error);
    return { success: false, error: error.message };
  }
  return { success: true, user: data.user };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
    return false;
  }
  return true;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting current user:", error);
    return null;
  }
  return data.user;
};
