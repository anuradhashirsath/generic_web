import React, { useState } from 'react';
import { ConsumerMedicine, PriceAlert } from '../../types';

interface SetPriceAlertModalProps {
  medicine: ConsumerMedicine;
  existingAlert?: PriceAlert | null;
  onClose: () => void;
  onSaveAlert: (alert: PriceAlert) => void;
  onDeleteAlert?: (alertId: string) => void;
  onSimulatePriceDrop: (alert: PriceAlert, droppedPrice: number) => void;
}

export const SetPriceAlertModal: React.FC<SetPriceAlertModalProps> = ({
  medicine,
  existingAlert,
  onClose,
  onSaveAlert,
  onDeleteAlert,
  onSimulatePriceDrop,
}) => {
  const currentFloor = medicine.genericFloorPrice;
  const initialTarget = existingAlert ? existingAlert.targetPrice : +(currentFloor * 0.85).toFixed(2);

  const [targetPrice, setTargetPrice] = useState<number>(initialTarget);
  const [emailEnabled, setEmailEnabled] = useState(
    existingAlert ? existingAlert.notificationChannels.includes('email') : true
  );
  const [smsEnabled, setSmsEnabled] = useState(
    existingAlert ? existingAlert.notificationChannels.includes('sms') : true
  );
  const [pushEnabled, setPushEnabled] = useState(
    existingAlert ? existingAlert.notificationChannels.includes('push') : false
  );
  const [contactEmail, setContactEmail] = useState(
    existingAlert?.contactEmail || 'patient.user@gmail.com'
  );
  const [contactPhone, setContactPhone] = useState(
    existingAlert?.contactPhone || '+1 (512) 555-0192'
  );

  const discountPercentFromCurrent = Math.max(
    0,
    Math.round(((currentFloor - targetPrice) / currentFloor) * 100)
  );

  const setPresetDrop = (pct: number) => {
    const val = +(currentFloor * (1 - pct / 100)).toFixed(2);
    setTargetPrice(val);
  };

  const handleSave = () => {
    const channels: ('email' | 'sms' | 'push')[] = [];
    if (emailEnabled) channels.push('email');
    if (smsEnabled) channels.push('sms');
    if (pushEnabled) channels.push('push');

    if (channels.length === 0) {
      alert('Please select at least one notification channel (Email, SMS, or Push).');
      return;
    }

    const newAlert: PriceAlert = {
      id: existingAlert?.id || `alert-${Date.now()}`,
      medicineId: medicine.id,
      genericSalt: medicine.genericName,
      brandName: medicine.brandName,
      strength: medicine.strength,
      currentFloorPrice: currentFloor,
      targetPrice: targetPrice,
      notificationChannels: channels,
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      createdAt: existingAlert?.createdAt || new Date().toISOString(),
      isActive: true,
      status: 'active',
    };

    onSaveAlert(newAlert);
  };

  const handleTestTrigger = () => {
    const channels: ('email' | 'sms' | 'push')[] = [];
    if (emailEnabled) channels.push('email');
    if (smsEnabled) channels.push('sms');
    if (pushEnabled) channels.push('push');

    const testAlert: PriceAlert = {
      id: existingAlert?.id || `alert-${Date.now()}`,
      medicineId: medicine.id,
      genericSalt: medicine.genericName,
      brandName: medicine.brandName,
      strength: medicine.strength,
      currentFloorPrice: currentFloor,
      targetPrice: targetPrice,
      notificationChannels: channels.length > 0 ? channels : ['email', 'sms'],
      contactEmail: contactEmail,
      contactPhone: contactPhone,
      createdAt: new Date().toISOString(),
      isActive: true,
      status: 'triggered',
    };

    const simulatedDropPrice = +(targetPrice * 0.95).toFixed(2);
    onSimulatePriceDrop(testAlert, simulatedDropPrice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">notifications_active</span>
            </div>
            <div>
              <h3 className="font-black text-sm text-white">Set Generic Floor Price Alert</h3>
              <p className="text-xs text-slate-400">
                {medicine.genericName} {medicine.strength} ({medicine.brandName} Equivalent)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 text-xs text-slate-700">
          {/* Current Floor & Arbitrage Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Current Wholesale Generic Floor
              </span>
              <div className="text-xl font-black text-emerald-700 mt-0.5">
                ${currentFloor.toFixed(2)}{' '}
                <span className="text-xs font-normal text-slate-500">/ 30 {medicine.dosageType}s</span>
              </div>
              <span className="text-[11px] text-slate-500">
                Innovator brand ({medicine.brandName}) is ${medicine.innovatorPrice.toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Active 482 Hub Feeds
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Live GxP Micro-Hub sync</p>
            </div>
          </div>

          {/* Threshold Setting Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-900 text-xs">
                Alert Me When Generic Floor Price Drops To Or Below:
              </label>
              <span className="font-mono font-black text-emerald-700 text-sm">
                ${targetPrice.toFixed(2)}
              </span>
            </div>

            {/* Quick Percentage Presets */}
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 25].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setPresetDrop(pct)}
                  className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                    Math.abs(targetPrice - +(currentFloor * (1 - pct / 100)).toFixed(2)) < 0.05
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white font-medium'
                  }`}
                >
                  <span className="text-[11px] block">-{pct}% Drop</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    ${(currentFloor * (1 - pct / 100)).toFixed(2)}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Input Slider & Number Box */}
            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min={+(currentFloor * 0.4).toFixed(2)}
                max={+(currentFloor * 0.98).toFixed(2)}
                step="0.10"
                value={targetPrice}
                onChange={(e) => setTargetPrice(parseFloat(e.target.value))}
                className="flex-1 accent-emerald-600 cursor-pointer"
              />
              <div className="relative w-24">
                <span className="absolute left-2.5 top-2 text-slate-400 font-bold text-xs">$</span>
                <input
                  type="number"
                  step="0.10"
                  min="1"
                  max={currentFloor}
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(parseFloat(e.target.value) || currentFloor)}
                  className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-emerald-600">trending_down</span>
              <span>
                Triggers when floor drops by at least{' '}
                <strong className="text-emerald-700 font-bold">{discountPercentFromCurrent}%</strong> (Save{' '}
                <strong className="text-emerald-700 font-bold">${(medicine.innovatorPrice - targetPrice).toFixed(2)}</strong> vs
                branded).
              </span>
            </div>
          </div>

          {/* Delivery Channels */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="font-extrabold text-slate-900 text-xs block">
              Notification Channels
            </span>

            {/* Channel: Email */}
            <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-sm text-slate-500">mail</span>
                  <span>Email Notification</span>
                </label>
                <span className="text-[10px] text-slate-400">Instant Alert</span>
              </div>
              {emailEnabled && (
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              )}
            </div>

            {/* Channel: SMS */}
            <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsEnabled}
                    onChange={(e) => setSmsEnabled(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-sm text-slate-500">sms</span>
                  <span>SMS Mobile Text</span>
                </label>
                <span className="text-[10px] text-slate-400">Direct to Phone</span>
              </div>
              {smsEnabled && (
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              )}
            </div>

            {/* Channel: Push */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => setPushEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <span className="material-symbols-outlined text-sm text-slate-500">notifications</span>
                <span>Browser / Device Push</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold">Real-time Webhook</span>
            </div>
          </div>

          {/* Test Trigger / Demo simulation */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div className="pr-2">
              <span className="font-bold text-emerald-950 text-xs block">Want to test the alert now?</span>
              <p className="text-[11px] text-emerald-800">
                Simulate a manufacturer price drop to see how the notification arrives.
              </p>
            </div>
            <button
              type="button"
              onClick={handleTestTrigger}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              Test Alert
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-4 border-t border-slate-200 flex items-center justify-between">
          {existingAlert && onDeleteAlert ? (
            <button
              type="button"
              onClick={() => onDeleteAlert(existingAlert.id)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              <span>Remove Alert</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-400">Zero-spam • Cancel anytime</span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">check</span>
              <span>{existingAlert ? 'Update Alert' : 'Set Price Alert'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
