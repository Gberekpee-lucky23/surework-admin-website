"use client";

import { useState, useTransition, useEffect } from "react";
import { Settings, Save, Info, AlertTriangle } from "lucide-react";

interface Setting {
  id: number;
  key: string;
  value: string;
  description: string | null;
  updatedAt: Date;
}

interface SettingsFormProps {
  settings: Setting[];
}

const SETTING_LABELS: Record<string, { label: string; hint: string; suffix: string; isRate: boolean }> = {
  labor_commission_rate: {
    label: "Labour Commission Rate",
    hint: "Deducted from the handyman's labour earnings (both quote & fixed price jobs) — NOT charged to the customer. Example: 0.13 = 13%. Default: 13%.",
    suffix: "%",
    isRate: true,
  },
  materials_fee_recovery_rate: {
    label: "Customer Service Fee (Materials Recovery)",
    hint: "Added to the customer's total payment, calculated on (Labour + Materials). Example: 0.02 = 2%. Default: 2%. Changes apply to new quotes only.",
    suffix: "%",
    isRate: true,
  },
  max_quote_revisions: {
    label: "Max Quote Revisions",
    hint: "Number of times a handyman may revise a rejected quote before the job auto-cancels.",
    suffix: "revisions",
    isRate: false,
  },
  confirmation_window_hours: {
    label: "Customer Confirmation Window",
    hint: "Hours after handyman marks a job done before it auto-confirms if the customer takes no action.",
    suffix: "hours",
    isRate: false,
  },
};

async function saveSetting(key: string, value: string): Promise<void> {
  const res = await fetch(`/api/admin/settings/${key}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to save");
  }
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(settings.map((s) => [s.key, s.value])),
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [savedKeys, setSavedKeys] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    setErrors((e) => ({ ...e, [key]: "" }));
    try {
      await saveSetting(key, values[key]);
      setSavedKeys((prev) => [...prev, key]);
      setTimeout(() => setSavedKeys((prev) => prev.filter((k) => k !== key)), 3000);
    } catch (err: any) {
      setErrors((e) => ({ ...e, [key]: err.message }));
    } finally {
      setSaving(null);
    }
  };

  const displayValue = (key: string, value: string, isRate: boolean): string => {
    if (!isRate) return value;
    return String(parseFloat(value) * 100);
  };

  const storeValue = (key: string, displayVal: string, isRate: boolean): string => {
    if (!isRate) return displayVal;
    const n = parseFloat(displayVal);
    return isNaN(n) ? displayVal : String(n / 100);
  };

  return (
    <div className="space-y-6">
      {settings.map((setting) => {
        const meta = SETTING_LABELS[setting.key];
        if (!meta) return null;
        const displayVal = displayValue(setting.key, values[setting.key] ?? setting.value, meta.isRate);
        const isSaved = savedKeys.includes(setting.key);

        return (
          <div key={setting.key} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">{meta.label}</h3>
                <p className="text-sm text-slate-500 mt-1 flex items-start gap-1.5">
                  <Info size={13} className="mt-0.5 flex-shrink-0 text-blue-400" />
                  {meta.hint}
                </p>
              </div>
              {isSaved && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold flex-shrink-0">
                  Saved ✓
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="number"
                  min={0}
                  step={meta.isRate ? 0.1 : 1}
                  value={displayVal}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      [setting.key]: storeValue(setting.key, e.target.value, meta.isRate),
                    }))
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                  {meta.suffix}
                </span>
              </div>
              <button
                onClick={() => handleSave(setting.key)}
                disabled={saving === setting.key}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                <Save size={14} />
                {saving === setting.key ? "Saving..." : "Save"}
              </button>
            </div>

            {errors[setting.key] && (
              <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors[setting.key]}
              </p>
            )}

            <p className="mt-3 text-xs text-slate-400 font-mono">
              Current DB value: {setting.value} · Last updated: {mounted ? new Date(setting.updatedAt).toLocaleString("en-GB") : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}
