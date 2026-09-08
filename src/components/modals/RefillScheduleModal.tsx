import React, { useState } from 'react';
import { PrescriptionRecord } from '../../types';

interface RefillScheduleModalProps {
  prescription: PrescriptionRecord;
  onClose: () => void;
  onSave: (updated: PrescriptionRecord) => void;
  onTriggerTestPush: (rx: PrescriptionRecord) => void;
}

export const RefillScheduleModal: React.FC<RefillScheduleModalProps> = ({
  prescription,
  onClose,
  onSave,
  onTriggerTestPush,
}) => {
  const [tabletsRemaining, setTabletsRemaining] = useState<number>(prescription.tabletsRemaining);
  const [dailyDosageUnits, setDailyDosageUnits] = useState<number>(prescription.dailyDosageUnits || 1);
  const [frequencyPreset, setFrequencyPreset] = useState<string>(
    dailyDosageUnits === 1 ? '1_daily' : dailyDosageUnits === 2 ? '2_daily' : dailyDosageUnits === 3 ? '3_daily' : 'custom'
  );
  const [dosageLabel, setDosageLabel] = useState<string>(
    prescription.dosageFrequencyLabel || `${dailyDosageUnits} tablet daily`
  );
  const [leadDays, setLeadDays] = useState<number>(prescription.notificationLeadDays || 5);
  const [alertTime, setAlertTime] = useState<string>(prescription.preferredAlertTime || '09:00 AM');
  const [pushEnabled, setPushEnabled] = useState<boolean>(
    prescription.pushAlertEnabled !== undefined ? prescription.pushAlertEnabled : true
  );
  const [channel, setChannel] = useState<'push' | 'sms' | 'both'>('push');

  // Calculated days left
  const calculatedDaysLeft = Math.max(0, Math.floor(tabletsRemaining / (dailyDosageUnits || 1)));

  // Dates calculation relative to simulated today (Sep 7, 2026)
  const baseDate = new Date('2026-09-07T09:00:00Z');
  const runOutDate = new Date(baseDate.getTime() + calculatedDaysLeft * 86400000);
  
  // Alert triggers 'leadDays' before run-out date
  const alertTriggerDate = new Date(runOutDate.getTime() - leadDays * 86400000);
  const isAlertDueNow = calculatedDaysLeft <= leadDays;

  const handleFrequencySelect = (val: string) => {
    setFrequencyPreset(val);
    if (val === '1_daily') {
      setDailyDosageUnits(1);
      setDosageLabel('1 tablet once daily');
    } else if (val === '2_daily') {
      setDailyDosageUnits(2);
      setDosageLabel('1 tablet twice daily (2 total/day)');
    } else if (val === '3_daily') {
      setDailyDosageUnits(3);
      setDosageLabel('1 tablet 3 times daily (3 total/day)');
    } else if (val === 'every_other') {
      setDailyDosageUnits(0.5);
      setDosageLabel('1 tablet every other day');
    }
  };

  const handleSave = () => {
    const updated: PrescriptionRecord = {
      ...prescription,
      tabletsRemaining,
      dailyDosageUnits,
      dosageFrequencyLabel: dosageLabel,
      daysSupplyRemaining: calculatedDaysLeft,
      notificationLeadDays: leadDays,
      preferredAlertTime: alertTime,
      pushAlertEnabled: pushEnabled,
      urgency: calculatedDaysLeft <= 5 ? 'critical' : calculatedDaysLeft <= 14 ? 'moderate' : 'stable',
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">schedule_send</span>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Push Refill Alert Scheduler</h3>
              <p className="text-xs text-slate-500">
                {prescription.genericName} • {prescription.brandReference}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* 5-Day Alert Formula Callout */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-600 text-sm">notifications_active</span>
              <span>Automated 5-Day Run-Out Rule</span>
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              Rx Regimen
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Tablets Left</span>
              <span className="font-black text-slate-900 text-sm">{tabletsRemaining}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Daily Intake</span>
              <span className="font-black text-slate-900 text-sm">{dailyDosageUnits}/day</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Days Supply</span>
              <span className={`font-black text-sm ${calculatedDaysLeft <= 5 ? 'text-amber-600' : 'text-emerald-700'}`}>
                {calculatedDaysLeft} Days
              </span>
            </div>
          </div>
        </div>

        {/* Dosage Frequency Controls */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-900 flex items-center justify-between">
            <span>Dosage Schedule Frequency</span>
            <span className="text-[11px] font-normal text-slate-500">How often you take this medication</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: '1_daily', label: '1x Daily', desc: '1 tab/day' },
              { id: '2_daily', label: '2x Daily', desc: '2 tabs/day' },
              { id: '3_daily', label: '3x Daily', desc: '3 tabs/day' },
              { id: 'every_other', label: 'Alt Days', desc: '0.5 tab/day' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleFrequencySelect(opt.id)}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  frequencyPreset === opt.id
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black ring-1 ring-emerald-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-extrabold">{opt.label}</div>
                <div className="text-[10px] text-slate-500">{opt.desc}</div>
              </button>
            ))}
          </div>

          <div className="pt-1">
            <input
              type="text"
              value={dosageLabel}
              onChange={(e) => setDosageLabel(e.target.value)}
              placeholder="e.g. 1 tablet once daily in the evening"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-emerald-600"
            />
          </div>
        </div>

        {/* Tablet Inventory Adjuster */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-900 flex items-center justify-between">
            <span>Current Supply Count</span>
            <span className="text-[11px] font-mono text-slate-500">
              Runs out:{' '}
              <strong className="text-slate-800">
                {runOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </strong>
            </span>
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTabletsRemaining((prev) => Math.max(0, prev - 1))}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">remove</span>
            </button>

            <div className="flex-1 relative">
              <input
                type="number"
                min={0}
                max={180}
                value={tabletsRemaining}
                onChange={(e) => setTabletsRemaining(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full text-center font-mono font-black text-base py-1.5 px-3 border border-slate-200 rounded-xl"
              />
              <span className="absolute right-3 top-2 text-[10px] text-slate-400 uppercase font-bold">Tablets</span>
            </div>

            <button
              type="button"
              onClick={() => setTabletsRemaining((prev) => prev + 1)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
            </button>

            {/* Quick Presets */}
            <button
              type="button"
              onClick={() => setTabletsRemaining(5)}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-[11px] font-black cursor-pointer"
              title="Quickly set to 5 days remaining to test 5-day alert threshold"
            >
              Set 5 Left
            </button>
            <button
              type="button"
              onClick={() => setTabletsRemaining(30)}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold cursor-pointer"
            >
              Full (30)
            </button>
          </div>
        </div>

        {/* Scheduled Push Notification Details */}
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-lg">alarm_on</span>
              <span className="text-xs font-black text-slate-900">Scheduled Push Alert Threshold</span>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={pushEnabled}
                onChange={(e) => setPushEnabled(e.target.checked)}
                className="accent-emerald-600 w-4 h-4 rounded"
              />
              <span className="text-xs font-bold text-slate-700">Push Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">Lead Time</label>
              <select
                value={leadDays}
                onChange={(e) => setLeadDays(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-2 text-xs font-bold text-slate-800"
              >
                <option value={5}>5 Days Before (Recommended)</option>
                <option value={7}>7 Days Before</option>
                <option value={3}>3 Days Before</option>
                <option value={2}>2 Days Before</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">Preferred Time</label>
              <select
                value={alertTime}
                onChange={(e) => setAlertTime(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-2 text-xs font-bold text-slate-800"
              >
                <option value="08:00 AM">08:00 AM (Morning)</option>
                <option value="09:00 AM">09:00 AM (Recommended)</option>
                <option value="12:00 PM">12:00 PM (Noon)</option>
                <option value="06:00 PM">06:00 PM (Evening)</option>
                <option value="08:00 PM">08:00 PM (Bedtime)</option>
              </select>
            </div>
          </div>

          {/* Computed Alert Trigger Status */}
          <div className={`p-3 rounded-xl border text-xs ${
            isAlertDueNow
              ? 'bg-amber-100/70 border-amber-300 text-amber-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="material-symbols-outlined text-sm">
                {isAlertDueNow ? 'warning' : 'event_upcoming'}
              </span>
              <span>
                {isAlertDueNow
                  ? 'Push Alert Active: Medication is at or below 5-day supply threshold!'
                  : `Next Push Alert Scheduled: ${alertTriggerDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })} at ${alertTime}`}
              </span>
            </div>
            <p className="text-[11px] opacity-80 mt-0.5">
              {isAlertDueNow
                ? 'Push notification triggered today to ensure local pharmacy micro-hub dispatch before you run out.'
                : `Calculated from ${tabletsRemaining} tablets ÷ ${dailyDosageUnits}/day = ${calculatedDaysLeft} days remaining minus ${leadDays} days lead time.`}
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              const testRx: PrescriptionRecord = {
                ...prescription,
                tabletsRemaining,
                dailyDosageUnits,
                dosageFrequencyLabel: dosageLabel,
                daysSupplyRemaining: calculatedDaysLeft,
                notificationLeadDays: leadDays,
                preferredAlertTime: alertTime,
              };
              onTriggerTestPush(testRx);
            }}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">notifications_active</span>
            <span>Simulate 5-Day Push Now</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
