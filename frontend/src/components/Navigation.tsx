import React, { useState } from 'react';
import { AppViewMode, ConsumerSubView, UserAccount, NormalizedRole, normalizeRole } from '../types';

export interface NavItemConfig {
  id: AppViewMode;
  subView?: ConsumerSubView;
  label: string;
  icon: string;
  badge?: string;
}

export const ROLE_NAVIGATION: Record<NormalizedRole, NavItemConfig[]> = {
  patient: [
    { id: 'consumer-web', subView: 'compare', label: 'Home', icon: 'home' },
    { id: 'consumer-web', subView: 'medicine-details', label: 'Medicines', icon: 'search' },
    { id: 'consumer-web', subView: 'compare', label: 'Compare Prices', icon: 'compare_arrows' },
    { id: 'consumer-web', subView: 'cart', label: 'Orders', icon: 'shopping_bag' },
    { id: 'consumer-web', subView: 'rx-vault', label: 'Prescriptions', icon: 'prescriptions' },
    { id: 'auth', label: 'Profile', icon: 'person' },
  ],
  wholesaler: [
    { id: 'catalog-bioeq', label: 'Dashboard', icon: 'dashboard' },
    { id: 'catalog-bioeq', label: 'Inventory', icon: 'inventory_2', badge: 'Lots Active' },
    { id: 'catalog-bioeq', label: 'Orders', icon: 'local_shipping' },
    { id: 'salt-mapping', label: 'Products', icon: 'medication_liquid' },
    { id: 'catalog-bioeq', label: 'Suppliers', icon: 'factory' },
    { id: 'enterprise-analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'auth', label: 'Profile', icon: 'person' },
  ],
  doctor: [
    { id: 'clinical-os', label: 'Dashboard', icon: 'dashboard' },
    { id: 'clinical-os', label: 'Patients', icon: 'groups', badge: '18 Active' },
    { id: 'clinical-os', label: 'Prescriptions', icon: 'note_alt' },
    { id: 'clinical-os', label: 'Appointments', icon: 'calendar_clock' },
    { id: 'architecture-prd', label: 'Medical Records', icon: 'folder_shared' },
    { id: 'auth', label: 'Profile', icon: 'person' },
  ],
  admin: [
    { id: 'infrastructure', label: 'Dashboard', icon: 'admin_panel_settings', badge: '148 Nodes' },
    { id: 'infrastructure', label: 'Tenant Schema Isolation', icon: 'dns' },
    { id: 'enterprise-analytics', label: 'Platform Analytics', icon: 'insights' },
    { id: 'salt-mapping', label: 'Salt Arbitrage Engine', icon: 'schema' },
    { id: 'architecture-prd', label: 'Architecture & PRD', icon: 'account_tree' },
    { id: 'auth', label: 'Profile', icon: 'person' },
  ],
};

export const ROLE_ALLOWED_VIEWS: Record<NormalizedRole, AppViewMode[]> = {
  patient: ['consumer-web', 'auth'],
  wholesaler: ['catalog-bioeq', 'salt-mapping', 'enterprise-analytics', 'auth'],
  doctor: ['clinical-os', 'architecture-prd', 'auth'],
  admin: ['infrastructure', 'enterprise-analytics', 'salt-mapping', 'architecture-prd', 'auth'],
};

export const ROLE_DEFAULT_VIEW: Record<NormalizedRole, AppViewMode> = {
  patient: 'consumer-web',
  wholesaler: 'catalog-bioeq',
  doctor: 'clinical-os',
  admin: 'infrastructure',
};

interface NavigationProps {
  currentView: AppViewMode;
  onSelectView: (view: AppViewMode, subView?: ConsumerSubView) => void;
  cartCount: number;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  activePatientSubView?: ConsumerSubView;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onSelectView,
  cartCount,
  currentUser,
  onOpenAuth,
  onLogout,
  activePatientSubView,
}) => {
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [activeTenant, setActiveTenant] = useState('MediQuick Pharmacy #042 (Austin Node)');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeRole: NormalizedRole = normalizeRole(currentUser?.role);
  const navItems = ROLE_NAVIGATION[activeRole] || ROLE_NAVIGATION.patient;

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP / TABLET LEFT SIDEBAR NAVIGATION                                   */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col justify-between w-64 xl:w-72 h-screen sticky top-0 bg-slate-900 border-r border-slate-800 text-white z-40 overflow-y-auto shrink-0 select-none">
        <div className="p-4 space-y-5">
          {/* Brand Identity Header */}
          <div 
            onClick={() => onSelectView(ROLE_DEFAULT_VIEW[activeRole])}
            className="flex items-center gap-3 cursor-pointer group p-2 rounded-2xl hover:bg-slate-850 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl font-bold">medication</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  generic<span className="text-emerald-400">Med</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                  {activeRole} OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                Bioequivalent Generic Medicine Rail
              </p>
            </div>
          </div>

          {/* Node Health & GxP Compliance Banner */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>US-EAST-VA</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500 font-bold">99.98% HEALTH</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <span className="material-symbols-outlined text-xs text-blue-400">verified_user</span>
              <span className="truncate">21 CFR Part 11 & HIPAA Validated</span>
            </div>
          </div>

          {/* Vertical Sidebar Navigation Menu */}
          <nav className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>{activeRole.toUpperCase()} NAVIGATION</span>
              <span className="text-[9px] text-emerald-400 font-mono">RBAC Filtered</span>
            </div>

            {navItems.map((item, index) => {
              const isViewMatch = currentView === item.id;
              const isSubViewMatch = item.subView ? activePatientSubView === item.subView : true;
              const isActive = isViewMatch && isSubViewMatch;

              return (
                <button
                  key={`${item.id}-${item.label}-${index}`}
                  onClick={() => onSelectView(item.id, item.subView)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border-l-4 border-emerald-400 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`material-symbols-outlined text-lg ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Controls: Tenant Context & User Account */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/60">
          {/* Active Tenant Context Dropdown */}
          <div className="relative">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
              Active Tenant Context
            </label>
            <button
              onClick={() => setShowTenantMenu(!showTenantMenu)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-amber-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-sm text-amber-400">domain</span>
                <span className="truncate text-[11px]">{activeTenant}</span>
              </div>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </button>

            {showTenantMenu && (
              <div className="absolute bottom-12 left-0 w-full bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs text-slate-200">
                <div className="font-bold text-slate-400 px-2 py-1 uppercase tracking-wider text-[10px]">
                  Switch Schema Context
                </div>
                {[
                  'MediQuick Pharmacy #042 (Austin Node)',
                  'Cipla Global Therapeutics (ANDA #076477)',
                  'Austin Community Health GPO',
                  'Super Admin (Global Fleet)'
                ].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setActiveTenant(t);
                      setShowTenantMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-[11px] cursor-pointer ${
                      activeTenant === t ? 'text-emerald-400 font-bold bg-slate-800' : 'text-slate-300'
                    }`}
                  >
                    <span className="truncate">{t}</span>
                    {activeTenant === t && <span className="material-symbols-outlined text-xs text-emerald-400">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account Session Card */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">
                    {currentUser.avatar || 'GM'}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-mono font-bold">
                      {activeRole}
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-xs text-slate-400">unfold_more</span>
              </button>

              {showUserMenu && (
                <div className="absolute bottom-14 left-0 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-xs">
                  <div className="pb-2 border-b border-slate-800 mb-2">
                    <div className="font-bold text-white text-xs">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">manage_accounts</span>
                    <span>Account Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-950/50 text-rose-400 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors mt-1"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE TOP HEADER & DRAWER                                                */}
      {/* ========================================================================= */}
      <header className="lg:hidden bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div 
            onClick={() => onSelectView(ROLE_DEFAULT_VIEW[activeRole])}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-sm">
              gM
            </div>
            <span className="text-base font-black tracking-tight text-white">
              generic<span className="text-emerald-400">Med</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                onClick={onOpenAuth}
                className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs"
              >
                {currentUser.avatar || 'PT'}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-black text-xs rounded-lg"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Subnav Strip */}
        <div className="overflow-x-auto scrollbar-none flex items-center gap-1.5 px-4 py-2 bg-slate-950 border-t border-slate-800 text-xs">
          {navItems.map((item, index) => {
            const isViewMatch = currentView === item.id;
            const isSubViewMatch = item.subView ? activePatientSubView === item.subView : true;
            const isActive = isViewMatch && isSubViewMatch;

            return (
              <button
                key={`mobile-${item.id}-${item.label}-${index}`}
                onClick={() => onSelectView(item.id, item.subView)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'bg-slate-850 text-slate-300 border border-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-xs">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>
    </>
  );
};
