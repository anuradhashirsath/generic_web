import React, { useState } from 'react';
import { UserAccount, UserRole, AppViewMode } from '../types';
import { apiService } from '../utils/apiService';


interface AuthScreenProps {
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  onNavigate: (view: AppViewMode) => void;
  onClose?: () => void;
}

// Pre-configured demo accounts for immediate instant testing
export const DEMO_ACCOUNTS: Record<UserRole, UserAccount> = {
  patient: {
    id: 'usr-patient-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@healthmail.com',
    role: 'patient',
    phone: '+1 (512) 555-0192',
    avatar: 'SJ',
    patientId: 'PT-8829-TX',
    dob: 'May 14, 1984',
    facilityName: 'Austin Community Health Hub #042',
    createdAt: '2025-11-12',
    twoFactorEnabled: true,
  },
  pharmacist: {
    id: 'usr-pharm-1',
    name: 'Dr. Aris Thorne, PharmD',
    email: 'aris.thorne@mediquick-rx.com',
    role: 'pharmacist',
    phone: '+1 (512) 555-8834',
    avatar: 'AT',
    npiNumber: '1948201948',
    licenseState: 'TX - #84920',
    facilityName: 'MediQuick Pharmacy #042 (Austin Node)',
    createdAt: '2024-03-01',
    twoFactorEnabled: true,
  },
  wholesaler: {
    id: 'usr-wholesale-1',
    name: 'Rohan Mehta',
    email: 'supply.lead@cipla-generics.com',
    role: 'wholesaler',
    phone: '+1 (737) 555-4920',
    avatar: 'RM',
    facilityName: 'Cipla Global Logistics & ANDA Rail',
    createdAt: '2024-07-15',
    twoFactorEnabled: true,
  },
  admin: {
    id: 'usr-admin-1',
    name: 'System Admin',
    email: 'admin@genericmed.health',
    role: 'admin',
    phone: '+1 (800) 555-0199',
    avatar: 'AD',
    facilityName: 'genericMed Health OS Platform Core',
    createdAt: '2024-01-01',
    twoFactorEnabled: true,
  },
};


