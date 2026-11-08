
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  Globe, Palette, CreditCard, Wallet,
  Bell, Shield, UserRound, LockKeyhole,
  Save, RefreshCw, Eye, EyeOff,
  CheckCircle2, AlertCircle, LogOut,
} from "lucide-react";

import Colors from "../constants/colors";
import {
  getAdminSettings,
  updateAdminSettings,
  getAdminSettingsProfile,
  updateAdminSettingsProfile,
  changeAdminPassword,
} from "../api/adminSettings";
import { clearAuthTokens } from "../api/api";

const PRIMARY = Colors.primary || "#FF5722";

const NAVIGATION = [
  { id: "general", label: "General", icon: Globe },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "profile", label: "My Profile", icon: UserRound },
  { id: "password", label: "Change Password", icon: LockKeyhole },
];

const FIELD_GROUPS = {
  general: [
    { key: "platform_name", label: "Platform Name", type: "text" },
    { key: "support_email", label: "Support Email", type: "email" },
    { key: "website_url", label: "Website URL", type: "url" },
    {
      key: "timezone", label: "Timezone", type: "select",
      options: [
        ["Africa/Nairobi", "Africa/Nairobi"],
        ["UTC", "UTC"],
        ["Africa/Kampala", "Africa/Kampala"],
        ["Africa/Dar_es_Salaam", "Africa/Dar_es_Salaam"],
      ],
    },
    {
      key: "currency", label: "Default Currency", type: "select",
      options: [
        ["KES", "Kenyan Shilling (KES)"],
        ["USD", "US Dollar (USD)"],
        ["UGX", "Ugandan Shilling (UGX)"],
        ["TZS", "Tanzanian Shilling (TZS)"],
      ],
    },
    {
      key: "maintenance_mode",
      label: "Maintenance Mode",
      type: "boolean",
      description: "Configuration flag for planned platform downtime.",
    },
  ],
  branding: [
    { key: "logo_url", label: "Logo URL", type: "url" },
    { key: "favicon_url", label: "Favicon URL", type: "url" },
    { key: "primary_color", label: "Primary Color", type: "color" },
  ],
  subscriptions: [
    { key: "trial_days", label: "Trial Duration (Days)", type: "number", min: 0, max: 365 },
    { key: "grace_period_days", label: "Grace Period (Days)", type: "number", min: 0, max: 90 },
    { key: "expiry_reminder_days", label: "Expiry Reminder (Days)", type: "number", min: 0, max: 90 },
    { key: "allow_trials", label: "Allow Free Trials", type: "boolean" },
    {
      key: "auto_suspend_expired",
      label: "Auto-Suspend Expired Subscriptions",
      type: "boolean",
    },
  ],
  payments: [
    { key: "enable_mpesa", label: "Enable M-Pesa", type: "boolean" },
    { key: "enable_paystack", label: "Enable Paystack", type: "boolean" },
    { key: "enable_bank_transfer", label: "Enable Bank Transfers", type: "boolean" },
    { key: "mpesa_shortcode", label: "M-Pesa Shortcode", type: "text" },
    { key: "payment_notifications", label: "Payment Notifications", type: "boolean" },
  ],
  notifications: [
    { key: "enable_email", label: "Enable Email Notifications", type: "boolean" },
    { key: "enable_sms", label: "Enable SMS Notifications", type: "boolean" },
    { key: "enable_push", label: "Enable Push Notifications", type: "boolean" },
    { key: "notify_new_organization", label: "New Organization Alerts", type: "boolean" },
    { key: "notify_new_subscription", label: "New Subscription Alerts", type: "boolean" },
    { key: "notify_failed_payment", label: "Failed Payment Alerts", type: "boolean" },
    { key: "notify_maintenance_alerts", label: "Maintenance Alerts", type: "boolean" },
  ],
  security: [
    {
      key: "session_timeout_minutes",
      label: "Session Timeout (Minutes)",
      type: "number", min: 5, max: 1440,
    },
    {
      key: "max_login_attempts",
      label: "Maximum Login Attempts",
      type: "number", min: 3, max: 20,
    },
    {
      key: "require_strong_passwords",
      label: "Require Strong Passwords",
      type: "boolean",
    },
    {
      key: "require_admin_2fa",
      label: "Require Admin 2FA",
      type: "boolean",
    },
  ],
};

const DESCRIPTIONS = {
  general: "Manage the platform identity and general preferences.",
  branding: "Configure UNIT branding and visual appearance.",
  subscriptions: "Set subscription policy defaults and expiry rules.",
  payments: "Configure supported payment methods and identifiers.",
  notifications: "Control platform notification preferences.",
  security: "Configure security policy preferences.",
};

