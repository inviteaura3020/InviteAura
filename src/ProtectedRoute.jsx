
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        console.error("Session error:", error.message);
      }

      setSession(data?.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="auth-loading">Checking authentication...</div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
