import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "@/lib/supabase";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // التحقق من وجود مستخدم مسجل الدخول
        const user = await getCurrentUser();
        const isLoggedIn =
          user !== null || localStorage.getItem("isLoggedIn") === "true";

        if (
          !isLoggedIn &&
          location.pathname !== "/login" &&
          location.pathname !== "/auth"
        ) {
          navigate("/auth", { replace: true });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/auth", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