const getError = (error) => {
  const data = error.response?.data;

  if (data?.message) {
    if (data.errors) {
      return `${data.message} ${JSON.stringify(data.errors)}`;
    }
    return data.message;
  }

  if (data?.detail) return data.detail;

  if (data && typeof data === "object") {
    return Object.entries(data)
      .map(([key, value]) =>
        `${key}: ${Array.isArray(value) ? value.join(", ") : JSON.stringify(value)}`
      )
      .join(" · ");
  }

  return "Something went wrong. Please try again.";
};

function Notice({ notice, onClose }) {
  if (!notice) return null;

  const success = notice.type === "success";

  return (
    <div
      role="status"
      className={`flex items-start justify-between gap-3 rounded-xl p-4 text-sm ${
        success
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      <div className="flex items-start gap-2">
        {success
          ? <CheckCircle2 size={18} />
          : <AlertCircle size={18} />}
        <span>{notice.message}</span>
      </div>
      <button onClick={onClose} className="font-bold">
        ×
      </button>
    </div>
  );
}

function FormField({ field, value, onChange }) {
  if (field.type === "boolean") {
    return (
      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div>
          <p className="text-sm font-bold text-slate-800">
            {field.label}
          </p>
          {field.description && (
            <p className="mt-1 text-xs text-slate-500">
              {field.description}
            </p>
          )}
        </div>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 shrink-0 accent-orange-600"
        />
      </label>
    );
  }

  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {field.label}
      </span>

      {field.type === "select" ? (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
        >
          {field.options.map(([key, text]) => (
            <option key={key} value={key}>{text}</option>
          ))}
        </select>
      ) : field.type === "color" ? (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value || PRIMARY}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-16 cursor-pointer rounded-lg border border-slate-200"
          />
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#FF5722"
            maxLength={7}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>
      ) : (
        <input
          type={field.type}
          value={value ?? ""}
          min={field.min}
          max={field.max}
          onChange={(e) =>
            onChange(
              field.type === "number"
                ? e.target.value === ""
                  ? ""
                  : Number(e.target.value)
                : e.target.value
            )
          }
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
        />
      )}
    </label>
  );
}

function SectionSettings({
  section,
  values,
  onChange,
  onSave,
  saving,
  dirty,
}) {
  const fields = FIELD_GROUPS[section] || [];
  const regular = fields.filter((field) => field.type !== "boolean");
  const switches = fields.filter((field) => field.type === "boolean");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-black text-slate-900">
          {NAVIGATION.find((item) => item.id === section)?.label}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {DESCRIPTIONS[section]}
        </p>
      </div>

      {section === "payments" && (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          API secrets are managed on the backend. Enabling a
          payment method here does not configure its credentials.
        </p>
      )}

      {section === "security" && (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          These are saved security policy settings. JWT expiry,
          login throttling, and two-factor authentication require
          corresponding backend enforcement.
        </p>
      )}

      {regular.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2">
          {regular.map((field) => (
            <FormField
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={(value) =>
                onChange(field.key, value)
              }
            />
          ))}
        </div>
      )}

      {switches.length > 0 && (
        <div className="grid gap-3">
          {switches.map((field) => (
            <FormField
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={(value) =>
                onChange(field.key, value)
              }
            />
          ))}
        </div>
      )}

      {section === "branding" && values.logo_url && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <p className="mb-3 text-xs font-bold text-slate-500">
            Logo Preview
          </p>
          <img
            src={values.logo_url}
            alt="Platform logo preview"
            className="max-h-24 max-w-full object-contain"
          />
        </div>
      )}

      <div className="flex items-center justify-end border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={saving || !dirty}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
          style={{ backgroundColor: PRIMARY }}
        >
          {saving
            ? <RefreshCw size={17} className="animate-spin" />
            : <Save size={17} />}
          Save Changes
        </button>
      </div>
    </form>
  );
}

function ProfileSettings({ profile, setProfile, onSave, saving }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-black text-slate-900">
          Administrator Profile
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Update your personal account information.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {[
          ["first_name", "First Name"],
          ["last_name", "Last Name"],
          ["email", "Email Address"],
        ].map(([key, title]) => (
          <label key={key} className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              {title}
            </span>
            <input
              type={key === "email" ? "email" : "text"}
              required={key === "email"}
              value={profile[key] || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            />
          </label>
        ))}
      </div>

      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-xs text-slate-400">Username</p>
        <p className="mt-1 text-sm font-bold text-slate-800">
          {profile.username || "—"}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
          style={{ backgroundColor: PRIMARY }}
        >
          <Save size={17} />
          Save Profile
        </button>
      </div>
    </form>
  );
}

function PasswordSettings({ onSave, saving }) {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [visible, setVisible] = useState(false);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-xl font-black text-slate-900">
          Change Password
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Choose a strong password to protect your account.
        </p>
      </div>

      {[
        ["current_password", "Current Password"],
        ["new_password", "New Password"],
        ["confirm_password", "Confirm New Password"],
      ].map(([key, title]) => (
        <label key={key} className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            {title}
          </span>
          <div className="relative">
            <input
              type={visible ? "text" : "password"}
              required
              autoComplete={
                key === "current_password"
                  ? "current-password"
                  : "new-password"
              }
              value={form[key]}
              onChange={(e) => update(key, e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm"
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
      ))}

      <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        After changing your password, you will be redirected to sign in again.
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
          style={{ backgroundColor: PRIMARY }}
        >
          <LockKeyhole size={17} />
          Update Password
        </button>
      </div>
    </form>
  );
}

export default function Settings() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(null);
  const [original, setOriginal] = useState(null);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const load = async () => {
    setLoading(true);
    setNotice(null);

    try {
      const [settingsResponse, profileResponse] =
        await Promise.all([
          getAdminSettings(),
          getAdminSettingsProfile(),
        ]);

      setSettings(settingsResponse.settings);
      setOriginal(settingsResponse.settings);
      setProfile(profileResponse);
    } catch (error) {
      setNotice({
        type: "error",
        message: getError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateField = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const isDirty = (section) =>
    JSON.stringify(settings?.[section]) !==
    JSON.stringify(original?.[section]);

  const saveSection = async (section) => {
    setSaving(true);
    setNotice(null);

    try {
      const response = await updateAdminSettings({
        [section]: settings[section],
      });

      setSettings(response.settings);
      setOriginal(response.settings);

      setNotice({
        type: "success",
        message: `${section[0].toUpperCase() + section.slice(1)} settings saved successfully.`,
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: getError(error),
      });
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setNotice(null);

    try {
      const response = await updateAdminSettingsProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
      });

      setProfile(response.user);
      localStorage.setItem(
        "unit_admin_user",
        JSON.stringify(response.user)
      );

      setNotice({
        type: "success",
        message: "Administrator profile updated successfully.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: getError(error),
      });
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (payload) => {
    if (payload.new_password !== payload.confirm_password) {
      setNotice({
        type: "error",
        message: "New passwords do not match.",
      });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      await changeAdminPassword(payload);

      clearAuthTokens();
      localStorage.removeItem("unit_admin_user");

      navigate("/signin", {
        replace: true,
        state: {
          message: "Password changed. Please sign in again.",
        },
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: getError(error),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p
            className="text-sm font-bold"
            style={{ color: PRIMARY }}
          >
            UNIT ADMINISTRATION
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Platform Settings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage platform preferences, integrations,
            notifications and administrator security.
          </p>
        </div>

        <button
          onClick={load}
          disabled={loading || saving}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold disabled:opacity-50"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <Notice
        notice={notice}
        onClose={() => setNotice(null)}
      />

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-16 text-sm text-slate-500">
          <RefreshCw className="animate-spin" color={PRIMARY} />
          Loading settings...
        </div>
      ) : settings && profile ? (
        <div className="grid items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <nav
            aria-label="Settings sections"
            className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-3 shadow-sm lg:flex-col"
          >
            {NAVIGATION.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setNotice(null);
                }}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                  activeTab === id
                    ? "text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                style={
                  activeTab === id
                    ? { backgroundColor: PRIMARY }
                    : {}
                }
              >
                <Icon size={18} />
                {label}
                {FIELD_GROUPS[id] && isDirty(id) && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-amber-400" />
                )}
              </button>
            ))}
          </nav>

          <section className="min-w-0 rounded-[26px] border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            {FIELD_GROUPS[activeTab] && (
              <SectionSettings
                section={activeTab}
                values={settings[activeTab] || {}}
                onChange={(key, value) =>
                  updateField(activeTab, key, value)
                }
                onSave={() => saveSection(activeTab)}
                saving={saving}
                dirty={isDirty(activeTab)}
              />
            )}

            {activeTab === "profile" && (
              <ProfileSettings
                profile={profile}
                setProfile={setProfile}
                onSave={saveProfile}
                saving={saving}
              />
            )}

            {activeTab === "password" && (
              <PasswordSettings
                onSave={savePassword}
                saving={saving}
              />
            )}
          </section>
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
          Settings could not be loaded. Use Refresh to retry.
        </div>
      )}
    </div>
  );
}
