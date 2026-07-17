import React, { useState } from 'react';
import { Gift, AlertCircle, Loader2 } from 'lucide-react';
import GmailWindow from './GmailWindow';

const Dashboard = () => {
  const [step, setStep] = useState(1);
  const [showGmail, setShowGmail] = useState(false);
  const [loadingGmail, setLoadingGmail] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
    } else if (email.length <= 6) {
      setError("Email must be longer than 6 characters.");
    } else if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
      window.location.href = '/';
    }
  };

  const handleGmailClick = () => {
    setLoadingGmail(true);
    setTimeout(() => {
      setLoadingGmail(false);
      setShowGmail(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#030108] text-slate-200 font-sans font-light antialiased relative flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,7,32,0.7),#030108)] pointer-events-none" />
      
      {/* The Dashboard Card */}
      <div className="w-full max-w-[500px] relative z-10 p-8 md:p-10 rounded-3xl bg-gradient-to-b from-[#0e071c]/90 to-[#06020e]/95 border border-purple-500/20 shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {step === 1 && (
          <div className="text-center animate-in fade-in duration-700">
            <Gift className="w-10 h-10 text-fuchsia-400 mx-auto mb-8" />
            <h1 className="text-3xl font-extralight text-white mb-4">Hello! Thank you for joining!</h1>
            <button onClick={() => setStep(2)} className="w-full h-12 bg-white text-black font-medium rounded-xl hover:bg-fuchsia-100 transition-all">Let's get started</button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h1 className="text-xl text-white">What should we call you?</h1>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-12 px-5 bg-[#0b0616] border border-purple-500/20 rounded-xl" />
            <button onClick={() => username.length >= 3 && setStep(3)} className="w-full h-12 bg-purple-600 rounded-xl">Continue</button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h1 className="text-xl text-white">Hi, {username}!</h1>
            {error && <div className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4"/> {error}</div>}
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full h-12 px-5 bg-[#0b0616] border border-purple-500/20 rounded-xl" />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full h-12 px-5 bg-[#0b0616] border border-purple-500/20 rounded-xl" />
            <button onClick={handleVerify} className="w-full h-12 bg-white text-black rounded-xl">Verify & Claim</button>
            <button onClick={handleGmailClick} className="w-full h-12 flex items-center justify-center gap-3 border border-purple-500/20 rounded-xl">
              {loadingGmail ? <Loader2 className="animate-spin"/> : <><img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5" /> Sign in with Google</>}
            </button>
          </div>
        )}
      </div>

      {/* Pop-up Window */}
      {showGmail && <GmailWindow onClose={() => setShowGmail(false)} />}
    </div>
  );
};

export default Dashboard;