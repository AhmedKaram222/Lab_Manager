import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const PatientRegistrationButton = () => {
  return (
    <Link to="/patient-registration">
      <Button className="w-full">
        <UserPlus className="h-4 w-4 ml-2" />
        شاشة تسجيل البيانات
      </Button>
    </Link>
  );
};

export default PatientRegistrationButton;
