// وظائف مساعدة لتقارير المختبر

/**
 * التحقق مما إذا كانت القيمة خارج النطاق المرجعي
 * @param value القيمة المراد فحصها
 * @param referenceRange النطاق المرجعي
 * @returns true إذا كانت القيمة خارج النطاق، false إذا كانت ضمن النطاق
 */
export const isOutOfRange = (
  value: string,
  referenceRange: string,
): boolean => {
  if (!value || !referenceRange) return false;

  // تحويل القيمة إلى رقم
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return false;

  // استخراج الحد الأدنى والأعلى من النطاق المرجعي
  const rangeMatch = referenceRange.match(/([\d\.]+)\s*-\s*([\d\.]+)/);
  if (!rangeMatch) return false;

  const minValue = parseFloat(rangeMatch[1]);
  const maxValue = parseFloat(rangeMatch[2]);

  // التحقق مما إذا كانت القيمة خارج النطاق
  return numValue < minValue || numValue > maxValue;
};

/**
 * تنسيق التاريخ بصيغة DD/MM/YYYY
 * @param date التاريخ المراد تنسيقه
 * @returns التاريخ بالتنسيق المطلوب
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-GB"); // تنسيق DD/MM/YYYY
};

/**
 * إنشاء رقم تقرير فريد
 * @param patientId معرف المريض
 * @param patientCount عدد المرضى في نفس اليوم
 * @returns رقم التقرير بالتنسيق المطلوب
 */
export const generateReportNumber = (
  patientId: string,
  patientCount: number = 1,
): string => {
  const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "");
  return `result_${today}_${patientCount}`;
};
