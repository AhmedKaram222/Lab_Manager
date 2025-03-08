import { useEffect, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, signOut } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // محاولة الحصول على بيانات المستخدم من Supabase
        const user = await getCurrentUser();
        if (user) {
          setEmail(user.email || "");
          // استخدام البيانات المخصصة للمستخدم إذا كانت متوفرة
          setUsername(
            user.user_metadata?.username || user.email?.split("@")[0] || "",
          );
        } else {
          // استخدام البيانات المخزنة محليًا كاحتياطي
          const storedUsername = localStorage.getItem("username");
          const storedEmail = localStorage.getItem("userEmail");
          if (storedUsername) setUsername(storedUsername);
          if (storedEmail) setEmail(storedEmail);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // استخدام البيانات المخزنة محليًا في حالة حدوث خطأ
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      // مسح بيانات المستخدم من التخزين المحلي
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("userEmail");
      // توجيه المستخدم إلى صفحة تسجيل الدخول
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="border-b border-border bg-card p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            نظام إدارة معمل التحاليل الطبية
          </h2>
          {username && (
            <p className="text-sm text-muted-foreground mt-1">
              أهلا بك {username} في برنامج إدارة التحاليل الطبية
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {username || "مدير النظام"}
            </span>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {username ? username.charAt(0) : "م"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
