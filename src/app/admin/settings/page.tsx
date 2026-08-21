import { getAllSettings } from "@/dal/settings";
import { SettingsForm } from "./SettingsForm";
import { Settings } from "lucide-react";

export const metadata = { title: "Settings — Surework Admin" };

export default async function SettingsPage() {
  const settings = await getAllSettings();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2.5 rounded-xl">
          <Settings size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Commission rates and operational parameters — changes apply to <strong>new quotes only</strong>.
            Historical quote data is never modified retroactively.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="bg-amber-500 text-white rounded-lg p-1.5 flex-shrink-0 mt-0.5">
          <Settings size={14} />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-900">Important</p>
          <p className="text-sm text-amber-800 mt-0.5">
            Commission rate changes take effect immediately for all new quotes submitted after saving.
            Past approved quotes retain their original snapshotted rates and are never changed.
          </p>
        </div>
      </div>

      <SettingsForm settings={settings as any} />
    </div>
  );
}
