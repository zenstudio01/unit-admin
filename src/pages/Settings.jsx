import {
  Bell,
  Building2,
  CreditCard,
  Globe2,
  LockKeyhole,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  Smartphone,
  Undo2,
  Wrench,
} from "lucide-react";

import {
  useState,
} from "react";

import Colors from "../constants/colors";

export default function Settings() {
  const [
    settings,
    setSettings,
  ] = useState({
    platform_name:
      "UNIT",

    support_email:
      "support@unit.co.ke",

    support_phone:
      "+254 700 000 000",

    default_currency:
      "KES",

    timezone:
      "Africa/Nairobi",

    trial_days:
      30,

    allow_new_organizations:
      true,

    require_email_verification:
      true,

    enable_kaskazi:
      true,

    auto_publish_kaskazi:
      false,

    maintenance_notifications:
      true,

    subscription_notifications:
      true,

    organization_notifications:
      true,

    push_notifications:
      true,

    email_notifications:
      true,

    maintenance_auto_close_days:
      7,

    session_timeout_minutes:
      60,

    require_admin_2fa:
      false,

    maintenance_file_limit:
      10,

    max_upload_size_mb:
      10,
  });

  const [
    savedSettings,
    setSavedSettings,
  ] = useState(
    settings
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    saved,
    setSaved,
  ] = useState(false);

  /*
   * =====================================================
   * UPDATE FIELD
   * =====================================================
   */

  const updateSetting = (
    field,
    value
  ) => {
    setSaved(false);

    setSettings(
      (
        current
      ) => ({
        ...current,

        [field]:
          value,
      })
    );
  };

  /*
   * =====================================================
   * SAVE
   * =====================================================
   */

  const handleSave =
    async () => {
      try {
        setSaving(
          true
        );

        /*
         * Replace this later with:
         *
         * await api.put(
         *   "/admin/settings/",
         *   settings
         * );
         */

        await new Promise(
          (
            resolve
          ) =>
            setTimeout(
              resolve,
              700
            )
        );

        setSavedSettings(
          settings
        );

        setSaved(
          true
        );

      } catch (error) {
        console.log(
          "SAVE SETTINGS ERROR:",
          error
        );

      } finally {
        setSaving(
          false
        );
      }
    };

  /*
   * =====================================================
   * RESET
   * =====================================================
   */

  const handleReset = () => {
    setSettings(
      savedSettings
    );

    setSaved(false);
  };

  const hasChanges =
    JSON.stringify(
      settings
    ) !==
    JSON.stringify(
      savedSettings
    );

  return (
    <div>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p
            className="text-sm font-bold"
            style={{
              color:
                Colors.primary,
            }}
          >
            Platform Configuration
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Configure core UNIT
            platform preferences,
            subscriptions, maintenance,
            notifications and security.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={
              !hasChanges ||
              saving
            }
            onClick={
              handleReset
            }
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Undo2
              size={17}
            />

            Reset
          </button>

          <button
            type="button"
            disabled={
              !hasChanges ||
              saving
            }
            onClick={
              handleSave
            }
            className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor:
                Colors.primary,
            }}
          >
            <Save
              size={17}
            />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>

      {/* =================================================
          SAVE MESSAGE
      ================================================= */}

      {saved && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
          <ShieldCheck
            size={20}
            className="text-emerald-600"
          />

          <div>
            <p className="text-sm font-bold text-emerald-700">
              Settings saved
            </p>

            <p className="mt-0.5 text-xs text-emerald-600">
              Your platform
              configuration has been
              updated.
            </p>
          </div>
        </div>
      )}

      {/* =================================================
          GENERAL
      ================================================= */}

      <SettingsSection
        icon={
          SettingsIcon
        }
        title="General Settings"
        description="Basic UNIT platform configuration."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <InputField
            label="Platform Name"
            value={
              settings.platform_name
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "platform_name",
                value
              )
            }
            placeholder="UNIT"
          />

          <SelectField
            label="Default Currency"
            value={
              settings.default_currency
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "default_currency",
                value
              )
            }
            options={[
              {
                value:
                  "KES",
                label:
                  "KES - Kenyan Shilling",
              },
              {
                value:
                  "USD",
                label:
                  "USD - US Dollar",
              },
              {
                value:
                  "UGX",
                label:
                  "UGX - Ugandan Shilling",
              },
              {
                value:
                  "TZS",
                label:
                  "TZS - Tanzanian Shilling",
              },
            ]}
          />

          <InputField
            label="Support Email"
            value={
              settings.support_email
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "support_email",
                value
              )
            }
            placeholder="support@unit.co.ke"
            type="email"
          />

          <InputField
            label="Support Phone"
            value={
              settings.support_phone
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "support_phone",
                value
              )
            }
            placeholder="+254..."
          />

          <SelectField
            label="Timezone"
            value={
              settings.timezone
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "timezone",
                value
              )
            }
            options={[
              {
                value:
                  "Africa/Nairobi",
                label:
                  "Africa/Nairobi",
              },
              {
                value:
                  "UTC",
                label:
                  "UTC",
              },
            ]}
          />
        </div>
      </SettingsSection>

      {/* =================================================
          ORGANIZATIONS
      ================================================= */}

      <SettingsSection
        icon={
          Building2
        }
        title="Organization Settings"
        description="Control how new organizations join and use UNIT."
      >
        <div className="space-y-4">
          <ToggleRow
            title="Allow New Organizations"
            description="Allow new property management organizations to register on UNIT."
            checked={
              settings
                .allow_new_organizations
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "allow_new_organizations",
                value
              )
            }
          />

          <ToggleRow
            title="Require Email Verification"
            description="Require new users to verify their email address before using their account."
            checked={
              settings
                .require_email_verification
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "require_email_verification",
                value
              )
            }
          />
        </div>
      </SettingsSection>

      {/* =================================================
          SUBSCRIPTIONS
      ================================================= */}

      <SettingsSection
        icon={
          CreditCard
        }
        title="Subscription Settings"
        description="Configure trial and subscription defaults."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <NumberField
            label="Free Trial Duration"
            value={
              settings.trial_days
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "trial_days",
                value
              )
            }
            suffix="days"
            min={0}
          />

          <div className="rounded-2xl bg-orange-50 p-5">
            <p
              className="text-sm font-bold"
              style={{
                color:
                  Colors.primary,
              }}
            >
              Trial Configuration
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              New organizations will
              receive{" "}
              <strong>
                {
                  settings.trial_days
                }{" "}
                days
              </strong>{" "}
              of free access before
              requiring a subscription.
            </p>
          </div>
        </div>
      </SettingsSection>

      {/* =================================================
          MAINTENANCE
      ================================================= */}

      <SettingsSection
        icon={
          Wrench
        }
        title="Maintenance Settings"
        description="Configure maintenance workflow and Kaskazi integration."
      >
        <div className="space-y-4">
          <ToggleRow
            title="Enable Kaskazi Integration"
            description="Allow UNIT property managers to send maintenance jobs to Kaskazi."
            checked={
              settings
                .enable_kaskazi
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "enable_kaskazi",
                value
              )
            }
          />

          <ToggleRow
            title="Automatically Publish to Kaskazi"
            description="Automatically publish eligible maintenance requests to Kaskazi without manual manager approval."
            checked={
              settings
                .auto_publish_kaskazi
            }
            disabled={
              !settings
                .enable_kaskazi
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "auto_publish_kaskazi",
                value
              )
            }
          />

          <div className="grid gap-5 pt-3 lg:grid-cols-3">
            <NumberField
              label="Auto Close Completed Jobs"
              value={
                settings
                  .maintenance_auto_close_days
              }
              onChange={(
                value
              ) =>
                updateSetting(
                  "maintenance_auto_close_days",
                  value
                )
              }
              suffix="days"
              min={0}
            />

            <NumberField
              label="Maximum Files per Request"
              value={
                settings
                  .maintenance_file_limit
              }
              onChange={(
                value
              ) =>
                updateSetting(
                  "maintenance_file_limit",
                  value
                )
              }
              suffix="files"
              min={1}
            />

            <NumberField
              label="Maximum Upload Size"
              value={
                settings
                  .max_upload_size_mb
              }
              onChange={(
                value
              ) =>
                updateSetting(
                  "max_upload_size_mb",
                  value
                )
              }
              suffix="MB"
              min={1}
            />
          </div>
        </div>
      </SettingsSection>

      {/* =================================================
          NOTIFICATIONS
      ================================================= */}

      <SettingsSection
        icon={
          Bell
        }
        title="Notifications"
        description="Choose the types of platform notifications that UNIT sends."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <ToggleRow
            title="Maintenance Notifications"
            description="Notify users about maintenance updates and status changes."
            checked={
              settings
                .maintenance_notifications
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "maintenance_notifications",
                value
              )
            }
          />

          <ToggleRow
            title="Subscription Notifications"
            description="Send alerts for trial expiry, payments and subscription renewals."
            checked={
              settings
                .subscription_notifications
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "subscription_notifications",
                value
              )
            }
          />

          <ToggleRow
            title="Organization Notifications"
            description="Notify admins about new organizations and important account changes."
            checked={
              settings
                .organization_notifications
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "organization_notifications",
                value
              )
            }
          />

          <ToggleRow
            title="Push Notifications"
            description="Enable mobile push notifications through UNIT applications."
            checked={
              settings
                .push_notifications
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "push_notifications",
                value
              )
            }
          />

          <ToggleRow
            title="Email Notifications"
            description="Allow UNIT to send transactional and operational emails."
            checked={
              settings
                .email_notifications
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "email_notifications",
                value
              )
            }
          />
        </div>
      </SettingsSection>

      {/* =================================================
          SECURITY
      ================================================= */}

      <SettingsSection
        icon={
          LockKeyhole
        }
        title="Security"
        description="Configure admin security and authentication behaviour."
      >
        <div className="space-y-5">
          <ToggleRow
            title="Require Admin Two-Factor Authentication"
            description="Require administrators to complete an additional authentication step when signing in."
            checked={
              settings
                .require_admin_2fa
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "require_admin_2fa",
                value
              )
            }
          />

          <NumberField
            label="Admin Session Timeout"
            value={
              settings
                .session_timeout_minutes
            }
            onChange={(
              value
            ) =>
              updateSetting(
                "session_timeout_minutes",
                value
              )
            }
            suffix="minutes"
            min={5}
          />
        </div>
      </SettingsSection>

      {/* =================================================
          INTEGRATIONS
      ================================================= */}

      <SettingsSection
        icon={
          Globe2
        }
        title="Integrations"
        description="External systems currently connected or planned for UNIT."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <IntegrationCard
            icon={
              Wrench
            }
            name="Kaskazi"
            description="Maintenance worker marketplace"
            status={
              settings
                .enable_kaskazi
                ? "Connected"
                : "Disabled"
            }
            connected={
              settings
                .enable_kaskazi
            }
          />

          <IntegrationCard
            icon={
              CreditCard
            }
            name="Paystack"
            description="Subscription payments"
            status="Connected"
            connected
          />

          <IntegrationCard
            icon={
              Smartphone
            }
            name="Expo"
            description="Mobile push notifications"
            status={
              settings
                .push_notifications
                ? "Enabled"
                : "Disabled"
            }
            connected={
              settings
                .push_notifications
            }
          />
        </div>
      </SettingsSection>

      {/* =================================================
          BOTTOM SAVE BAR
      ================================================= */}

      <div className="mt-8 flex flex-col gap-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-slate-800">
            Platform Settings
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {hasChanges
              ? "You have unsaved changes."
              : "All changes are saved."}
          </p>
        </div>

        <button
          type="button"
          disabled={
            !hasChanges ||
            saving
          }
          onClick={
            handleSave
          }
          className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor:
              Colors.primary,
          }}
        >
          <Save
            size={17}
          />

          {saving
            ? "Saving..."
            : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

/*
 * =====================================================
 * SETTINGS SECTION
 * =====================================================
 */

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="mt-8 rounded-[30px] border border-slate-100 bg-white shadow-sm">
      <div className="flex items-start gap-4 border-b border-slate-100 p-6">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{
            backgroundColor:
              `${Colors.primary}12`,
          }}
        >
          <Icon
            size={22}
            color={
              Colors.primary
            }
          />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

