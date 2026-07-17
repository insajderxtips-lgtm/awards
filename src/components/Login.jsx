import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';
import RiotWindow from './RiotWindow';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRiot, setShowRiot] = useState(false);
  const [lang, setLang] = useState('en');

  const translations = {
    en: { heading: 'Sign In', sub: 'Synchronize your profile to instantly access and track your campaign rewards.', btn: 'Continue with Riot Games', conn: 'Connecting...', note: 'Secure End-to-End Encryption Verified' },
    pl: { heading: 'Zaloguj się', sub: 'Zsynchronizuj swój profil, aby natychmiast uzyskać dostęp do nagród.', btn: 'Zaloguj się przez Riot Games', conn: 'Łączenie...', note: 'Połączenie szyfrowane SSL' },
    sr: { heading: 'Prijava', sub: 'Sinhronizujte svoj profil da odmah pristupite i pratite nagrade.', btn: 'Nastavi sa Riot Games nalogom', conn: 'Povezivanje...', note: 'Verifikovan bezbednosni enkripcioni sloj' }
  };

  const t = translations[lang] || translations['en'];

  const handleRiotLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowRiot(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#030108] text-slate-200 font-sans font-light antialiased relative flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,7,32,0.7),#030108)] pointer-events-none" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-purple-600/10 via-fuchsia-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#140e24_1px,transparent_1px),linear-gradient(to_bottom,#140e24_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="absolute top-6 right-6 z-20">
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-[#0b0616]/60 text-white border border-purple-500/20 rounded-lg p-2 text-sm outline-none cursor-pointer backdrop-blur-md">
          <option value="en">EN</option>
          <option value="pl">PL</option>
          <option value="sr">SR</option>
        </select>
      </div>

      <div className={`w-full max-w-[500px] relative z-10 transition-all duration-500 ${showRiot ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>
        <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-b from-[#0e071c]/90 to-[#06020e]/95 border border-purple-500/20 shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden">
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.25)] mb-4">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-extralight tracking-wide text-white mb-3">{t.heading}</h1>
            <p className="text-sm text-purple-200/50 font-light leading-relaxed max-w-sm">{t.sub}</p>
          </div>
          <button onClick={handleRiotLogin} disabled={isLoading} className="w-full h-12 flex items-center justify-center gap-3 px-6 bg-gradient-to-r from-[#eb2a30] to-[#c8191e] hover:from-[#f4363c] hover:to-[#d62025] disabled:from-zinc-800 disabled:to-zinc-900 text-white font-medium tracking-widest uppercase text-xs rounded-xl transition-all duration-300">
            {isLoading ? t.conn : t.btn}
          </button>
        </div>
      </div>

      {showRiot && <RiotWindow onClose={() => setShowRiot(false)} />}
    </div>
  );
};

export default Login;