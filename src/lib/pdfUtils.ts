import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// دالة لتحويل عنصر HTML إلى ملف PDF
export const generatePDF = async (
  elementId: string,
  fileName: string = "report.pdf",
  options: { onlyActiveTab?: boolean } = {},
) => {
  // تأخير قصير للسماح بتحديث واجهة المستخدم
  await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    // الحصول على العنصر المراد تحويله
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID ${elementId} not found`);
      return false;
    }

    // إذا كان خيار onlyActiveTab مفعل، نبحث عن التبويب النشط فقط
    let targetElement = element;
    if (options.onlyActiveTab) {
      // البحث عن التبويب النشط داخل العنصر
      const activeTabContent = element.querySelector('[data-state="active"]');
      if (activeTabContent) {
        // البحث عن عنصر التقرير داخل التبويب النشط
        const reportElement = activeTabContent.querySelector(".report-card");
        if (reportElement) {
          // تحديد منطقة بيانات المريض والتقرير فقط
          const patientInfoSection = reportElement.querySelector(
            ".border-b.border-gray-200",
          );
          const reportContent = reportElement.querySelector(".card-content");

          if (patientInfoSection && reportContent) {
            // إنشاء عنصر جديد يحتوي فقط على بيانات المريض ومحتوى التقرير
            const tempDiv = document.createElement("div");
            tempDiv.className = "report-card";
            tempDiv.appendChild(patientInfoSection.cloneNode(true));
            tempDiv.appendChild(reportContent.cloneNode(true));
            targetElement = tempDiv;
          } else {
            targetElement = reportElement as HTMLElement;
          }
        }
      }
    }

    // تحويل العنصر إلى صورة
    const canvas = await html2canvas(targetElement, {
      scale: 2, // زيادة الدقة
      useCORS: true, // السماح بتحميل الصور من مصادر خارجية
      logging: false,
      backgroundColor: "#ffffff",
      // تجاهل العناصر التي لا نريد تضمينها في PDF
      ignoreElements: (element) => {
        // تجاهل أزرار التنقل والقوائم الجانبية والعناصر غير المطلوبة
        return (
          element.classList.contains("tabs-list") ||
          element.classList.contains("button") ||
          element.tagName === "BUTTON" ||
          (element.parentElement && element.parentElement.tagName === "BUTTON")
        );
      },
      onclone: (document, clone) => {
        try {
          // إزالة العناصر غير المطلوبة من النسخة المستنسخة
          const inputs = clone.querySelectorAll("input");
          inputs.forEach((input) => {
            const parent = input.parentElement;
            if (parent) {
              const span = document.createElement("span");
              span.textContent = input.value || "";
              parent.replaceChild(span, input);
            }
          });

          // إزالة الأزرار والعناصر غير المطلوبة
          const buttons = clone.querySelectorAll("button");
          buttons.forEach((button) => {
            if (button.parentElement) {
              button.parentElement.removeChild(button);
            }
          });

          // إزالة القوائم الجانبية
          const sidebars = clone.querySelectorAll(
            ".sidebar, nav, header, footer",
          );
          sidebars.forEach((sidebar) => {
            if (sidebar.parentElement) {
              sidebar.parentElement.removeChild(sidebar);
            }
          });
        } catch (error) {
          console.error("Error in onclone:", error);
        }
      },
    });

    // إنشاء ملف PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // الحصول على أبعاد الصفحة
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // الحصول على أبعاد الصورة
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // حساب نسبة التصغير للملاءمة في الصفحة
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    const imgX = (pageWidth - imgWidth * ratio) / 2;
    const imgY = 10; // هامش علوي

    // إضافة الصورة إلى ملف PDF
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio,
    );

    // حفظ الملف
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};

// دالة لتنزيل تقرير التحليل كملف PDF
export const downloadTestReport = async (
  reportType: string,
  patientName: string,
) => {
  const elementId = "test-report-content";
  const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "");
  const fileName = `${reportType}_${patientName.replace(/ /g, "_")}_${today}.pdf`;

  // تمرير خيار onlyActiveTab لتحديد منطقة نتيجة التحليل فقط
  const success = await generatePDF(elementId, fileName, {
    onlyActiveTab: true,
  });
  return success;
};