/*
 * =====================================================
 * INPUT
 * =====================================================
 */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type={
          type
        }
        value={
          value
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-200 focus:bg-white"
      />
    </div>
  );
}

/*
 * =====================================================
 * SELECT
 * =====================================================
 */

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <select
        value={
          value
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 outline-none transition focus:border-orange-200 focus:bg-white"
      >
        {options.map(
          (
            option
          ) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {
                option.label
              }
            </option>
          )
        )}
      </select>
    </div>
  );
}

/*
 * =====================================================
 * NUMBER
 * =====================================================
 */

function NumberField({
  label,
  value,
  onChange,
  suffix,
  min = 0,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <div className="flex h-12 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-orange-200 focus-within:bg-white">
        <input
          type="number"
          min={
            min
          }
          value={
            value
          }
          onChange={(
            event
          ) =>
            onChange(
              Number(
                event.target.value
              )
            )
          }
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-slate-700 outline-none"
        />

        {suffix && (
          <div className="flex items-center border-l border-slate-200 px-4 text-xs font-bold text-slate-400">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}

/*
 * =====================================================
 * TOGGLE
 * =====================================================
 */

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <div
      className={`
        flex items-center
        justify-between gap-5
        rounded-2xl
        border border-slate-100
        p-5
        ${
          disabled
            ? "bg-slate-50 opacity-60"
            : "bg-white"
        }
      `}
    >
      <div className="max-w-2xl">
        <p className="text-sm font-bold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        disabled={
          disabled
        }
        onClick={() =>
          onChange(
            !checked
          )
        }
        className={`
          relative
          h-7 w-12
          shrink-0
          rounded-full
          transition
          ${
            disabled
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }
        `}
        style={{
          backgroundColor:
            checked
              ? Colors.primary
              : "#CBD5E1",
        }}
      >
        <span
          className={`
            absolute
            top-1
            h-5 w-5
            rounded-full
            bg-white
            shadow-sm
            transition-all
            ${
              checked
                ? "left-6"
                : "left-1"
            }
          `}
        />
      </button>
    </div>
  );
}

/*
 * =====================================================
 * INTEGRATION CARD
 * =====================================================
 */

function IntegrationCard({
  icon: Icon,
  name,
  description,
  status,
  connected,
}) {
  return (
    <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
      <div className="flex items-center justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white"
        >
          <Icon
            size={20}
            color={
              Colors.primary
            }
          />
        </div>

        <span
          className={`
            rounded-full
            px-3 py-1.5
            text-[10px]
            font-black
            ${
              connected
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-200 text-slate-500"
            }
          `}
        >
          {status}
        </span>
      </div>

      <h3 className="mt-4 font-black text-slate-800">
        {name}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}