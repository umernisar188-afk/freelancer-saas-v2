"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setLoading(false);
    }

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>

          <p className="text-white text-lg font-semibold">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}