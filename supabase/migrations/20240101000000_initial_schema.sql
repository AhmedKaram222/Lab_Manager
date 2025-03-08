-- إنشاء جدول المرضى
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  file_code TEXT NOT NULL,
  doctor_id UUID REFERENCES doctors(id),
  notes TEXT
);

-- إنشاء جدول الأطباء
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  phone TEXT
);

-- إنشاء جدول التحاليل
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT
);

-- إنشاء جدول نتائج التحاليل
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  test_id UUID NOT NULL REFERENCES tests(id),
  doctor_id UUID REFERENCES doctors(id),
  result_data JSONB NOT NULL,
  status TEXT NOT NULL,
  notes TEXT
);

-- إنشاء جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  permissions JSONB,
  auth_id UUID REFERENCES auth.users(id)
);

-- إنشاء جدول معلومات المعمل
CREATE TABLE IF NOT EXISTS lab_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lab_name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  logo TEXT,
  notes TEXT
);

-- إنشاء السياسات الأمنية (RLS)
-- سياسة المرضى
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "المرضى متاحون للمستخدمين المصرح لهم" ON patients
  FOR ALL USING (auth.role() = 'authenticated');

-- سياسة الأطباء
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "الأطباء متاحون للمستخدمين المصرح لهم" ON doctors
  FOR ALL USING (auth.role() = 'authenticated');

-- سياسة التحاليل
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "التحاليل متاحة للمستخدمين المصرح لهم" ON tests
  FOR ALL USING (auth.role() = 'authenticated');

-- سياسة نتائج التحاليل
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "نتائج التحاليل متاحة للمستخدمين المصرح لهم" ON test_results
  FOR ALL USING (auth.role() = 'authenticated');

-- سياسة المستخدمين
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "المستخدمون متاحون للمستخدمين المصرح لهم" ON users
  FOR ALL USING (auth.role() = 'authenticated');

-- سياسة معلومات المعمل
ALTER TABLE lab_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "معلومات المعمل متاحة للمستخدمين المصرح لهم" ON lab_info
  FOR ALL USING (auth.role() = 'authenticated');
