/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppViewMode, CartItem, UserAccount } from './types';
import { Navigation } from './components/Navigation';
import { ClinicalHealthOS } from './components/ClinicalHealthOS';
import { CatalogBioequivalence } from './components/CatalogBioequivalence';
import { InfrastructureCore } from './components/InfrastructureCore';
import { ConsumerApp } from './components/ConsumerApp';
import { EnterpriseAnalytics } from './components/EnterpriseAnalytics';
import { SaltMappingEngine } from './components/SaltMappingEngine';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { AuthScreen } from './components/AuthScreen';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const [currentView, setCurrentView] = useState<AppViewMode>('clinical-os');
  const { currentUser, setCurrentUser, logout: authLogout } = useAuth();

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await authLogout();
    setCurrentView('auth');
  };
  
  // Pre-seed cart with initial sample items
  const [cart, setCart] = useState<CartItem[]>([
    {
      medicineId: 'med-1',
      genericName: 'Atorvastatin Calcium',
      brandName: 'Lipitor',
      dosage: '20 mg (30 Tablets)',
      quantity: 1,
      pharmacyId: 'pharm-1',
      pharmacyName: 'MediQuick Pharmacy #042',
      price: 8.90,
      innovatorPrice: 84.50,
      deliveryEta: '35 mins',
      rxVerified: true,
    },
    {
      medicineId: 'med-2',
      genericName: 'Esomeprazole Magnesium',
      brandName: 'Nexium',
      dosage: '40 mg (30 Capsules)',
      quantity: 1,
      pharmacyId: 'pharm-2',
      pharmacyName: 'HealthHub Pharmacy #118',
      price: 7.20,
      innovatorPrice: 68.00,
      deliveryEta: '40 mins',
      rxVerified: true,
    }
  ]);

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Left Sidebar Navigation */}
      <Navigation
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        cartCount={cart.length}
        currentUser={currentUser}
        onOpenAuth={() => setCurrentView('auth')}
        onLogout={handleLogout}
      />

      {/* Main Right Content Region */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1">
          {currentView === 'auth' && (
            <AuthScreen
              currentUser={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onNavigate={(v) => setCurrentView(v)}
              onClose={() => setCurrentView(currentUser?.role === 'pharmacist' ? 'clinical-os' : 'consumer-web')}
            />
          )}
          {currentView === 'clinical-os' && <ClinicalHealthOS />}
          {currentView === 'catalog-bioeq' && <CatalogBioequivalence />}
          {currentView === 'infrastructure' && <InfrastructureCore />}
          {currentView === 'consumer-web' && (
            <ConsumerApp
              cart={cart}
              onAddToCart={handleAddToCart}
              onClearCart={handleClearCart}
              currentUser={currentUser}
              onOpenAuth={() => setCurrentView('auth')}
            />
          )}
          {currentView === 'enterprise-analytics' && <EnterpriseAnalytics />}
          {currentView === 'salt-mapping' && <SaltMappingEngine />}
          {currentView === 'architecture-prd' && <ArchitectureViewer />}
        </main>

        {/* Global Application Sticky Footer */}
        <footer className="bg-white border-t border-slate-200 py-3 px-4 sm:px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-slate-800">genericMed Production Health OS</span>
              <span className="text-slate-400">|</span>
              <span>21 CFR Part 11 & GxP Validated</span>
              <span className="text-slate-400">|</span>
              <span className="font-mono text-[11px] text-slate-400">Austin Micro-Hub #042</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-slate-400">Switch View:</span>
              <button
                onClick={() => setCurrentView('auth')}
                className="hover:text-emerald-600 font-semibold cursor-pointer text-emerald-700"
              >
                {currentUser ? `Account (${currentUser.name})` : 'Login / Register'}
              </button>
              <button
                onClick={() => setCurrentView('clinical-os')}
                className="hover:text-emerald-600 font-semibold cursor-pointer"
              >
                Dispensing Queue
              </button>
              <button
                onClick={() => setCurrentView('catalog-bioeq')}
                className="hover:text-emerald-600 font-semibold cursor-pointer"
              >
                Manufacturer Catalog
              </button>
              <button
                onClick={() => setCurrentView('consumer-web')}
                className="hover:text-emerald-600 font-semibold cursor-pointer"
              >
                Patient Mobile Web
              </button>
              <button
                onClick={() => setCurrentView('architecture-prd')}
                className="hover:text-emerald-600 font-semibold cursor-pointer"
              >
                System PRD Specs
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
