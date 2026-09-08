import React, { useState } from 'react';
import { AppViewMode } from '../types';

interface NavigationProps {
  currentView: AppViewMode;
  onSelectView: (view: AppViewMode) => void;
  cartCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onSelectView,
  cartCount,
}) => {
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [activeTenant, setActiveTenant] = useState('MediQuick Pharmacy #042 (Austin Node)');
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems: { id: AppViewMode; label: string; icon: string; badge?: string }[] = [
    { id: 'clinical-os', label: 'Clinical Health OS', icon: 'local_pharmacy', badge: '18 Live' },
    { id: 'catalog-bioeq', label: 'Bioequivalence Catalog', icon: 'science' },
    { id: 'consumer-web', label: 'Patient Mobile Web', icon: 'smartphone', badge: cartCount > 0 ? `${cartCount}` : undefined },
    { id: 'enterprise-analytics', label: 'Platform Analytics', icon: 'insights' },
    { id: 'salt-mapping', label: 'Salt Arbitrage Engine', icon: 'schema' },
    { id: 'infrastructure', label: 'DB Schema Isolation', icon: 'dns', badge: '148 Nodes' },
    { id: 'architecture-prd', label: 'Architecture & PRD', icon: 'account_tree' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Compliance & Node Status Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NODE US-EAST-VA • 99.98% HEALTHY</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-slate-300">
            <span className="material-symbols-outlined text-xs text-blue-400">verified_user</span>
            <span>21 CFR Part 11 & HIPAA Cryptographic Stamp Validated</span>
          </div>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">PostgreSQL 16 Schema-per-Tenant RLS Active</span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <span className="text-slate-400 font-mono text-[11px]">LEDGER BLOCK: #948,192</span>
          <div className="relative">
            <button
              onClick={() => setShowTenantMenu(!showTenantMenu)}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-medium bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs text-amber-400">domain</span>
              <span className="max-w-[180px] truncate">{activeTenant}</span>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </button>
            {showTenantMenu && (
              <div className="absolute right-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-2 z-50 text-xs text-slate-200">
                <div className="font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider text-[10px]">
                  Switch Active Tenant Context
                </div>
                {[
                  'MediQuick Pharmacy #042 (Austin Node)',
                  'Cipla Global Therapeutics (ANDA #076477)',
                  'Austin Community Health GPO',
                  'Super Admin (Global Infrastructure Fleet)'
                ].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setActiveTenant(t);
                      setShowTenantMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 flex items-center justify-between ${
                      activeTenant === t ? 'text-emerald-400 font-semibold bg-slate-800/50' : ''
                    }`}
                  >
                    <span className="truncate">{t}</span>
                    {activeTenant === t && <span className="material-symbols-outlined text-xs text-emerald-400">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onSelectView('clinical-os')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">medication</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  generic<span className="text-emerald-600">Med</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                  B2B Health OS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none">
                Bioequivalent Generic Medicine & Micro-Hub Rail
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Pills */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span className={`material-symbols-outlined text-sm ${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools & Pharmacist Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors relative cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-bold text-slate-800">Operational Alerts</span>
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-semibold px-2 py-0.5 rounded-full">3 Critical</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200/80">
                    <p className="font-semibold text-amber-900 text-[11px]">Cold Vault Alert (CHILL-V-02)</p>
                    <p className="text-amber-700 text-[10px]">Temp 3.8°C stable. Semaglutide/Liraglutide lot audit due.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200/80">
                    <p className="font-semibold text-emerald-900 text-[11px]">Cipla CoA Lot #CP-2025-0819 Released</p>
                    <p className="text-emerald-700 text-[10px]">Atorvastatin 20mg 640k units cleared QC.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-200/80">
                    <p className="font-semibold text-blue-900 text-[11px]">Courier #08 Dock Gate Arrival</p>
                    <p className="text-blue-700 text-[10px]">Handshake PIN 4819 ready for Esomeprazole order.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Doctor / Dispenser badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs">
              AT
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">Dr. Aris Thorne, PharmD</div>
              <div className="text-[11px] text-slate-500 leading-tight">Lead Clinical Dispenser</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Responsive View Sub-menu Strip */}
      <div className="lg:hidden overflow-x-auto scrollbar-none flex items-center gap-1 px-3 py-2 bg-slate-50 border-t border-slate-200">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-xs">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[9px] px-1 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
