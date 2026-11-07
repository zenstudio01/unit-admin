
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { getAccessToken } from "../api/api";
import {
  getAdminProfile,
  signoutAdmin,
} from "../api/adminAuth";

export default function ProtectedAdminRoute() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    const verifyAdmin = async () => {
      if (!getAccessToken()) {
        if (mounted) setStatus("unauthorized");
        return;
      }

      try {
        const user = await getAdminProfile();

        if (mounted) {
          setStatus(
            user.is_staff || user.is_superuser
              ? "authorized"
              : "unauthorized"
          );
        }
      } catch {
        signoutAdmin();
        if (mounted) setStatus("unauthorized");
      }
    };

    verifyAdmin();

    const onExpired = () => {
      signoutAdmin();
      if (mounted) setStatus("unauthorized");
    };

    window.addEventListener(
      "unit-admin-session-expired",
      onExpired
    );

    return () => {
      mounted = false;
      window.removeEventListener(
        "unit-admin-session-expired",
        onExpired
      );
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2
          size={30}
          className="animate-spin text-orange-500"
        />
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
