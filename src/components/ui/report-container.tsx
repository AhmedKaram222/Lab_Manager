import React from "react";

interface ReportContainerProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

// مكون خاص لاحتواء تقارير التحاليل للطباعة
const ReportContainer = ({
  children,
  id = "report-content",
  className = "",
}: ReportContainerProps) => {
  return (
    <div
      id={id}
      className={`report-container bg-white p-4 rounded-md ${className}`}
      style={{ maxWidth: "210mm", margin: "0 auto" }}
    >
      {children}
    </div>
  );
};

export default ReportContainer;
