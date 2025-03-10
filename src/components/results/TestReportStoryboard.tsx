import TestReportViewer from "./TestReportViewer";

export default function TestReportStoryboard() {
  return (
    <TestReportViewer
      patientName="محمد أحمد"
      patientAge="35"
      patientGender="ذكر"
      reportDate={new Date().toLocaleDateString()}
      reportNumber="12345"
      doctorName="د. أحمد محمد"
    />
  );
}