export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onNavigate,
  onClose,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('sarah.jenkins@healthmail.com');
  const [loginPassword, setLoginPassword] = useState('GenericMed#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  // Role specific fields
  const [regDob, setRegDob] = useState('');
  const [regZip, setRegZip] = useState('78701');
  const [regNpi, setRegNpi] = useState('');
  const [regLicense, setRegLicense] = useState('');
  const [regFacility, setRegFacility] = useState('');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [agreedToHipaa, setAgreedToHipaa] = useState(false);

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 - 4
  };

  const passwordStrength = getPasswordStrength(regPassword);

  const handleQuickDemoLogin = async (role: UserRole) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const demoUser = DEMO_ACCOUNTS[role];

    // Attempt live API login for demo account
    const apiRes = await apiService.login({
      email: demoUser.email,
      password: 'GenericMed#2026',
    });

    const userToLogin = apiRes.success && apiRes.user ? apiRes.user : demoUser;
    onLogin(userToLogin);
    setIsSubmitting(false);
    setSuccessToast(`Signed in as ${userToLogin.name} (${userToLogin.role.toUpperCase()})`);

    // Auto-navigate to appropriate hub
    if (userToLogin.role === 'patient') {
      onNavigate('consumer-web');
    } else if (userToLogin.role === 'pharmacist') {
      onNavigate('clinical-os');
    } else {
      onNavigate('catalog-bioeq');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please provide an email address, phone, or NPI / Patient ID.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    const apiRes = await apiService.login({
      email: loginIdentifier.trim(),
      password: loginPassword,
    });

    if (apiRes.success && apiRes.user) {
      onLogin(apiRes.user);
      setIsSubmitting(false);
      setSuccessToast(`Welcome back, ${apiRes.user.name}!`);

      if (apiRes.user.role === 'patient') {
        onNavigate('consumer-web');
      } else if (apiRes.user.role === 'pharmacist') {
        onNavigate('clinical-os');
      } else {
        onNavigate('catalog-bioeq');
      }
      return;
    }

    // Fallback if offline mode
    let matchedRole: UserRole = selectedRole;
    if (loginIdentifier.includes('aris') || loginIdentifier.includes('rx') || loginIdentifier.includes('pharm')) {
      matchedRole = 'pharmacist';
    } else if (loginIdentifier.includes('cipla') || loginIdentifier.includes('supply') || loginIdentifier.includes('wholesale')) {
      matchedRole = 'wholesaler';
    }

    const existingDemo = DEMO_ACCOUNTS[matchedRole];
    const authenticatedUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: existingDemo.name,
      email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@healthmail.com`,
      role: matchedRole,
      phone: existingDemo.phone,
      avatar: existingDemo.avatar,
      patientId: existingDemo.patientId,
      dob: existingDemo.dob,
      npiNumber: existingDemo.npiNumber,
      licenseState: existingDemo.licenseState,
      facilityName: existingDemo.facilityName,
      createdAt: new Date().toISOString().split('T')[0],
      twoFactorEnabled: rememberMe,
    };

    onLogin(authenticatedUser);
    setIsSubmitting(false);
    setSuccessToast(`Welcome back, ${authenticatedUser.name}!`);

    if (authenticatedUser.role === 'patient') {
      onNavigate('consumer-web');
    } else if (authenticatedUser.role === 'pharmacist') {
      onNavigate('clinical-os');
    } else {
      onNavigate('catalog-bioeq');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Valid email address is required.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreedToHipaa) {
      setErrorMessage('You must acknowledge the HIPAA & 21 CFR Part 11 security terms to register.');
      return;
    }

    if (selectedRole === 'pharmacist' && !regNpi.trim()) {
      setErrorMessage('NPI (National Provider Identifier) is mandatory for clinical dispensing access.');
      return;
    }

    setIsSubmitting(true);

    const apiRes = await apiService.register({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      role: selectedRole,
      phone: regPhone,
      dob: regDob,
      npiNumber: regNpi,
      licenseState: regLicense,
      facilityName: selectedRole === 'pharmacist' ? regFacility : selectedRole === 'wholesaler' ? regCompanyName : undefined,
    });

    if (apiRes.success && apiRes.user) {
      onLogin(apiRes.user);
      setIsSubmitting(false);
      setSuccessToast(`Account created! Welcome to genericMed, ${apiRes.user.name}.`);

      if (apiRes.user.role === 'patient') {
        onNavigate('consumer-web');
      } else if (apiRes.user.role === 'pharmacist') {
        onNavigate('clinical-os');
      } else {
        onNavigate('catalog-bioeq');
      }
      return;
    }

    if (apiRes.error) {
      setErrorMessage(apiRes.error);
      setIsSubmitting(false);
      return;
    }

    // Local Fallback
    const initials = regName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      role: selectedRole,
      phone: regPhone || '+1 (512) 555-0100',
      avatar: initials || 'GM',
      patientId: selectedRole === 'patient' ? `PT-${Math.floor(1000 + Math.random() * 9000)}-TX` : undefined,
      dob: regDob || (selectedRole === 'patient' ? 'Jan 1, 1990' : undefined),
      npiNumber: selectedRole === 'pharmacist' ? regNpi || '1849204819' : undefined,
      licenseState: selectedRole === 'pharmacist' ? regLicense || 'TX - Valid' : undefined,
      facilityName:
        selectedRole === 'pharmacist'
          ? regFacility || 'MediQuick Pharmacy Hub #042'
          : selectedRole === 'wholesaler'
          ? regCompanyName || 'Cipla Bio-Generics Inc.'
          : 'Austin Community Node #042',
      createdAt: new Date().toISOString().split('T')[0],
      twoFactorEnabled: true,
    };

    onLogin(newUser);
    setIsSubmitting(false);
    setSuccessToast(`Account created! Welcome to genericMed, ${newUser.name}.`);

    if (newUser.role === 'patient') {
      onNavigate('consumer-web');
    } else if (newUser.role === 'pharmacist') {
      onNavigate('clinical-os');
    } else {
      onNavigate('catalog-bioeq');
    }
  };


  const handleSendResetEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) {
      return;
    }
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setShowForgotModal(false);
      setSuccessToast(`Password reset link transmitted to ${resetEmail}`);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10">
        {/* Top Header Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-850 to-slate-900 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
                <span className="material-symbols-outlined text-2xl font-bold">medication</span>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">
                  generic<span className="text-emerald-400">Med</span>
                </span>
                <span className="ml-2 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Health OS Access
                </span>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl transition-colors cursor-pointer"
                title="Close"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </div>

          <h1 className="text-lg sm:text-xl font-black text-white">
            {authMode === 'login' ? 'Sign In to Your Health Node' : 'Create Your genericMed Account'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            21 CFR Part 11 & HIPAA §164.502 End-to-End Cryptographically Sealed Access
          </p>

          {/* Quick Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 mt-5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Sign In (Login)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>Register (New Account)</span>
            </button>
          </div>
        </div>

        {/* Form Body Area */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Current Session Quick Card (If already logged in) */}
          {currentUser && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
                  {currentUser.avatar || 'GM'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{currentUser.name}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded uppercase font-mono font-bold">
                      {currentUser.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{currentUser.email}</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Role Context Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                Select Your Access Role
              </label>
              <span className="text-[10px] text-emerald-400 font-mono">RBAC Security Group</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('patient');
                  if (authMode === 'login') {
                    setLoginIdentifier('sarah.jenkins@healthmail.com');
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRole === 'patient'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-xl mb-1 text-emerald-400">person</span>
                <div>
                  <div className="text-xs font-black text-white">Patient</div>
                  <div className="text-[10px] text-slate-400 leading-tight">Rx Vault & Savings</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('pharmacist');
                  if (authMode === 'login') {
                    setLoginIdentifier('aris.thorne@mediquick-rx.com');
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRole === 'pharmacist'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-xl mb-1 text-blue-400">local_pharmacy</span>
                <div>
                  <div className="text-xs font-black text-white">Pharmacist</div>
                  <div className="text-[10px] text-slate-400 leading-tight">Dispense Queue</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('wholesaler');
                  if (authMode === 'login') {
                    setLoginIdentifier('supply.lead@cipla-generics.com');
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRole === 'wholesaler'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-xl mb-1 text-amber-400">factory</span>
                <div>
                  <div className="text-xs font-black text-white">Wholesaler</div>
                  <div className="text-[10px] text-slate-400 leading-tight">ANDA & Supply</div>
                </div>
              </button>
            </div>
          </div>

          {/* Error Message Strip */}
          {errorMessage && (
            <div className="bg-rose-950/60 border border-rose-500/40 text-rose-300 px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <span className="material-symbols-outlined text-base text-rose-400 shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ======================= LOGIN FORM ======================= */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* One-Click Quick Login Demo Chips */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold">1-Click Instant Demo Login:</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Instant Access</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('patient')}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-xl text-xs text-slate-200 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Patient (Sarah)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('pharmacist')}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl text-xs text-slate-200 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>PharmD (Dr. Thorne)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('wholesaler')}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-xl text-xs text-slate-200 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Wholesaler (Cipla)</span>
                  </button>
                </div>
              </div>

              {/* Identifier Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {selectedRole === 'pharmacist'
                    ? 'Work Email or NPI Number'
                    : selectedRole === 'wholesaler'
                    ? 'B2B Account Email or FDA FEI #'
                    : 'Email, Phone Number, or Patient ID'}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-lg">
                    alternate_email
                  </span>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. sarah.jenkins@healthmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl text-xs text-white placeholder-slate-600 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-lg">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your confidential password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl text-xs text-white placeholder-slate-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Security & Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-500 bg-slate-950 border-slate-700"
                  />
                  <span>Remember this device (2FA Trusted)</span>
                </label>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <span className="material-symbols-outlined text-xs text-emerald-400">fingerprint</span>
                  <span>WebAuthn Ready</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">
                  {isSubmitting ? 'progress_activity' : 'lock_open'}
                </span>
                <span>{isSubmitting ? 'Authenticating Credentials...' : 'Sign In to genericMed'}</span>
              </button>

              {/* Federated SSO Healthcare Divison */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500">
                    Or Connect With Clinical SSO
                  </span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(selectedRole)}
                    className="p-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-emerald-400">health_and_safety</span>
                    <span>Epic MyChart EHR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(selectedRole)}
                    className="p-2.5 bg-slate-950 hover:bg-slate-855 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-blue-400">badge</span>
                    <span>ID.me Clinician</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ======================= REGISTER FORM ======================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Full Legal Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-lg">
                      badge
                    </span>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl text-xs text-white placeholder-slate-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-lg">
                      mail
                    </span>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl text-xs text-white placeholder-slate-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Mobile Phone (for Refill SMS)</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-lg">
                      phone
                    </span>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+1 (512) 555-0192"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl text-xs text-white placeholder-slate-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Patient / Pharmacist Specific Field 1 */}
                {selectedRole === 'patient' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">Date of Birth</label>
                    <input
                      type="text"
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      placeholder="e.g. May 14, 1984"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl text-xs text-white placeholder-slate-600 transition-colors"
                    />
                  </div>
                )}

                {selectedRole === 'pharmacist' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">NPI (10-Digit ID)</label>
                    <input
                      type="text"
                      value={regNpi}
                      onChange={(e) => setRegNpi(e.target.value)}
                      placeholder="e.g. 1948201948"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl text-xs text-white placeholder-slate-600 transition-colors font-mono"
                    />
                  </div>
                )}

                {selectedRole === 'wholesaler' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">Manufacturer Entity</label>
                    <input
                      type="text"
                      value={regCompanyName}
                      onChange={(e) => setRegCompanyName(e.target.value)}
                      placeholder="e.g. Cipla Therapeutics Ltd."
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl text-xs text-white placeholder-slate-600 transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* Role-Specific Secondary Fields */}
              {selectedRole === 'patient' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">Delivery Zip Code</label>
                    <input
                      type="text"
                      value={regZip}
                      onChange={(e) => setRegZip(e.target.value)}
                      placeholder="e.g. 78701"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">Primary Micro-Hub</label>
                    <div className="text-xs font-semibold text-emerald-400 bg-slate-950 border border-slate-800 py-2 px-3 rounded-2xl">
                      Austin Central Node #042
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'pharmacist' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">State License & State</label>
                    <input
                      type="text"
                      value={regLicense}
                      onChange={(e) => setRegLicense(e.target.value)}
                      placeholder="TX - #84920"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">Dispensing Hub Node</label>
                    <input
                      type="text"
                      value={regFacility}
                      onChange={(e) => setRegFacility(e.target.value)}
                      placeholder="MediQuick Hub #042"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Passwords and Strength Gauge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Create Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl text-xs text-white placeholder-slate-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Confirm Password</label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl text-xs text-white placeholder-slate-600"
                  />
                </div>
              </div>

              {/* Real-time Password Strength Meter */}
              {regPassword.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Security Strength:</span>
                    <span
                      className={`font-black uppercase ${
                        passwordStrength <= 1
                          ? 'text-rose-400'
                          : passwordStrength <= 2
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {passwordStrength <= 1 ? 'Weak' : passwordStrength <= 2 ? 'Moderate' : 'Strong & Encrypted'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                    <div
                      className={`h-full flex-1 rounded-full ${
                        passwordStrength >= 1 ? 'bg-rose-500' : 'bg-transparent'
                      }`}
                    ></div>
                    <div
                      className={`h-full flex-1 rounded-full ${
                        passwordStrength >= 2 ? 'bg-amber-500' : 'bg-transparent'
                      }`}
                    ></div>
                    <div
                      className={`h-full flex-1 rounded-full ${
                        passwordStrength >= 3 ? 'bg-teal-500' : 'bg-transparent'
                      }`}
                    ></div>
                    <div
                      className={`h-full flex-1 rounded-full ${
                        passwordStrength >= 4 ? 'bg-emerald-500' : 'bg-transparent'
                      }`}
                    ></div>
                  </div>
                </div>
              )}

              {/* HIPAA & Part 11 Consent Checkbox */}
              <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToHipaa}
                  onChange={(e) => setAgreedToHipaa(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-emerald-500 bg-slate-950 border-slate-700"
                />
                <span className="text-[11px] text-slate-300 leading-snug">
                  I acknowledge and consent to 256-bit encrypted health data storage under{' '}
                  <span className="text-emerald-400 font-bold">HIPAA §164.502</span> and 21 CFR Part 11
                  electronic record compliance.
                </span>
              </label>

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">
                  {isSubmitting ? 'progress_activity' : 'how_to_reg'}
                </span>
                <span>
                  {isSubmitting
                    ? 'Provisioning Encrypted Health Node...'
                    : `Create ${selectedRole.toUpperCase()} Account`}
                </span>
              </button>
            </form>
          )}

          {/* Guest Pass Shortcut */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Just exploring genericMed?</span>
            <button
              type="button"
              onClick={() => onNavigate('consumer-web')}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Continue as Guest Patient</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-emerald-400">key</span>
                <h3 className="text-sm font-black text-white">Reset Secure Password</h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter the email address or phone linked to your genericMed Health Node. We will transmit a cryptographically signed recovery token.
            </p>

            {resetSuccess ? (
              <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-emerald-400">mark_email_read</span>
                <div>
                  <div className="font-bold">Recovery Link Transmitted</div>
                  <div>Check your inbox or SMS for your 6-digit PIN.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendResetEmail} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Account Email / Phone</label>
                  <input
                    type="text"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. sarah.jenkins@healthmail.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-600"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Send Recovery Code
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
