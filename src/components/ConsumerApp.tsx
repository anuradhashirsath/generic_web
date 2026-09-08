import React, { useState } from 'react';
import { ConsumerMedicine, ConsumerSubView, CartItem, PriceAlert, PrescriptionRecord, UserAccount } from '../types';
import { CONSUMER_MEDICINES, PRESCRIPTION_RECORDS } from '../data/mockData';
import { PrescriptionScanModal } from './modals/PrescriptionScanModal';
import { SetPriceAlertModal } from './modals/SetPriceAlertModal';
import { MedicinePriceTrendChart } from './charts/MedicinePriceTrendChart';
import { PushNotificationBanner } from './notifications/PushNotificationBanner';
import { PushRefillScheduler } from './notifications/PushRefillScheduler';
import { RefillScheduleModal } from './modals/RefillScheduleModal';
import { PrescriptionHistoryModal } from './modals/PrescriptionHistoryModal';
import { downloadPrescriptionSummaryPdf } from '../utils/generatePrescriptionPdf';

interface ConsumerAppProps {
  cart: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onClearCart: () => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
}

export const ConsumerApp: React.FC<ConsumerAppProps> = ({
  cart,
  onAddToCart,
  onClearCart,
  currentUser,
  onOpenAuth,
}) => {
  const [subView, setSubView] = useState<ConsumerSubView>('compare');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<ConsumerMedicine>(CONSUMER_MEDICINES[0]);
  const [selectedPackIndex, setSelectedPackIndex] = useState(1); // 30 tabs
  const [selectedPharmacyId, setSelectedPharmacyId] = useState('pharm-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'cod'>('apple_pay');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Prescriptions State with dosage and supply tracking
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(PRESCRIPTION_RECORDS);
  const [activePushNotification, setActivePushNotification] = useState<PrescriptionRecord | null>(null);
  const [editingPrescriptionSchedule, setEditingPrescriptionSchedule] = useState<PrescriptionRecord | null>(null);
  const [showHistoryPdfModal, setShowHistoryPdfModal] = useState(false);

  // Price Alerts State with initial monitored item
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: 'alert-initial-1',
      medicineId: 'med-2',
      genericSalt: 'Esomeprazole Magnesium',
      brandName: 'Nexium',
      strength: '40 mg',
      currentFloorPrice: 7.20,
      targetPrice: 6.00,
      notificationChannels: ['email', 'sms'],
      contactEmail: 'patient.user@gmail.com',
      contactPhone: '+1 (512) 555-0192',
      createdAt: '2026-09-01T10:00:00Z',
      isActive: true,
      status: 'active',
    }
  ]);

  // Live Drop Notification Banner
  const [activeDropNotification, setActiveDropNotification] = useState<{
    alert: PriceAlert;
    droppedPrice: number;
    pharmacyName: string;
  } | null>(null);

  const categories = ['All', 'Cardiovascular', 'Diabetes Care', 'Gastrointestinal', 'Antibiotics'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSavePriceAlert = (alert: PriceAlert) => {
    setPriceAlerts((prev) => {
      const existingIdx = prev.findIndex((a) => a.id === alert.id || a.medicineId === alert.medicineId);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = alert;
        return copy;
      }
      return [...prev, alert];
    });
    setShowPriceAlertModal(false);
    showToast(`Price Alert active for ${alert.genericSalt}! Target: $${alert.targetPrice.toFixed(2)}`);
  };

  const handleDeletePriceAlert = (alertId: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== alertId));
    setShowPriceAlertModal(false);
    showToast('Price Alert removed.');
  };

  const handleSimulatePriceDrop = (alert: PriceAlert, droppedPrice: number) => {
    setShowPriceAlertModal(false);
    setActiveDropNotification({
      alert,
      droppedPrice,
      pharmacyName: 'MediQuick Pharmacy #042',
    });
    showToast(`Price Drop Event: ${alert.genericSalt} floor dropped to $${droppedPrice.toFixed(2)}!`);
  };

  // Push Notification Scheduling Handlers
  const handleTriggerPushAlert = (rx: PrescriptionRecord) => {
    setActivePushNotification(rx);
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Refill Radar: 5 Days Left!`, {
          body: `${rx.genericName} has ${rx.daysSupplyRemaining} days remaining based on your dosage. Tap to refill generic ($${rx.unitCost.toFixed(2)}).`,
        });
      } catch {
        // Notification API fallback in iframes
      }
    }
    showToast(`5-Day Push Alert triggered for ${rx.genericName}!`);
  };

  const handleUpdatePrescription = (updated: PrescriptionRecord) => {
    setPrescriptions((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingPrescriptionSchedule(null);
    showToast(`Saved schedule for ${updated.genericName}`);
  };

  const handleRefillPrescription = (rx: PrescriptionRecord) => {
    onAddToCart({
      medicineId: rx.id === 'rx-1' ? 'med-1' : rx.id === 'rx-2' ? 'med-2' : 'med-4',
      genericName: rx.genericName,
      brandName: rx.brandReference.split(' ')[0],
      dosage: `${rx.dosage} (30 Units)`,
      quantity: 1,
      pharmacyId: 'pharm-1',
      pharmacyName: 'MediQuick Pharmacy #042',
      price: rx.unitCost,
      innovatorPrice: rx.innovatorCost,
      deliveryEta: '35 mins',
      rxVerified: true,
    });

    setPrescriptions((prev) =>
      prev.map((p) => {
        if (p.id === rx.id) {
          const replenishedTablets = p.tabletsRemaining + 30;
          const daily = p.dailyDosageUnits || 1;
          const recalculatedDays = Math.floor(replenishedTablets / daily);
          return {
            ...p,
            tabletsRemaining: replenishedTablets,
            daysSupplyRemaining: recalculatedDays,
            urgency: 'stable',
          };
        }
        return p;
      })
    );

    setActivePushNotification(null);
    showToast(`Refilled ${rx.genericName}! Added to cart and replenished 30 units.`);
    setSubView('cart');
  };

  const handleSnoozePush = (rx: PrescriptionRecord) => {
    setActivePushNotification(null);
    showToast(`Push alert for ${rx.genericName} snoozed for 24 hours.`);
  };

  const handleQuickDownloadPdf = () => {
    try {
      const filename = downloadPrescriptionSummaryPdf(prescriptions);
      showToast(`Prescription history PDF generated: ${filename}`);
    } catch (err) {
      console.error('Error generating prescription PDF:', err);
      showToast('Unable to generate PDF summary. Please try again.');
    }
  };

  const handleSelectMed = (med: ConsumerMedicine) => {
    setSelectedMedicine(med);
    setSelectedPackIndex(1);
    setSelectedPharmacyId(med.partnerPharmacies[0]?.id || 'pharm-1');
    setSubView('medicine-details');
  };

  const handleAddCurrentToCart = () => {
    const pack = selectedMedicine.packOptions[selectedPackIndex];
    const pharmacy = selectedMedicine.partnerPharmacies.find((p) => p.id === selectedPharmacyId) || selectedMedicine.partnerPharmacies[0];
    
    onAddToCart({
      medicineId: selectedMedicine.id,
      genericName: selectedMedicine.genericName,
      brandName: selectedMedicine.brandName,
      dosage: `${selectedMedicine.strength} (${pack.quantity} ${selectedMedicine.dosageType}s)`,
      quantity: 1,
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.pharmacyName,
      price: pack.price,
      innovatorPrice: selectedMedicine.innovatorPrice,
      deliveryEta: `${pharmacy.deliveryEstimateMinutes} mins`,
      rxVerified: true,
    });

    showToast(`Added ${selectedMedicine.genericName} to Savings Cart!`);
  };

  const handleExecuteCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
    }, 1500);
  };

  const totalBranded = cart.reduce((acc, c) => acc + c.innovatorPrice, 0);
  const totalGeneric = cart.reduce((acc, c) => acc + c.price, 0);
  const totalSaved = totalBranded - totalGeneric;
  const deliveryFee = 0.00;
  const platformFee = 0.90;
  const finalTotal = totalGeneric + deliveryFee + platformFee;

  const content = (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Push Notification Supply Alert Banner (5 Days Left) */}
      {activePushNotification && (
        <PushNotificationBanner
          prescription={activePushNotification}
          onDismiss={() => setActivePushNotification(null)}
          onRefill={handleRefillPrescription}
          onSnooze={handleSnoozePush}
        />
      )}

      {/* Real-time Generic Floor Price Drop Notification Banner */}
      {activeDropNotification && (
        <div className="bg-slate-900 text-white p-3.5 px-4 sticky top-0 z-40 shadow-xl border-b-2 border-emerald-500 animate-in slide-in-from-top duration-300">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg animate-pulse">notifications_active</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black">
                  <span className="text-emerald-400">PRICE DROP ALERT TRIGGERED</span>
                  <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                    New Floor Low
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  <strong>{activeDropNotification.alert.genericSalt} {activeDropNotification.alert.strength}</strong> dropped to{' '}
                  <strong className="text-emerald-400 font-mono font-bold">${activeDropNotification.droppedPrice.toFixed(2)}</strong> at {activeDropNotification.pharmacyName}!
                  {' '}(Target was ${activeDropNotification.alert.targetPrice.toFixed(2)})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => {
                  onAddToCart({
                    medicineId: activeDropNotification.alert.medicineId,
                    genericName: activeDropNotification.alert.genericSalt,
                    brandName: activeDropNotification.alert.brandName,
                    dosage: `${activeDropNotification.alert.strength} (30 Tablets)`,
                    quantity: 1,
                    pharmacyId: 'pharm-1',
                    pharmacyName: activeDropNotification.pharmacyName,
                    price: activeDropNotification.droppedPrice,
                    innovatorPrice: selectedMedicine.innovatorPrice,
                    deliveryEta: '35 mins',
                    rxVerified: true,
                  });
                  showToast(`Added ${activeDropNotification.alert.genericSalt} at drop price $${activeDropNotification.droppedPrice.toFixed(2)}!`);
                  setActiveDropNotification(null);
                  setSubView('cart');
                }}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap"
              >
                Add at ${activeDropNotification.droppedPrice.toFixed(2)}
              </button>
              <button
                onClick={() => setActiveDropNotification(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
                title="Dismiss"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Mobile App Header (Matching Images 7, 9, 11) */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
              gM
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 leading-tight">genericMed Consumer</div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-emerald-600">location_on</span>
                <span>Austin, TX 78701 (Express 45m)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubView('rx-vault')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                subView === 'rx-vault' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-sm">shield_with_heart</span>
              <span className="hidden sm:inline">Rx Vault</span>
            </button>
            <button
              onClick={() => setSubView('cart')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 relative cursor-pointer ${
                subView === 'cart' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-base">shopping_cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Quick Profile / Sign In Indicator */}
            {currentUser ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 p-1 pl-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                title={`Logged in as ${currentUser.name} (${currentUser.role})`}
              >
                <span className="hidden sm:inline text-[11px] font-bold text-emerald-800">
                  {currentUser.name.split(' ')[0]}
                </span>
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                  {currentUser.avatar || 'PT'}
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main SubView Content */}
      <div className="flex-1 pb-20">
        {/* SUBVIEW 1: Compare & Discovery (Image 9) */}
        {subView === 'compare' && (
          <div className="p-4 space-y-4 max-w-2xl mx-auto">
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search branded pill (e.g. Lipitor, Nexium) or salt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl shadow-xs focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-slate-400 text-lg">
                search
              </span>
              <button
                onClick={() => setShowOcrModal(true)}
                className="material-symbols-outlined absolute right-3.5 top-3.5 text-emerald-600 text-lg hover:scale-110 transition-transform cursor-pointer"
              >
                photo_camera
              </button>
            </div>

            {/* Trust Banner (Image 9) */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-2xl shadow-md space-y-1 relative overflow-hidden">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>FDA AB-Rated Equivalents</span>
              </div>
              <h3 className="text-base font-extrabold tracking-tight">
                Switch to Certified Generics & Save up to 90%
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Same active chemical compound. Zero brand markup. Verified by certified PharmD dispensers.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold">
                <span className="bg-white/20 px-2 py-0.5 rounded-full">482 Partner Pharmacies</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full">45-Min Express Delivery</span>
              </div>
            </div>

            {/* AI Optical Scanner Card (Image 9) */}
            <div 
              onClick={() => setShowOcrModal(true)}
              className="bg-white border-2 border-dashed border-emerald-300 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-emerald-50/40 transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">document_scanner</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Upload Doctor Prescription</h4>
                  <p className="text-[11px] text-slate-500">Neural OCR auto-matches lowest price generics</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                Scan Now
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Branded vs Generic Popular Switches (Image 9) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900">Popular Branded vs Generic Switches</span>
                <span className="text-[11px] text-emerald-700 font-bold">100% Bioequivalent</span>
              </div>

              {CONSUMER_MEDICINES.filter(
                (m) =>
                  (activeCategory === 'All' || m.category === activeCategory) &&
                  (m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    m.genericName.toLowerCase().includes(searchQuery.toLowerCase()))
              ).map((med) => {
                const savingsPct = Math.round(
                  ((med.innovatorPrice - med.genericFloorPrice) / med.innovatorPrice) * 100
                );
                return (
                  <div
                    key={med.id}
                    onClick={() => handleSelectMed(med)}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 uppercase">Branded:</span>
                          <span className="line-through text-slate-400 font-semibold text-xs">
                            {med.brandName}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mt-0.5">
                          {med.genericName} {med.strength}
                        </h4>
                        <p className="text-[11px] text-slate-500">{med.tagline}</p>
                      </div>

                      <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2 py-0.5 rounded-lg">
                        SAVE {savingsPct}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <span className="material-symbols-outlined text-xs text-emerald-600">verified</span>
                        <span>{med.partnerPharmacies.length} local pharmacies stock this</span>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block line-through">
                          ${med.innovatorPrice.toFixed(2)}
                        </span>
                        <div className="text-sm font-black text-emerald-700">
                          ${med.genericFloorPrice.toFixed(2)} <span className="text-[10px] text-slate-500 font-normal">/ 30 {med.dosageType}s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBVIEW 2: Medicine Details (Image 11) */}
        {subView === 'medicine-details' && (() => {
          const activeAlert = priceAlerts.find(
            (a) => a.medicineId === selectedMedicine.id && a.isActive
          );

          return (
            <div className="p-4 space-y-4 max-w-2xl mx-auto">
              <button
                onClick={() => setSubView('compare')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Compare</span>
              </button>

              {/* Medicine Header Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {selectedMedicine.category} • Rx Required
                    </span>
                    <h2 className="text-lg font-black text-slate-900 mt-1">
                      {selectedMedicine.genericName} {selectedMedicine.strength}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Generic Bioequivalent to <strong className="text-slate-800">{selectedMedicine.brandName}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">NDC: {selectedMedicine.ndcCode}</p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">medication</span>
                  </div>
                </div>

                {/* Salt Price Arbitrage Comparison Box (Image 11) */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-900">
                      Chemical Parity & Price Arbitrage
                    </span>
                    <div className="text-xs text-emerald-800 mt-0.5">
                      Save <strong className="text-emerald-900 font-black">${(selectedMedicine.innovatorPrice - selectedMedicine.genericFloorPrice).toFixed(2)}</strong> per bottle
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="line-through text-slate-400 text-xs">${selectedMedicine.innovatorPrice.toFixed(2)}</span>
                    <div className="text-base font-black text-emerald-800">${selectedMedicine.genericFloorPrice.toFixed(2)}</div>
                  </div>
                </div>

                {/* Pharmacokinetic Sameness Gauge */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Pharmacokinetic Sameness</span>
                    <span className="font-extrabold text-emerald-700 text-sm">{selectedMedicine.bioSameness}%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Active Salt Parity</span>
                    <span className="font-extrabold text-emerald-700 text-sm">{selectedMedicine.chemicalParity}% Exact</span>
                  </div>
                </div>
              </div>

              {/* 30-Day Generic Wholesale Floor Price History Chart (Recharts) */}
              <MedicinePriceTrendChart medicine={selectedMedicine} />

              {/* Set Price Alert Feature Card */}
              <div className={`rounded-2xl border p-4 shadow-xs space-y-3 transition-all ${
                activeAlert
                  ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400/30'
                  : 'bg-white border-slate-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      activeAlert
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <span className="material-symbols-outlined text-xl">
                        {activeAlert ? 'notifications_active' : 'add_alert'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900">
                          Generic Floor Price Alert
                        </h4>
                        {activeAlert ? (
                          <span className="bg-emerald-200 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-ping"></span>
                            ACTIVE WATCH
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Automated
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {activeAlert ? (
                          <>
                            Alert armed for floor drop to{' '}
                            <strong className="text-emerald-800 font-mono font-black">${activeAlert.targetPrice.toFixed(2)}</strong> or below via{' '}
                            <strong className="capitalize">{activeAlert.notificationChannels.join(' & ')}</strong>.
                          </>
                        ) : (
                          <>
                            Notify me immediately when the generic wholesale floor price drops below{' '}
                            <strong className="text-slate-800 font-mono">${selectedMedicine.genericFloorPrice.toFixed(2)}</strong>.
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {activeAlert && (
                      <button
                        onClick={() => {
                          const testPrice = +(activeAlert.targetPrice * 0.95).toFixed(2);
                          handleSimulatePriceDrop(activeAlert, testPrice);
                        }}
                        className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                        title="Simulate a real-time price drop trigger"
                      >
                        <span className="material-symbols-outlined text-sm">play_arrow</span>
                        <span>Test Drop</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowPriceAlertModal(true)}
                      className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        activeAlert
                          ? 'bg-slate-900 hover:bg-slate-800 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {activeAlert ? 'tune' : 'notifications_active'}
                      </span>
                      <span>{activeAlert ? 'Edit Alert' : 'Set Price Alert'}</span>
                    </button>
                  </div>
                </div>

                {activeAlert && (
                  <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center justify-between text-[10px] text-emerald-800 gap-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-emerald-600">verified</span>
                      <span>Real-time crawler monitors 482 licensed micro-hubs & manufacturer wholesale lots</span>
                    </span>
                    <span className="font-mono text-slate-500">
                      Target: -{Math.round(((selectedMedicine.genericFloorPrice - activeAlert.targetPrice) / selectedMedicine.genericFloorPrice) * 100)}% Drop
                    </span>
                  </div>
                )}
              </div>

              {/* Pack Size Selector (Image 11) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
              <span className="text-xs font-extrabold text-slate-900 block">Select Quantity & Days Supply</span>
              <div className="grid grid-cols-3 gap-2">
                {selectedMedicine.packOptions.map((pack, idx) => (
                  <button
                    key={pack.quantity}
                    onClick={() => setSelectedPackIndex(idx)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedPackIndex === idx
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">{pack.quantity} {selectedMedicine.dosageType}s</div>
                    <div className="text-sm font-extrabold text-emerald-700 mt-0.5">${pack.price.toFixed(2)}</div>
                    <span className="text-[9px] text-slate-500 block mt-0.5 font-semibold">Save {pack.savingsPct}%</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Partner Pharmacies List (Image 11) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">Select Fulfilling Generic Partner</span>
                <span className="text-[10px] text-emerald-700 font-bold">Austin Central Ring</span>
              </div>

              <div className="space-y-2">
                {selectedMedicine.partnerPharmacies.map((pharm) => (
                  <div
                    key={pharm.id}
                    onClick={() => setSelectedPharmacyId(pharm.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedPharmacyId === pharm.id
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <span>{pharm.pharmacyName}</span>
                        <span className="text-[10px] text-amber-600 flex items-center">
                          ★ {pharm.rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{pharm.genericBrandLabel}</p>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{pharm.distanceMiles} mi away</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">{pharm.deliveryEstimateMinutes} min express</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-black text-sm text-emerald-700">${pharm.price.toFixed(2)}</div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                        In Stock
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky Action Footer inside Mobile Screen */}
            <div className="pt-2">
              <button
                onClick={handleAddCurrentToCart}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                <span>
                  Add to Cart • ${selectedMedicine.packOptions[selectedPackIndex].price.toFixed(2)} (Save ${(selectedMedicine.innovatorPrice - selectedMedicine.packOptions[selectedPackIndex].price).toFixed(2)})
                </span>
              </button>
            </div>
          </div>
        );
      })()}

        {/* SUBVIEW 3: Prescription Vault (Image 7) */}
        {subView === 'rx-vault' && (
          <div className="p-4 space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">Personal Prescription Vault</h2>
                <p className="text-xs text-slate-500">256-bit AES Encrypted • HIPAA Verified</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistoryPdfModal(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  title="Download clinical summary PDF of active prescriptions for doctor consultations"
                >
                  <span className="material-symbols-outlined text-sm text-emerald-400">picture_as_pdf</span>
                  <span>Download Rx History</span>
                </button>
                <button
                  onClick={() => setShowOcrModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Rx</span>
                </button>
              </div>
            </div>

            {/* Doctor Consultation Prescription History Export Card */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-4 shadow-md border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-2xl">clinical_notes</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-white">Physician Consultation Summary</h3>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                      Clinical PDF
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 max-w-md leading-relaxed">
                    Generate a professional A4 clinical record of active prescriptions, FDA bioequivalence ratings, dosing schedules, and inventory levels with physician sign-off lines for your appointment.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={handleQuickDownloadPdf}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Direct 1-click PDF download"
                >
                  <span className="material-symbols-outlined text-sm text-emerald-400">download</span>
                  <span>Instant PDF</span>
                </button>
                <button
                  onClick={() => setShowHistoryPdfModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-bold">visibility</span>
                  <span>Customize & Export</span>
                </button>
              </div>
            </div>

            {/* Push Notification Refill Scheduler (Dosage-based 5-Day Run-Out Alerts) */}
            <PushRefillScheduler
              prescriptions={prescriptions}
              onUpdatePrescription={handleUpdatePrescription}
              onTriggerPushAlert={handleTriggerPushAlert}
              onRefillPrescription={handleRefillPrescription}
              onOpenScheduleConfig={(rx) => setEditingPrescriptionSchedule(rx)}
            />

            {/* Prescription Library Cards (Image 7) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Active Prescription Archive ({prescriptions.length})
                </h3>
                <span className="text-[11px] text-slate-500">Auto-synchronized with Micro-Hubs</span>
              </div>

              {prescriptions.map((rx) => {
                const daysLeft = rx.daysSupplyRemaining;
                const isUnder5Days = daysLeft <= 5;

                return (
                  <div
                    key={rx.id}
                    className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 transition-all ${
                      isUnder5Days ? 'border-amber-300 ring-1 ring-amber-400/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-extrabold text-slate-900">{rx.genericName}</h4>
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            AB Rated
                          </span>
                          {isUnder5Days && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">alarm</span>
                              ≤ 5 Days Left
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {rx.brandReference} • Regimen: <strong>{rx.dosageFrequencyLabel}</strong>
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          RX #{rx.rxNumber} • {rx.prescribingDoctor}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-black text-emerald-700 block">
                          ${rx.unitCost.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          ${rx.innovatorCost.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Supply Gauge Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                        <span>
                          <strong className={isUnder5Days ? 'text-amber-600' : 'text-slate-900'}>
                            {rx.tabletsRemaining} tablets
                          </strong>{' '}
                          ({daysLeft} days supply remaining)
                        </span>
                        <span>{rx.refillsRemaining} refills remaining</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isUnder5Days ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (rx.tabletsRemaining / rx.totalTablets) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">
                          Status: <strong className="text-emerald-700">{rx.verificationStage}</strong>
                        </span>
                        <span className="text-slate-300">•</span>
                        <button
                          onClick={() => setEditingPrescriptionSchedule(rx)}
                          className="text-[11px] text-slate-600 hover:text-slate-900 font-bold flex items-center gap-0.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[13px]">schedule</span>
                          <span>Dosage & Push Schedule</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {isUnder5Days && (
                          <button
                            onClick={() => handleTriggerPushAlert(rx)}
                            className="px-2 py-1 bg-amber-50 text-amber-900 hover:bg-amber-100 rounded-lg text-[11px] font-black flex items-center gap-1 cursor-pointer border border-amber-300"
                          >
                            <span className="material-symbols-outlined text-[13px]">notifications_active</span>
                            <span>Test 5-Day Push</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleRefillPrescription(rx)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">sync</span>
                          <span>Refill Generic</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Monitored Generic Salt Price Alerts Watchlist */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">notifications_active</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Active Generic Floor Price Alerts</h4>
                    <p className="text-[11px] text-slate-500">Real-time alerts triggered on micro-hub price arbitrage drops</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {priceAlerts.filter(a => a.isActive).length} Active
                </span>
              </div>

              <div className="space-y-2">
                {priceAlerts.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No price alerts set yet. Visit any medicine page to set one.</p>
                ) : (
                  priceAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span>{alert.genericSalt} {alert.strength}</span>
                          <span className="text-[10px] text-slate-400">({alert.brandName} equiv)</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>Current Floor: <strong className="text-slate-800">${alert.currentFloorPrice.toFixed(2)}</strong></span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">
                            Alert Target: ≤${alert.targetPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          Channels: {alert.notificationChannels.join(', ')} ({alert.contactEmail || alert.contactPhone})
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            const testPrice = +(alert.targetPrice * 0.95).toFixed(2);
                            handleSimulatePriceDrop(alert, testPrice);
                          }}
                          className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                          title="Simulate a price drop notification"
                        >
                          Test
                        </button>
                        <button
                          onClick={() => {
                            const med = CONSUMER_MEDICINES.find(m => m.id === alert.medicineId) || CONSUMER_MEDICINES[0];
                            setSelectedMedicine(med);
                            setShowPriceAlertModal(true);
                          }}
                          className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Transfer Prescription Card (Image 7) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Transfer from CVS, Walgreens, Rite Aid</h4>
                <p className="text-[11px] text-slate-500">We handle the pharmacist-to-pharmacist transfer in 60s</p>
              </div>
              <button
                onClick={() => showToast('Transfer request initiated with your pharmacy.')}
                className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-800"
              >
                Transfer
              </button>
            </div>
          </div>
        )}

        {/* SUBVIEW 4: Savings Cart (Image 13) */}
        {subView === 'cart' && (
          <div className="p-4 space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">My Savings Cart</h2>
                <p className="text-xs text-slate-500">Multi-tenant split sourcing with synchronized express delivery</p>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
                <span className="material-symbols-outlined text-4xl text-slate-300">shopping_cart</span>
                <p className="text-xs font-bold text-slate-600">Your savings cart is empty.</p>
                <button
                  onClick={() => setSubView('compare')}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700 cursor-pointer"
                >
                  Browse Generic Switches
                </button>
              </div>
            ) : (
              <>
                {/* Savings Callout Banner (Image 13) */}
                <div className="bg-emerald-600 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-200">
                      Total Arbitrage Savings
                    </span>
                    <div className="text-xl font-black">${totalSaved.toFixed(2)} Saved</div>
                    <p className="text-xs text-emerald-100">Compared to branded innovator MRP (${totalBranded.toFixed(2)})</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-black text-base">
                    -90%
                  </div>
                </div>

                {/* Cart Items List with Fulfilling Hubs */}
                <div className="space-y-3">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-extrabold text-slate-900">{item.genericName}</h4>
                            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 rounded">
                              AB Rated
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{item.dosage}</p>
                          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                            Sourced from: {item.pharmacyName}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-slate-400 line-through text-[11px] block">
                            ${item.innovatorPrice.toFixed(2)}
                          </span>
                          <span className="text-sm font-black text-emerald-700">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-blue-600">schedule</span>
                          ETA: {item.deliveryEta}
                        </span>
                        <span className="text-emerald-600 font-bold">Rx Certified</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Synchronized Multi-Courier Route Notice (Image 13) */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-blue-900">
                  <span className="material-symbols-outlined text-blue-600 mt-0.5">route</span>
                  <div>
                    <span className="font-bold">Synchronized Multi-Courier Dispatch</span>
                    <p className="text-blue-800 text-[11px] mt-0.5">
                      Your items are fulfilled from 2 micro-hubs (MediQuick #042 & HealthHub #118) and bundled for single delivery before 4:00 PM.
                    </p>
                  </div>
                </div>

                {/* Price Summary Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Branded Innovator Price:</span>
                    <span className="line-through">${totalBranded.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Generic Parity Discount:</span>
                    <span>-${totalSaved.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Generic Medicines Subtotal:</span>
                    <span className="font-bold">${totalGeneric.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Express Micro-Hub Delivery:</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>21 CFR Regulatory Fee:</span>
                    <span>${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-emerald-700 font-mono">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Preferred Payment Method */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-900 block">Payment Method</span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        paymentMethod === 'apple_pay'
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      Apple Pay
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      Card •• 4912
                    </button>
                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      Cash/HSA
                    </button>
                  </div>
                </div>

                {/* Proceed to Payment Button */}
                <button
                  onClick={handleExecuteCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>{isCheckingOut ? 'Authorizing & Routing Couriers...' : `Proceed to Payment $${finalTotal.toFixed(2)}`}</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (Matching Image 9) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-2 px-6">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            onClick={() => setSubView('compare')}
            className={`flex flex-col items-center gap-1 text-xs cursor-pointer ${
              subView === 'compare' ? 'text-emerald-700 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-xl">sync_alt</span>
            <span className="text-[10px]">Compare</span>
          </button>
          <button
            onClick={() => setSubView('rx-vault')}
            className={`flex flex-col items-center gap-1 text-xs cursor-pointer ${
              subView === 'rx-vault' ? 'text-emerald-700 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-xl">shield_with_heart</span>
            <span className="text-[10px]">Rx Vault</span>
          </button>
          <button
            onClick={() => setSubView('cart')}
            className={`flex flex-col items-center gap-1 text-xs relative cursor-pointer ${
              subView === 'cart' ? 'text-emerald-700 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-xl">shopping_cart</span>
            <span className="text-[10px]">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setSubView('compare');
              showToast('You saved $318 overall with genericMed this year!');
            }}
            className="flex flex-col items-center gap-1 text-xs text-slate-400 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">savings</span>
            <span className="text-[10px]">Savings</span>
          </button>
          <button
            onClick={() => onOpenAuth && onOpenAuth()}
            className="flex flex-col items-center gap-1 text-xs text-slate-400 hover:text-emerald-700 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">
              {currentUser ? 'account_circle' : 'login'}
            </span>
            <span className="text-[10px]">
              {currentUser ? (currentUser.role === 'patient' ? 'Profile' : 'Account') : 'Sign In'}
            </span>
          </button>
        </div>
      </div>

      {/* Checkout Success Modal */}
      {checkoutComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Order Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Prescriptions dispatched to <strong>MediQuick Pharmacy #042</strong>. EV Courier assigned with Handshake PIN <strong className="text-slate-900">4819</strong>.
              </p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-800">
              You saved <strong className="text-emerald-950 font-black">${totalSaved.toFixed(2)}</strong> on this order!
            </div>
            <button
              onClick={() => {
                setCheckoutComplete(false);
                onClearCart();
                setSubView('compare');
              }}
              className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-800"
            >
              Done & Return to Store
            </button>
          </div>
        </div>
      )}

      {/* OCR Scan Modal */}
      {showOcrModal && (
        <PrescriptionScanModal
          onClose={() => setShowOcrModal(false)}
          onPrescriptionParsed={(parsed) => {
            showToast(`Prescription detected: ${parsed.genericSalt} (${parsed.dosage})`);
            setSubView('medicine-details');
          }}
        />
      )}

      {/* Set Price Alert Modal */}
      {showPriceAlertModal && (
        <SetPriceAlertModal
          medicine={selectedMedicine}
          existingAlert={priceAlerts.find((a) => a.medicineId === selectedMedicine.id && a.isActive) || null}
          onClose={() => setShowPriceAlertModal(false)}
          onSaveAlert={handleSavePriceAlert}
          onDeleteAlert={handleDeletePriceAlert}
          onSimulatePriceDrop={handleSimulatePriceDrop}
        />
      )}

      {/* Refill Dosage & Push Alert Schedule Modal */}
      {editingPrescriptionSchedule && (
        <RefillScheduleModal
          prescription={editingPrescriptionSchedule}
          onClose={() => setEditingPrescriptionSchedule(null)}
          onSave={handleUpdatePrescription}
          onTriggerTestPush={handleTriggerPushAlert}
        />
      )}

      {/* Prescription History PDF Consultation Export Modal */}
      {showHistoryPdfModal && (
        <PrescriptionHistoryModal
          prescriptions={prescriptions}
          onClose={() => setShowHistoryPdfModal(false)}
          onDownloaded={(filename) => showToast(`Prescription history downloaded: ${filename}`)}
        />
      )}
    </div>
  );

  return (
    <div className="bg-slate-200/60 min-h-screen py-4">
      {/* Device Frame Switcher Strip */}
      <div className="max-w-md mx-auto mb-3 flex items-center justify-between px-4">
        <div className="text-xs font-bold text-slate-600">Consumer Viewport</div>
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300">
          <button
            onClick={() => setIsMobileFrame(true)}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              isMobileFrame ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Mobile Frame
          </button>
          <button
            onClick={() => setIsMobileFrame(false)}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              !isMobileFrame ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Responsive View
          </button>
        </div>
      </div>

      {isMobileFrame ? (
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-800 relative">
          {content}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
          {content}
        </div>
      )}
    </div>
  );
};
