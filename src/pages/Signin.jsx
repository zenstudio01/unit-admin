
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  HardHat,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { signinAdmin } from "../api/adminAuth";
import Colors from "../constants/colors";

const PRIMARY = Colors.primary || "#FF5722";

export default function Signin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const username = form.username.trim();
    const password = form.password;

    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signinAdmin({
        username,
        password,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const data = err.response?.data;

      let message =
        data?.message ||
        data?.detail ||
        err.message ||
        "Unable to sign in. Please try again.";

      if (!err.response && err.code === "ERR_NETWORK") {
        message =
          "Unable to connect to UNIT servers. Check your internet connection.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* LEFT BRAND PANEL */}
      <div
        className="relative hidden min-h-screen w-[48%] flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-14"
        style={{
          background: `linear-gradient(145deg, #C7380B 0%, ${PRIMARY} 55%, #FF875B 100%)`,
        }}
      >
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full border-[75px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-40 -left-36 h-[480px] w-[480px] rounded-full border-[80px] border-white/10" />
        <div className="pointer-events-none absolute right-16 top-1/3 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
            <Building2 size={28} color={PRIMARY} strokeWidth={2.5} />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight">
              UNIT
            </h1>
            <p className="text-xs font-semibold tracking-[0.18em] text-white/80">
              ADMINISTRATION
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 backdrop-blur-md">
            <ShieldCheck size={17} />
            <span className="text-xs font-bold tracking-wide">
              SECURE ADMIN PORTAL
            </span>
          </div>

          <h2 className="text-4xl font-black leading-[1.15] tracking-tight xl:text-5xl">
            One platform.
            <br />
            Complete control.
          </h2>

          <p className="mt-6 max-w-md text-base leading-8 text-white/85">
            Manage UNIT organizations, properties,
            construction projects, subscriptions, users,
            and platform operations from one powerful
            administration dashboard.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-5">
            {[
              {
                icon: Building2,
                title: "Property Management",
                description: "Oversee properties, units and organizations.",
              },
              {
                icon: HardHat,
                title: "Construction Projects",
                description: "Monitor projects, workforce and procurement.",
              },
              {
                icon: ShieldCheck,
                title: "Platform Administration",
                description: "Manage users, subscriptions and security.",
              },
            ].map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                    <Icon size={21} />
                  </div>

                  <div>
                    <p className="font-bold">
                      {feature.title}
                    </p>
                    <p className="mt-1 text-sm text-white/75">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-6">
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} UNIT.
            All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs font-medium text-white/80">
            <LockKeyhole size={13} />
            Authorized personnel only
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between px-6 py-6 lg:hidden">
          <div className="flex items-center gap-2">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: PRIMARY }}
            >
              <Building2 size={23} color="#FFFFFF" />
            </div>

            <div>
              <p className="text-xl font-black text-slate-900">
                UNIT
              </p>
              <p className="text-[10px] font-bold tracking-wider text-slate-400">
                ADMIN PORTAL
              </p>
            </div>
          </div>

          <ShieldCheck size={21} color={PRIMARY} />
        </div>

        {/* Login form */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
          <div className="w-full max-w-[440px]">
            {/* Heading */}
            <div className="mb-9">
              <div
                className="mb-6 hidden h-14 w-14 items-center justify-center rounded-2xl lg:flex"
                style={{
                  backgroundColor: `${PRIMARY}12`,
                }}
              >
                <LockKeyhole size={25} color={PRIMARY} />
              </div>

              <p
                className="text-sm font-bold"
                style={{ color: PRIMARY }}
              >
                WELCOME BACK
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Sign in to UNIT
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Enter your administrator credentials to
                access the UNIT management dashboard.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
              >
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <p className="text-sm leading-6 text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Username
                </label>

                <div className="relative">
                  <UserRound
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    autoComplete="username"
                    disabled={loading}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-bold text-slate-700"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-orange-500"
                  />

                  <span className="text-sm text-slate-600">
                    Remember me
                  </span>
                </label>

                <span className="text-xs font-medium text-slate-400">
                  Secure login
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                style={{ backgroundColor: PRIMARY }}
              >
                {loading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            {/* Security notice */}
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <ShieldCheck
                size={20}
                color={PRIMARY}
                className="mt-0.5 shrink-0"
              />

              <p className="text-xs leading-6 text-slate-500">
                This portal is restricted to authorized UNIT
                administrators. All administrative actions
                should be performed using your assigned account.
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                Need administrator access? Contact your
                UNIT system administrator.
              </p>
            </div>
          </div>
        </div>

        {/* Right footer */}
        <div className="border-t border-slate-100 px-6 py-5 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} UNIT Property & Project Manager
          </p>
        </div>
      </div>
    </div>
  );
}
