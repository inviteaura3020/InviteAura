
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check existing login session
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        navigate("/admin/dashboard", { replace: true });
      }
    });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // Admin login
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        throw error;
      }

      if (data.session) {
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (error) {
      setError(
        error.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-login-card">
        <div className="admin-logo">IA</div>

        <p className="admin-label">
          INVITEAURA MANAGEMENT
        </p>

        <h1>Welcome Back</h1>

        <p className="admin-description">
          Sign in to manage your wedding invitation clients.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            <Mail size={15} />
            Admin Email

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </label>

          <label>
            <LockKeyhole size={15} />
            Password

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </label>

          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-button"
            disabled={loading}
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <div className="admin-security">
          <ShieldCheck size={17} />
          Private Admin Area
        </div>

        <p className="admin-footer">
          InviteAura © 2026
        </p>
      </div>
    </main>
  );
}

export default AdminLogin;
