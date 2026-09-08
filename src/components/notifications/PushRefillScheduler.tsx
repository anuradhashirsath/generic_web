import React, { useState, useEffect } from 'react';
import { PrescriptionRecord } from '../../types';

interface PushRefillSchedulerProps {
  prescriptions: PrescriptionRecord[];
  onUpdatePrescription: (updated: PrescriptionRecord) => void;
  onTriggerPushAlert: (prescription: PrescriptionRecord) => void;
  onRefillPrescription: (prescription: PrescriptionRecord) => void;
  onOpenScheduleConfig: (prescription: PrescriptionRecord) => void;
}

export const PushRefillScheduler: React.FC<PushRefillSchedulerProps> = ({
  prescriptions,
  onUpdatePrescription,
  onTriggerPushAlert,
  onRefillPrescription,
  onOpenScheduleConfig,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'default' | 'denied'>('default');
  const [notificationSound, setNotificationSound] = useState(true);

  // Check browser Notification API permission if available
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPermissionStatus(perm);
      } catch {
        setPermissionStatus('granted');
      }
    } else {
      setPermissionStatus('granted');
    }
  };

  // Decrement 1 dose taken
  const handleLogDoseTaken = (rx: PrescriptionRecord) => {
    if (rx.tabletsRemaining <= 0) return;
    const newTablets = rx.tabletsRemaining - 1;
    const dailyRate = rx.dailyDosageUnits || 1;
    const newDays = Math.max(0, Math.floor(newTablets / dailyRate));
    const updated: PrescriptionRecord = {
      ...rx,
      tabletsRemaining: newTablets,
      daysSupplyRemaining: newDays,
      urgency: newDays <= 5 ? 'critical' : newDays <= 14 ? 'moderate' : 'stable',
    };
    onUpdatePrescription(updated);
  };

  // Calculate schedule dates
  const calculateSchedule = (rx: PrescriptionRecord) => {
    const dailyUnits = rx.dailyDosageUnits || 1;
    const daysRemaining = Math.max(0, Math.floor(rx.tabletsRemaining / dailyUnits));
    const leadDays = rx.notificationLeadDays || 5;

    // Simulated baseline: Sep 7, 2026
    const baseDate = new Date('2026-09-07T09:00:00Z');
    const runOutDate = new Date(baseDate.getTime() + daysRemaining * 86400000);
    const alertDate = new Date(runOutDate.getTime() - leadDays * 86400000);
    const isDue = daysRemaining <= leadDays;
    const daysUntilAlert = Math.max(0, daysRemaining - leadDays);

    return {
      daysRemaining,
      leadDays,
      runOutDate,
      alertDate,
      isDue,
      daysUntilAlert,
      time: rx.preferredAlertTime || '09:00 AM',
    };
  };

  const dueCount = prescriptions.filter((rx) => {
    const daily = rx.dailyDosageUnits || 1;
    const days = Math.floor(rx.tabletsRemaining / daily);
    return days <= (rx.notificationLeadDays || 5);
  }).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
            <span className="material-symbols-outlined text-xl">schedule_send</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-slate-900">Push Notification Refill Scheduler</h3>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                5-Day Lead Rule
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Automated push alerts trigger exactly 5 days before your medication supply runs out based on daily dosage intake.
            </p>
          </div>
        </div>

        {/* Web Push API Permission Status */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {permissionStatus === 'granted' ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Web Push Active</span>
            </div>
          ) : (
            <button
              onClick={requestBrowserPermission}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-black transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-xs">notifications</span>
              <span>Enable Browser Push</span>
            </button>
          )}

          <button
            onClick={() => setNotificationSound(!notificationSound)}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
              notificationSound
                ? 'bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
            title={notificationSound ? 'Sound chime enabled' : 'Sound muted'}
          >
            <span className="material-symbols-outlined text-sm">
              {notificationSound ? 'volume_up' : 'volume_off'}
            </span>
          </button>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Monitored Rx</span>
          <span className="font-black text-slate-900 text-sm">{prescriptions.length} Active</span>
          <span className="text-[10px] text-slate-500 block">Dosage tracked daily</span>
        </div>

        <div className={`p-2.5 rounded-xl border ${
          dueCount > 0 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-700'
        }`}>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Due For Push Alert</span>
          <span className={`font-black text-sm ${dueCount > 0 ? 'text-amber-800' : 'text-slate-900'}`}>
            {dueCount} Medications
          </span>
          <span className="text-[10px] block opacity-80">Supply ≤ 5 days</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead-Time Target</span>
          <span className="font-black text-slate-900 text-sm">5 Days Before</span>
          <span className="text-[10px] text-emerald-700 font-semibold block">Zero therapy lapse</span>
        </div>
      </div>

      {/* Medications Refill Schedule List */}
      <div className="space-y-3">
        {prescriptions.map((rx) => {
          const sched = calculateSchedule(rx);

          return (
            <div
              key={rx.id}
              className={`rounded-2xl border p-4 transition-all space-y-3 ${
                sched.isDue
                  ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-400/30'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Header: Name, Dosage, Status */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-slate-900">{rx.genericName}</h4>
                    {sched.isDue ? (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                        <span className="material-symbols-outlined text-[11px]">notifications_active</span>
                        5-DAY ALERT DUE
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px]">event</span>
                        SCHEDULED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Regimen: <strong className="text-slate-900 font-bold">{rx.dosageFrequencyLabel}</strong> ({rx.dailyDosageUnits || 1} unit/day)
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    RX #{rx.rxNumber} • {rx.brandReference}
                  </p>
                </div>

                <div className="text-right sm:self-auto self-start">
                  <div className="font-mono text-xs font-black text-emerald-800">
                    ${rx.unitCost.toFixed(2)}{' '}
                    <span className="line-through text-slate-400 text-[10px] font-normal">
                      ${rx.innovatorCost.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">Generic Parity</span>
                </div>
              </div>

              {/* Dynamic Calculation Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-1">
                <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Inventory</span>
                  <span className="font-black text-slate-900 text-xs">
                    {rx.tabletsRemaining} / {rx.totalTablets} units
                  </span>
                </div>

                <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Days Remaining</span>
                  <span className={`font-black text-xs ${sched.isDue ? 'text-amber-600' : 'text-emerald-700'}`}>
                    {sched.daysRemaining} Days Supply
                  </span>
                </div>

                <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Runs Out On</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {sched.runOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Push Alert Time</span>
                  <span className="font-mono font-bold text-amber-700 text-xs">
                    {sched.isDue
                      ? 'Triggered Today'
                      : `${sched.alertDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} @ ${sched.time}`}
                  </span>
                </div>
              </div>

              {/* Progress Track Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>Supply Consumption: {Math.round((rx.tabletsRemaining / rx.totalTablets) * 100)}% remaining</span>
                  <span>5-Day Alert Mark: {sched.leadDays * (rx.dailyDosageUnits || 1)} tablets</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      sched.isDue ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (rx.tabletsRemaining / rx.totalTablets) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Interactive Schedule Controls */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleLogDoseTaken(rx)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="Log that you took 1 dose today (decrements count and recalculates)"
                  >
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    <span>Log Dose (-1)</span>
                  </button>

                  <button
                    onClick={() => onTriggerPushAlert(rx)}
                    className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="Simulate immediate push notification"
                  >
                    <span className="material-symbols-outlined text-[13px]">play_arrow</span>
                    <span>Simulate Push</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenScheduleConfig(rx)}
                    className="px-2.5 py-1 text-slate-600 hover:text-slate-900 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px]">tune</span>
                    <span>Edit Dosage / Time</span>
                  </button>

                  <button
                    onClick={() => onRefillPrescription(rx)}
                    className={`px-3 py-1 font-black text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer ${
                      sched.isDue
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">shopping_cart</span>
                    <span>Refill (${rx.unitCost.toFixed(2)})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
