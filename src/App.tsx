import React, { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ChevronRight, 
  Fingerprint, 
  Info,
  Send,
  Globe,
  Compass,
  ShieldCheck,
  TrendingUp,
  Calendar,
  MapPin,
  Map,
  ExternalLink,
  Cpu,
  Layers,
  ArrowRight
} from "lucide-react";

// Types for CGA restricted portal state
type ActiveOverlay = "none" | "about" | "details";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

export default function App() {
  const [overlay, setOverlay] = useState<ActiveOverlay>("none");
  const [pageView, setPageView] = useState<"restricted" | "compliance-notice" | "expansion">("restricted");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Welcome to CGA Trades compliance resolution. We detected an unauthorized regional access from your IP. How can we assist your institution?",
      time: "22:55"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState("2026-05-23 22:55:06 UTC");
  const isDark = false;

  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname;
  });
  const [isVerifying, setIsVerifying] = useState(() => {
    return window.location.pathname !== "/404-regional-restriction";
  });
  const [verificationStep, setVerificationStep] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Routing auto-redirection transition
  useEffect(() => {
    if (window.location.pathname !== "/404-regional-restriction") {
      // Begin smooth check sequence
      const intervals = [350, 750, 1150, 1550];
      intervals.forEach((delay, idx) => {
        setTimeout(() => {
          setVerificationStep(idx + 1);
        }, delay);
      });

      const finishTimer = setTimeout(() => {
        window.history.pushState({}, "", "/404-regional-restriction");
        setCurrentPath("/404-regional-restriction");
        setIsVerifying(false);
      }, 1900);

      return () => clearTimeout(finishTimer);
    } else {
      setIsVerifying(false);
    }
  }, []);

  // Sync back/forward button clicks
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path === "/404-regional-restriction") {
        setIsVerifying(false);
        setPageView("restricted");
      } else if (path === "/compliance-notice") {
        setIsVerifying(false);
        setPageView("compliance-notice");
      } else if (path === "/cga-global-expansion") {
        setIsVerifying(false);
        setPageView("expansion");
      } else {
        setIsVerifying(true);
        setVerificationStep(0);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // System dark-theme auto-detection disabled. Permanent Light Mode enforced.

  // Sync Timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formatted = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
      setCurrentTime(formatted);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync scroll for chatbot
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Track Mouse movement for gentle elegant spotlight reflection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Quick reply handler for interactive chatbot
  const handleQuickReply = (replyText: string, customBotResponse: string) => {
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: customBotResponse,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText("");

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Smart responses based on typed text
    setTimeout(() => {
      setIsTyping(false);
      let response = "We have logged this query to our regional underwriters. Due to stringent securities protection frameworks, we cannot authorize open logins from your geographical coordinate without prior manual whitelisting.";
      
      const textLower = userText.toLowerCase();
      if (textLower.includes("institution") || textLower.includes("accredited") || textLower.includes("partnership")) {
        response = "For accredited institutions or sovereign purchasers, please request manual whitelist certificate forms by contacting our regional lead at compliance@cga-trades.com.";
      } else if (textLower.includes("whitelist") || textLower.includes("ip") || textLower.includes("bypass")) {
        response = "Manual IP whitelist requests are evaluated under CFTC § 4.7 & SEC Reg D guidelines. CGA Trades will verify legal entity credentials within 48 business hours.";
      } else if (textLower.includes("hello") || textLower.includes("hi")) {
        response = "Hello. How can we assist your team with compliance or institutional clearance today?";
      }

      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: response,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1100);
  };

  return (
    <div 
      className={`relative min-h-screen w-full flex flex-col items-center justify-start font-sans overflow-x-hidden select-none transition-all duration-700 ease-in-out px-4 py-8 md:px-8 md:py-16 ${
        isDark 
          ? "bg-[#09090b] text-zinc-100" 
          : "bg-zinc-50 text-zinc-800"
      }`}
      id="cga-landing-root"
    >
      {/* Absolute Micro Grid overlay for premium fintech feel */}
      <div className={`absolute inset-0 bg-dot-pattern pointer-events-none transition-opacity duration-700 z-0 ${
        isDark ? "opacity-[0.15]" : "opacity-[0.45]"
      }`} />

      {/* Extreme Low-Opacity Background Globe Wireframe Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 250, repeat: Infinity, ease: "linear" }}
          className={`w-[850px] h-[850px] md:w-[1100px] md:h-[1100px] transition-all duration-700 ${
            isDark ? "opacity-[0.02] text-zinc-200" : "opacity-[0.035] text-zinc-950"
          }`}
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.4" className="w-full h-full">
            <circle cx="50" cy="50" r="48" strokeDasharray="1.5 1.5" />
            <circle cx="50" cy="50" r="38" />
            <circle cx="50" cy="50" r="24" strokeDasharray="3 2" />
            <path d="M50,2 L50,98 M2,50 L98,50" />
            <path d="M10,25 Q50,48 90,25" strokeDasharray="2 1" />
            <path d="M10,75 Q50,52 90,75" strokeDasharray="2 1" />
            <path d="M22,10 Q48,50 22,90" strokeDasharray="2 1" />
            <path d="M78,10 Q52,50 78,90" strokeDasharray="2 1" />
          </svg>
        </motion.div>
      </div>

      {/* Spot reflection element following cursor for a modern glassy aura */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-300 z-0"
        style={{
          background: isDark
            ? `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(47, 12, 108, 0.15), rgba(0, 0, 0, 0) 50%, transparent 100%)`
            : `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(47, 12, 108, 0.04), rgba(0, 0, 0, 0.008) 50%, transparent 100%)`,
        }}
      />

      {/* Branding Header on Bare Page Background (Top Left in Desktop layout, normal flow) */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center mb-8 md:mb-12 px-2 md:px-4 z-30 select-none">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => {
            if (pageView === "expansion" || pageView === "compliance-notice") {
              setPageView("restricted");
              window.history.pushState({}, "", "/404-regional-restriction");
            }
          }}
        >
          <img 
            src="https://i.imgur.com/u7ADhK0.png" 
            alt="CGA Trades" 
            className="w-8 h-8 object-contain select-none filter dark:brightness-110 animate-spin"
            style={{ animationDuration: '10s' }}
            referrerPolicy="no-referrer"
          />
          <span className={`font-display font-extrabold text-[15px] md:text-[17px] uppercase tracking-[0.24em] transition-colors duration-500 ${
            isDark ? "text-zinc-100" : "text-zinc-950"
          }`}>
            CGA Trades
          </span>
        </motion.div>

        {/* Global Nav Actions */}
        <div className="flex items-center space-x-4">
          {(pageView === "expansion" || pageView === "compliance-notice") && (
            <button
              onClick={() => {
                setPageView("restricted");
                window.history.pushState({}, "", "/404-regional-restriction");
              }}
              className="text-[11px] font-sans font-bold flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer shadow-md border-[#2F0C6C]/40 text-[#2F0C6C] bg-white hover:bg-[#2F0C6C]/5 hover:border-[#2F0C6C]"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* Main Dynamic Router Content Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center z-20 relative overflow-visible px-2 md:px-4">
        <AnimatePresence mode="wait">
          {isVerifying ? (
          <motion.div
            key="verification-routing-gate"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-[calc(100%-1.5rem)] sm:max-w-[420px] rounded-3xl border transition-all duration-700 py-10 px-6 sm:px-8 md:py-12 md:px-10 flex flex-col items-center relative z-20 mx-auto ${
              isDark 
                ? "bg-[#0c0c0e]/80 backdrop-blur-xl border-zinc-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.5)] shadow-primary/5 text-zinc-100" 
                : "bg-white border-zinc-200/85 shadow-[0_20px_50px_rgba(0,0,0,0.03)] text-zinc-800"
            }`}
          >
            {/* Spinning radar visual indicator */}
            <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
              <span className={`absolute inset-0 rounded-full border-2 border-dashed border-t-primary animate-spin ${
                isDark ? "border-zinc-805" : "border-zinc-200"
              }`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDark ? "bg-zinc-950 border border-zinc-800" : "bg-zinc-50 border border-zinc-100"
              }`}>
                <Fingerprint className={`w-5 h-5 animate-pulse ${isDark ? "text-primary/70" : "text-primary-dark"}`} />
              </div>
            </div>

            {/* Verification header */}
            <h2 className={`font-sans text-[14px] md:text-[15px] font-bold text-center tracking-[0.1em] uppercase mb-1.5 ${
              isDark ? "text-zinc-100" : "text-zinc-950"
            }`}>
              Security Handshake
            </h2>
            <p className={`text-center text-[10px] font-mono uppercase tracking-widest mb-6 ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}>
              Verifying Regional Compliance...
            </p>

            {/* Compliance Matrix logs */}
            <div className={`w-full p-4 rounded-xl border font-mono text-[9.5px] leading-relaxed space-y-2 mb-6 ${
              isDark ? "bg-[#09090b]/40 border-zinc-805/90 text-zinc-400" : "bg-zinc-50/80 border-zinc-200/40 text-zinc-500"
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold">INITIAL SECURE LINK:</span>
                <span className="text-primary font-bold font-mono">100% SUCCESS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold">ACCESSTIME SYNC DETECT:</span>
                <span className="text-zinc-400 font-mono">2026-05-23 VALID</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold">RESOLVING ORIGIN GEODB:</span>
                <span className={verificationStep >= 1 ? "text-primary font-bold font-mono" : "text-zinc-500/60"}>
                  {verificationStep >= 1 ? "MAPPED [RESTRICTED REGION]" : "RESOLVING..."}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold">FINANCIAL COMPLIANCE POLICY:</span>
                <span className={verificationStep >= 2 ? "text-primary font-bold font-mono" : "text-zinc-500/60"}>
                  {verificationStep >= 2 ? "CFTC SUBPART C / SEC REG D ACTIVE" : "AWAITING..."}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold">MANDATE PARAMS GEOFENCE:</span>
                <span className={verificationStep >= 3 ? "text-red-500 font-bold animate-pulse" : "text-zinc-500/60"}>
                  {verificationStep >= 3 ? "SYSTEM ACCESS EXCLUDED" : "AWAITING..."}
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-1.5 border-dashed border-zinc-700/30">
                <span className="text-zinc-500 font-bold">RESOLVED ROUTE PATH:</span>
                <span className={verificationStep >= 4 ? "text-primary font-bold font-mono" : "text-zinc-505/60"}>
                  {verificationStep >= 4 ? "/404-regional-restriction" : "PENDING..."}
                </span>
              </div>
            </div>

            {/* Progress line */}
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${
              isDark ? "bg-zinc-800" : "bg-zinc-200"
            }`}>
              <motion.div 
                className="h-full bg-primary rounded-full"
                animate={{ width: `${Math.min(verificationStep * 25 + 5, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        ) : pageView === "restricted" ? (
          <motion.div
            key="restriction-content"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex items-center justify-center overflow-visible"
          >
            {/* Main Responsive Split Screen Layout Area */}
            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-6 md:py-12 flex items-center justify-center z-10 relative select-none overflow-visible">
              
              {/* Split container (Desktop side-by-side, mobile stacked beautifully) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 w-full items-center overflow-visible">
                
                {/* LEFT COLUMN: Animated High-Fidelity Robot Illustration Area */}
                <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center relative overflow-visible">
                  
                  {/* Custom Interactive SVG Robot Illustration with smooth hover flotation loop */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.94, y: 15 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      y: [0, -12, 0]
                    }}
                    transition={{ 
                      opacity: { duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
                      scale: { duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
                      y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[540px] xl:max-w-[600px] aspect-[4/3] flex items-center justify-center relative overflow-visible mb-6 lg:mb-0"
                  >
                    {/* Dynamic Speech bubble floating above with safe responsive scaling */}
                    <div className="absolute -top-10 left-[5%] sm:left-[10%] md:left-[14%] z-20 animate-bubble-float scale-90 sm:scale-110 md:scale-135 origin-bottom-left select-none">
                      <div className="bg-[#38bdf8] text-white px-6 py-2.5 rounded-2xl font-mono font-bold text-sm tracking-wider shadow-lg flex items-center space-x-1 border-2 border-sky-300">
                        <span className="text-white text-[15px] md:text-[18px] tracking-widest font-mono font-bold">404</span>
                        <span className="animate-pulse text-white/90 text-[13px] md:text-[15px]">...</span>
                      </div>
                      {/* Speech tail */}
                      <div className="w-3.5 h-3.5 bg-[#38bdf8] rotate-45 transform origin-top-left ml-7 -mt-1.5 border-r border-b border-sky-400"></div>
                    </div>

                    {/* High precision vector robot matching user request */}
                    <svg 
                      viewBox="0 0 450 380" 
                      className="w-full h-full drop-shadow-[0_12px_28px_rgba(59,130,246,0.06)] overflow-visible"
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Ambient glow behind collision point */}
                      <circle cx="160" cy="270" r="50" fill="url(#impactGlow)" className="animate-spark-shimmer" />

                      {/* Shards on bottom left impact point */}
                      <g className="animate-spark-shimmer">
                        {/* Left pointing shard */}
                        <polygon points="110,240 135,260 100,285" fill="url(#crystalLight)" stroke="#93c5fd" strokeWidth="1" />
                        {/* Center pointing massive crystal */}
                        <polygon points="150,200 180,265 130,270" fill="url(#crystalDark)" stroke="#60a5fa" strokeWidth="1.2" />
                        {/* Smaller spark accent */}
                        <polygon points="175,230 195,255 178,265" fill="#38bdf8" opacity="0.85" />
                        {/* Tiny crystals */}
                        <polygon points="210,265 220,275 200,278" fill="#93c5fd" opacity="0.6" />
                        <polygon points="85,268 100,276 90,282" fill="#60a5fa" opacity="0.7" />
                      </g>

                      {/* Ground fracture cracks */}
                      <path d="M60,275 C100,275 120,268 150,272 C170,275 190,278 230,275" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                      <path d="M125,270 L140,285" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M172,274 L185,290" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />

                      {/* ROBOT CHARACTER CONTAINER */}
                      <g className="animate-robot-body">
                        
                        {/* Left Back Leg (angled back) */}
                        <path d="M265,220 L300,265 L320,260" stroke="#1e3a8a" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                        <ellipse cx="320" cy="260" rx="6" ry="4" fill="#1d4ed8" />

                        {/* Right Front Leg (bent, tripping forward) */}
                        <path d="M210,225 L180,210 L195,260 L180,265" stroke="#1e3a8a" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                        <ellipse cx="180" cy="265" rx="8" ry="4.5" fill="#2563eb" />

                        {/* spring neck */}
                        <path d="M239,122 L245,127 L237,132 L245,137 L239,142" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" />

                        {/* Curved mechanical torso body */}
                        <path d="M195,142 C195,142 285,130 290,165 C295,200 280,225 240,225 C200,225 195,190 195,142 Z" fill="url(#metallicTorso)" />
                        
                        {/* Torso glass badge detailing */}
                        <rect x="215" y="165" width="45" height="15" rx="5" fill="#1e293b" opacity="0.9" />
                        {/* Real light sensor dots */}
                        <circle cx="222" cy="172.5" r="2" fill="#38bdf8" />
                        <circle cx="230" cy="172.5" r="2" fill="#38bdf8" />
                        <circle cx="238" cy="172.5" r="2" fill="#38bdf8" />
                        <circle cx="246" cy="172.5" r="2" fill="#ef4444" className="animate-pulse" />

                        {/* Left arm swung backward holding gray wrench */}
                        <path d="M205,155 L165,178 L160,205" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round" />
                        {/* Wrench graphic */}
                        <g transform="translate(145, 195) rotate(-20)">
                          <rect x="10" y="5" width="22" height="5" rx="1.5" fill="#64748b" />
                          <path d="M5,2.5 C5,5 12,7.5 12,7.5 L12,2.5 C12,2.5 5,0 5,2.5 Z" fill="#94a3b8" />
                          <circle cx="28" cy="7.5" r="5.5" fill="#475569" />
                          <circle cx="28" cy="7.5" r="3" fill="#e2e8f0" />
                        </g>

                        {/* Right arm outstretched forward */}
                        <path d="M280,150 L320,180 L350,185" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round" />
                        {/* Hand wave */}
                        <circle cx="352" cy="185" r="4.5" fill="#2563eb" />
                        <line x1="352" y1="181" x2="355" y2="177" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                        <line x1="355" y1="185" x2="361" y2="185" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                        <line x1="354" y1="188" x2="359" y2="191" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />

                        {/* ROBOT HEAD (WITH DENIAL ANIMATION) */}
                        <g className="animate-robot-head">
                          {/* Head base */}
                          <path d="M198,82 C198,72 208,62 218,62 L268,62 C278,62 288,72 288,82 L288,110 C288,118 278,124 268,124 L218,124 C208,124 198,118 198,110 Z" fill="url(#metallicHead)" />
                          
                          {/* Antenna */}
                          <line x1="243" y1="62" x2="243" y2="40" stroke="#64748b" strokeWidth="3.5" />
                          <circle cx="243" cy="38" r="5" fill="#e11d48" className="animate-pulse" />
                          
                          {/* Golden radio frequency wave arch */}
                          <path d="M233,33 C236,28 250,28 253,33" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
                          <path d="M228,27 C233,18 253,18 258,27" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

                          {/* Dark display visor */}
                          <rect x="208" y="73" width="70" height="32" rx="7" fill="#0f172a" />
                          
                          {/* Lit up neon cyan glowing scanning line eyes */}
                          <rect x="216" y="85" width="54" height="6" rx="3" fill="#22d3ee" className="shadow-lg" />
                          <rect x="228" y="86.5" width="30" height="3" rx="1.5" fill="#ffffff" />
                        </g>

                      </g>

                      {/* SVG Definitions */}
                      <defs>
                        <radialGradient id="impactGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </radialGradient>
                        
                        <linearGradient id="crystalLight" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#dbeafe" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                        </linearGradient>

                        <linearGradient id="crystalDark" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#93c5fd" />
                          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.7" />
                        </linearGradient>

                        <linearGradient id="metallicTorso" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="50%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#1e3a8a" />
                        </linearGradient>

                        <linearGradient id="metallicHead" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#93c5fd" />
                          <stop offset="40%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                      </defs>
                    </svg>

                  </motion.div>
                </div>

                {/* RIGHT COLUMN: Pristine Restricted Access Core Card */}
                <div className="col-span-1 lg:col-span-6 flex justify-center pt-14 lg:pt-0">
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full max-w-[540px] rounded-3xl border transition-all duration-700 pt-20 pb-10 px-8 md:pt-24 md:pb-12 md:px-11 flex flex-col items-center relative ${
                      isDark 
                        ? "bg-zinc-900/45 backdrop-blur-xl border-zinc-800/80 shadow-[0_25px_70px_rgba(0,0,0,0.6)] shadow-primary/5 text-zinc-100" 
                        : "bg-white border-zinc-200/85 shadow-[0_20px_60px_rgba(0,0,0,0.04)] text-zinc-800"
                    }`}
                    id="compliance-restriction-panel"
                  >
                    {/* Luxury dark mode atmospheric glow */}
                    {isDark && (
                      <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-3xl -z-10 transition-opacity duration-1000 pointer-events-none" />
                    )}
                    
                    {/* Premium Warning Centerpiece Indicator Breaking Outside the Card */}
                    <div className="absolute -top-[70px] left-1/2 -translate-x-1/2 z-20">
                      {/* Micro orbit tracking glow pulse */}
                      <div className="absolute inset-0 bg-red-500/25 blur-2xl rounded-full scale-120 animate-pulse transition-all duration-1000" />
                      
                      {/* Huge realistic 2D warning triangle with glossy layers and drop shadow */}
                      <motion.div 
                        animate={{ 
                          y: [0, -4, 0],
                          scale: [1, 1.015, 1]
                        }}
                        transition={{ 
                          duration: 4.5, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="w-32 h-32 relative flex items-center justify-center filter drop-shadow-[0_12px_28px_rgba(239,68,68,0.35)] hover:scale-105 transition-all duration-300 pointer-events-auto cursor-pointer"
                      >
                        <svg viewBox="0 0 100 88" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            {/* Gradient for the main outer orange/yellow gloss border */}
                            <linearGradient id="warningBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ef4444" />
                              <stop offset="45%" stopColor="#dc2626" />
                              <stop offset="100%" stopColor="#991b1b" />
                            </linearGradient>

                            {/* Inner warning body gradient for rich compliance alert colors */}
                            <linearGradient id="warningInnerGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                              <stop offset="0%" stopColor="#fecaca" />
                              <stop offset="15%" stopColor="#ef4444" />
                              <stop offset="100%" stopColor="#7f1d1d" />
                            </linearGradient>

                            {/* Mirror gloss highlight overlay */}
                            <linearGradient id="warningGlossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                              <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
                            </linearGradient>

                            {/* Exclamation shadow */}
                            <filter id="exclamationShadow" x="-20%" y="-20%" width="140%" height="140%">
                              <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#000000" floodOpacity="0.3" />
                            </filter>
                          </defs>

                          {/* Outer ambient warning glow shape */}
                          <path 
                            d="M44.5 5.5c2.5-4.3 8.5-4.3 11 0l39.5 68.3c2.5 4.3-.5 9.7-5.5 9.7H10.5c-5 0-8-5.4-5.5-9.7L44.5 5.5z" 
                            fill="#ef4444" 
                            opacity="0.12" 
                            className="blur-sm"
                          />

                          {/* Outer high-precision glossy premium border triangle */}
                          <path 
                            d="M44.5 5.5c2.5-4.3 8.5-4.3 11 0l39.5 68.3c2.5 4.3-.5 9.7-5.5 9.7H10.5c-5 0-8-5.4-5.5-9.7L44.5 5.5z" 
                            fill="url(#warningBorderGrad)" 
                          />

                          {/* Inner glossy core background */}
                          <path 
                            d="M45.8 8c1.8-3.1 6.6-3.1 8.4 0l37.2 64.3c1.8 3.1-.4 7-4.2 7H12.8c-3.8 0-6-3.9-4.2-7L45.8 8z" 
                            fill="url(#warningInnerGrad)" 
                          />

                          {/* Semi-transparent gloss overlay for physical realism */}
                          <path 
                            d="M50 3.3L12.8 79.3c0 0 32-15 37.2-46.3c3.8-22.9 0-33 0-33z" 
                            fill="url(#warningGlossGrad)" 
                            opacity="0.45"
                          />

                          {/* Bold exclamation mark with drop shadow */}
                          <g filter="url(#exclamationShadow)">
                            <path 
                              d="M47.8 29c0-1.2.9-2.2 2.2-2.2s2.2 1 2.2 2.2v19c0 1.2-.9 2.2-2.2 2.2s-2.2-1-2.2-2.2V29z" 
                              fill="#ffffff" 
                            />
                            <circle cx="50" cy="59.5" r="4" fill="#ffffff" />
                          </g>
                        </svg>
                      </motion.div>
                    </div>

                    {/* Headline */}
                    <h1 className={`font-sans text-[20.5px] md:text-[24px] font-bold text-center tracking-tight leading-snug mb-4 transition-colors duration-700 ${
                      isDark ? "text-zinc-100" : "text-zinc-900"
                    }`}>
                      Region Not Supported
                    </h1>

                    {/* Restored Original Specific Compliance Text */}
                    <div className={`w-full text-center sm:text-left font-sans text-[13.5px] md:text-[14.5px] leading-relaxed mb-8 transition-all duration-700 ${
                      isDark ? "text-zinc-300" : "text-zinc-600"
                    }`}>
                      <p>
                        This site is currently unavailable in your location due to regional compliance policies, financial regulations, and service restrictions.
                      </p>
                    </div>

                     {/* Read About Restriction Button */}
                     <button
                       onClick={() => {
                         setPageView("compliance-notice");
                         window.history.pushState({}, "", "/compliance-notice");
                       }}
                       className={`w-full h-11 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-350 cursor-pointer shadow-md flex items-center justify-center gap-1.5 group active:scale-[0.98] ${
                         isDark 
                           ? "bg-primary text-zinc-950 hover:bg-primary-hover hover:scale-[1.015] shadow-[0_4px_20px_rgba(176,230,19,0.22)] hover:shadow-[0_6px_25px_rgba(176,230,19,0.35)] border border-primary/20" 
                           : "bg-primary text-zinc-950 hover:bg-primary-hover hover:scale-[1.015] shadow-[0_4px_14px_rgba(123,155,13,0.15)] hover:shadow-[0_6px_20px_rgba(123,155,13,0.24)] border border-primary/10"
                       }`}
                       id="btn-read-about-restriction"
                     >
                       Read About Restriction
                       <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                     </button>

                  </motion.div>
                </div>

              </div>
            </main>
          </motion.div>
        ) : pageView === "compliance-notice" ? (
          <motion.div
            key="compliance-notice-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 relative z-10 text-left select-none"
            id="compliance-notice-view"
          >
            {/* Page Header / Intro Hero */}
            <div className={`text-center md:text-left mb-10 md:mb-14 border-b pb-8 transition-colors duration-300 ${
              isDark ? "border-[#2F0C6C]/35" : "border-[#2F0C6C]/20"
            }`}>
              <span className={`text-[11.5px] font-mono tracking-[0.22em] uppercase font-bold px-4 py-2 rounded-full border inline-block mb-4 shadow-sm transition-colors duration-300 ${
                isDark 
                  ? "text-zinc-200 bg-[#2F0C6C]/20 border-[#2F0C6C]/60" 
                  : "text-[#2F0C6C] bg-[#2F0C6C]/5 border-[#2F0C6C]/30"
              }`}>
                Official Regulatory Disclosure
              </span>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col md:flex-row items-center md:justify-start gap-3">
                  <div className={`p-2.5 rounded-xl border animate-pulse shrink-0 ${
                    isDark 
                      ? "bg-[#2F0C6C]/20 border-[#2F0C6C]/55 text-zinc-100" 
                      : "bg-[#2F0C6C]/5 border-[#2F0C6C]/30 text-[#2F0C6C]"
                  }`}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h1 className={`font-display text-2xl md:text-4xl font-black tracking-tight leading-none text-center md:text-left transition-colors duration-300 ${
                    isDark ? "text-white" : "text-zinc-950"
                  }`}>
                    Restricted Regional Accessibility & U.S. Compliance Notice
                  </h1>
                </div>
              </div>
              <p className={`font-sans text-[14.5px] md:text-[17px] max-w-3xl leading-relaxed mt-4 text-center md:text-left transition-colors duration-300 ${
                isDark ? "text-zinc-350" : "text-zinc-600"
              }`}>
                CGA Capital Growth Alliance Regulatory Framework & Regional Access Guidance
              </p>
            </div>

            {/* Core Legal Article Content in modern financial tech style card */}
            <div className={`p-6 md:p-10 rounded-3xl border transition-all duration-500 shadow-2xl mb-12 space-y-8 ${
              isDark 
                ? "bg-zinc-900/40 backdrop-blur-md border-[#2F0C6C]/40 shadow-[#2F0C6C]/5" 
                : "bg-white/70 backdrop-blur-md border-[#2F0C6C]/20 shadow-xl shadow-[#2F0C6C]/5"
            }`} id="compliance-notice-article">
              
              {/* SECTION 1: Institutional Fiduciary Mandate */}
              <div className="space-y-3">
                <div className={`flex items-center space-x-2 font-bold font-sans text-base transition-colors duration-300 ${
                  isDark ? "text-zinc-100" : "text-zinc-900"
                }`}>
                  <span className="text-[#2F0C6C] font-mono font-black">01.</span>
                  <h3>Corporate & Institutional Mandate</h3>
                </div>
                <p className={`font-sans text-[13px] md:text-[14px] leading-relaxed transition-colors duration-300 ${
                  isDark ? "text-zinc-200" : "text-zinc-650"
                }`}>
                  CGA Trades is an international multi-asset absolute-return administrator and fiduciary, catering strictly to sovereign entities, accredited corporate allocators, and certified qualified purchasers globally.
                </p>
              </div>

              {/* Divider */}
              <div className={`h-px bg-gradient-to-r via-[#2F0C6C]/20 to-transparent transition-colors duration-300 ${
                isDark ? "from-[#2F0C6C]/50" : "from-[#2F0C6C]/30"
              }`} />

              {/* SECTION 2: Geographic Regulatory Constraints */}
              <div className="space-y-3">
                <div className={`flex items-center space-x-2 font-bold font-sans text-base transition-colors duration-300 ${
                  isDark ? "text-zinc-100" : "text-zinc-900"
                }`}>
                  <span className="text-[#2F0C6C] font-mono font-black">02.</span>
                  <h3>Geographic Access & Exclusion Mandate</h3>
                </div>
                <p className={`font-sans text-[13px] md:text-[14px] leading-relaxed transition-colors duration-300 ${
                  isDark ? "text-zinc-200" : "text-zinc-650"
                }`}>
                  Our services are offered and maintained based upon geographic compliance criteria. CGA Trades does not market, make representations, or permit digital accessibility in selected jurisdictions where regional regulatory guidelines (including CFTC Subpart C, ESMA retail MiFID restrictions, or specific financial oversight bans) constrain the public dispersal of complex alternative assets.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className={`p-4 rounded-xl border font-mono text-[11px] leading-relaxed transition-all duration-300 ${
                    isDark 
                      ? "bg-[#2F0C6C]/10 border-[#2F0C6C]/30 text-zinc-350" 
                      : "bg-[#2F0C6C]/5 border-[#2F0C6C]/15 text-zinc-700"
                  }`}>
                    <span className="text-[#2F0C6C] font-extrabold block mb-1">CFTC Subpart C:</span> Restricts direct off-exchange contracts and structured derivatives placement for non-qualified retail participants.
                  </div>
                  <div className={`p-4 rounded-xl border font-mono text-[11px] leading-relaxed transition-all duration-300 ${
                    isDark 
                      ? "bg-[#2F0C6C]/10 border-[#2F0C6C]/30 text-zinc-350" 
                      : "bg-[#2F0C6C]/5 border-[#2F0C6C]/15 text-zinc-700"
                  }`}>
                    <span className="text-[#2F0C6C] font-extrabold block mb-1">ESMA MiFID II:</span> Imposes severe leverages caps, mandatory marketing disclosures, and ban triggers for retail digital assets.
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className={`h-px bg-gradient-to-r via-[#2F0C6C]/20 to-transparent transition-colors duration-300 ${
                isDark ? "from-[#2F0C6C]/50" : "from-[#2F0C6C]/30"
              }`} />

              {/* SECTION 3: U.S. Regional Access Parameters */}
              <div className="space-y-3">
                <div className={`flex items-center space-x-2 font-bold font-sans text-base transition-colors duration-300 ${
                  isDark ? "text-zinc-100" : "text-zinc-900"
                }`}>
                  <span className="text-[#2F0C6C] font-mono font-black">03.</span>
                  <h3>United States Security & Compliance Guidelines</h3>
                </div>
                <p className={`font-sans text-[13px] md:text-[14px] leading-relaxed transition-colors duration-300 ${
                  isDark ? "text-zinc-200" : "text-zinc-650"
                }`}>
                  Platform access and operational features are currently restricted solely to verified United States citizens, permanent residents, and documented immigrants. This requirement ensures that CGA and its affiliates maintain active compliance with the Bank Secrecy Act (BSA), Office of Foreign Assets Control (OFAC) sanctions, and state-level financial transmission guidelines.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className={`flex items-center gap-2.5 p-3 rounded-xl border text-[11px] font-sans font-medium transition-colors duration-300 ${
                    isDark 
                      ? "bg-zinc-950/25 border-[#2F0C6C]/30 text-zinc-300" 
                      : "bg-white border-[#2F0C6C]/15 text-zinc-750 shadow-sm"
                  }`}>
                    <span className="text-[#2F0C6C] text-xs font-bold font-mono">■</span> KYC & SSN Verification
                  </div>
                  <div className={`flex items-center gap-2.5 p-3 rounded-xl border text-[11px] font-sans font-medium transition-colors duration-300 ${
                    isDark 
                      ? "bg-zinc-950/25 border-[#2F0C6C]/30 text-zinc-300" 
                      : "bg-white border-[#2F0C6C]/15 text-zinc-750 shadow-sm"
                  }`}>
                    <span className="text-[#2F0C6C] text-xs font-bold font-mono">■</span> SEC Reg D Exemptions
                  </div>
                  <div className={`flex items-center gap-2.5 p-3 rounded-xl border text-[11px] font-sans font-medium transition-colors duration-300 ${
                    isDark 
                      ? "bg-zinc-950/25 border-[#2F0C6C]/30 text-zinc-300" 
                      : "bg-white border-[#2F0C6C]/15 text-zinc-750 shadow-sm"
                  }`}>
                    <span className="text-[#2F0C6C] text-xs font-bold font-mono">■</span> OFAC Geolocation Filters
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className={`h-px bg-gradient-to-r via-[#2F0C6C]/20 to-transparent transition-colors duration-300 ${
                isDark ? "from-[#2F0C6C]/50" : "from-[#2F0C6C]/30"
              }`} />

              {/* HIGHLIGHTED SECTION: International Access Information */}
              <div className={`p-6 rounded-2xl border shadow-inner space-y-3 transition-colors duration-300 ${
                isDark 
                  ? "bg-gradient-to-b from-[#2F0C6C]/20 to-[#2F0C6C]/5 border-[#2F0C6C]/50" 
                  : "bg-gradient-to-b from-[#2F0C6C]/10 to-transparent border-[#2F0C6C]/30"
              }`} id="international-notice-highlight">
                <h4 className={`font-sans font-extrabold text-xs uppercase tracking-wider ${
                  isDark ? "text-zinc-200" : "text-[#2F0C6C]"
                }`}>
                  International Access Information
                </h4>
                <p className={`font-sans text-[13px] md:text-[14px] leading-relaxed ${
                  isDark ? "text-zinc-200" : "text-zinc-800"
                }`}>
                  CGA continues to develop regulatory gateways and secure licensing overrides with sovereign authorities across Europe, Africa, and Asia. For institutional allocators and prospective foreign qualified purchasers seeking information about our digital expansion initiative, {" "}
                  <button
                    onClick={() => {
                      setPageView("expansion");
                      window.history.pushState({}, "", "/cga-global-expansion");
                    }}
                    className={`font-black hover:underline inline-flex items-center gap-0.5 cursor-pointer focus:outline-none transition-all ${
                      isDark ? "text-[#a47bdf] hover:text-[#bca4e7]" : "text-[#2F0C6C] hover:text-indigo-950"
                    }`}
                  >
                    See more <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </p>
              </div>

            </div>

            {/* Back action */}
            <div className={`text-center py-8 border-t border-dashed max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 ${
              isDark ? "border-[#2F0C6C]/45" : "border-[#2F0C6C]/25"
            }`}>
              <p className={`font-sans text-[12px] leading-relaxed text-left sm:max-w-md transition-colors duration-300 ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}>
                To coordinate custom manual region mapping or institutional whitelisting reviews, please reach out via helpdesk chat or at compliance@cga-trades.com.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expansion-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-6xl mx-auto px-4 py-4 md:py-8 relative z-10 text-left select-none"
            id="expansion-initiative-view"
          >
            {/* Page Header / Intro Hero */}
            <div className={`text-center md:text-left mb-10 md:mb-14 border-b pb-8 transition-colors duration-300 ${
              isDark ? "border-[#2F0C6C]/35" : "border-[#2F0C6C]/20"
            }`}>
              <span className={`text-[11.5px] font-mono tracking-[0.22em] uppercase font-bold px-4 py-2 rounded-full border inline-block mb-4 shadow-sm transition-all duration-300 ${
                isDark 
                  ? "text-zinc-200 bg-[#2F0C6C]/20 border-[#2F0C6C]/60" 
                  : "text-[#2F0C6C] bg-[#2F0C6C]/5 border-[#2F0C6C]/30"
              }`}>
                Compliance & Strategic Rollout Portal
              </span>
              <h1 className={`font-display text-3xl md:text-5xl font-black tracking-tight leading-none mb-4 transition-colors duration-305 ${
                isDark ? "text-white" : "text-zinc-950"
              }`}>
                Restricted Regional Accessibility
              </h1>
              <p className={`font-sans text-[14.5px] md:text-[17px] max-w-3xl leading-relaxed transition-colors duration-305 ${
                isDark ? "text-zinc-300" : "text-zinc-620"
              }`}>
                CGA Capital Growth Alliance Global Compliance & Expansion Framework
              </p>
            </div>

            {/* Split Grid for SECTION 1 — ABOUT CGA and SECTION 2 — U.S. ACCESSIBILITY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* SECTION 1 — ABOUT CGA */}
              <div 
                className={`p-6 md:p-8 rounded-3xl border flex flex-col justify-between transition-all duration-500 shadow-xl ${
                  isDark 
                    ? "bg-zinc-900/40 backdrop-blur-md border-[#2F0C6C]/35 hover:border-[#2F0C6C]/60 shadow-[#2F0C6C]/5" 
                    : "bg-white/70 backdrop-blur-md border-[#2F0C6C]/20 hover:border-[#2F0C6C]/40 shadow-zinc-200"
                }`} 
                id="about-cga-section"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-5">
                    <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                      isDark 
                        ? "bg-[#2F0C6C]/15 border-[#2F0C6C]/35 text-zinc-100" 
                        : "bg-[#2F0C6C]/5 border-[#2F0C6C]/20 text-[#2F0C6C]"
                    }`}>
                      <Cpu className="w-5 h-5 animate-pulse" />
                    </div>
                    <h3 className={`font-sans font-bold text-lg md:text-xl transition-colors duration-300 ${
                      isDark ? "text-white" : "text-zinc-900"
                    }`}>
                      About CGA
                    </h3>
                  </div>
                  
                  <p className={`font-sans text-[13px] md:text-[14px] leading-relaxed transition-colors duration-300 ${
                    isDark ? "text-zinc-200" : "text-zinc-700"
                  }`}>
                    Founded in 2020 by Willis Anthony following the rise of digital asset innovation and the Bitcoin financial revolution, Capital Growth Alliance (CGA) has evolved into a trusted AI-powered financial institution serving over 200,000 investors across the United States.
                  </p>
                  <p className={`font-sans text-[13px] md:text-[14px] leading-relaxed mt-4 transition-colors duration-300 ${
                    isDark ? "text-zinc-400" : "text-zinc-550"
                  }`}>
                    CGA delivers advanced automated investment technologies designed to support long-term financial growth through intelligent AI-powered trading systems and diversified multi-asset strategies.
                  </p>
                </div>
              </div>

              {/* SECTION 2 — U.S. ACCESSIBILITY */}
              <div 
                className={`p-6 md:p-8 rounded-3xl border flex flex-col justify-between transition-all duration-500 shadow-xl ${
                  isDark 
                    ? "bg-zinc-900/40 backdrop-blur-md border-[#2F0C6C]/35 hover:border-[#2F0C6C]/60 shadow-[#2F0C6C]/5" 
                    : "bg-white/70 backdrop-blur-md border-[#2F0C6C]/20 hover:border-[#2F0C6C]/40 shadow-zinc-200"
                }`} 
                id="us-accessibility-section"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-5">
                    <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                      isDark 
                        ? "bg-[#2F0C6C]/15 border-[#2F0C6C]/35 text-zinc-100" 
                        : "bg-[#2F0C6C]/5 border-[#2F0C6C]/20 text-[#2F0C6C]"
                    }`}>
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className={`font-sans font-bold text-lg md:text-xl transition-colors duration-300 ${
                      isDark ? "text-white" : "text-zinc-900"
                    }`}>
                      U.S. Accessibility
                    </h3>
                  </div>
                  
                  <p className={`font-sans text-[13px] md:text-[14px] leading-relaxed transition-colors duration-300 ${
                    isDark ? "text-zinc-200" : "text-zinc-700"
                  }`}>
                    At present, CGA services and investment accessibility remain exclusive to verified United States citizens, permanent residents, and documented immigrants who successfully complete identity verification and Social Security authentication requirements.
                  </p>
                  <p className={`font-sans text-[13px] md:text-[14px] leading-relaxed mt-4 transition-colors duration-300 ${
                    isDark ? "text-zinc-400" : "text-zinc-550"
                  }`}>
                    This restriction exists to maintain regulatory compliance, platform security, and institutional operational standards.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3 — RESTRICTED REGIONS */}
            <div className="mb-12">
              <h3 className={`font-sans font-bold text-lg md:text-xl mb-6 transition-colors duration-300 ${
                isDark ? "text-white" : "text-zinc-900"
              }`}>
                Restricted Jurisdictions
              </h3>
              
              {/* 3 Premium Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                {[
                  {
                    name: "Africa",
                    tag: "Exempted Flow",
                    icon: Globe,
                    desc: "Digital Asset Onboarding & Micro-licensing",
                  },
                  {
                    name: "Europe",
                    tag: "MiFID Sandbox",
                    icon: ShieldCheck,
                    desc: "Unified Qualified Buyer Certifications Ready",
                  },
                  {
                    name: "Asia",
                    tag: "Strategic Hub",
                    icon: Compass,
                    desc: "High-Volume Sovereign Entity Placement",
                  },
                ].map((card, idx) => {
                  const IconComp = card.icon;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.03, y: -4 }}
                      className={`p-6 rounded-2xl border flex flex-col justify-between h-44 transition-all duration-300 cursor-pointer shadow-md ${
                        isDark 
                          ? "bg-zinc-900/40 border-[#2F0C6C]/30 hover:border-[#2F0C6C]/65 shadow-[#2F0C6C]/5" 
                          : "bg-white border-[#2F0C6C]/20 hover:border-[#2F0C6C]/50 shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`p-2.5 rounded-xl border shadow-sm transition-colors ${
                          isDark 
                            ? "bg-zinc-950/80 border-[#2F0C6C]/40 text-zinc-200" 
                            : "bg-[#2F0C6C]/5 border-[#2F0C6C]/20 text-[#2F0C6C]"
                        }`}>
                          <IconComp className="w-5 h-5 animate-pulse" />
                        </div>
                        <span className={`text-[9.5px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-colors ${
                          isDark 
                            ? "bg-zinc-950/60 text-zinc-300 border-[#2F0C6C]/30" 
                            : "bg-[#2F0C6C]/5 text-[#2F0C6C] border-[#2F0C6C]/20"
                        }`}>
                          {card.tag}
                        </span>
                      </div>
                      <div className="mt-4">
                        <h4 className={`font-sans font-bold text-base transition-colors ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>{card.name} Region</h4>
                        <p className={`text-[11.5px] mt-1 leading-snug transition-colors ${isDark ? "text-zinc-400" : "text-zinc-550"}`}>{card.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Description Below Cards */}
              <p className={`text-xs md:text-[13px] leading-relaxed transition-colors duration-500 mt-4 border-l-2 pl-3 ${
                isDark ? "border-[#2F0C6C] text-zinc-400" : "border-[#2F0C6C] text-zinc-500"
              }`}>
                Due to regional regulatory frameworks and licensing limitations, direct accessibility is currently unavailable within selected international jurisdictions.
              </p>
            </div>

            {/* SECTION 4 — GLOBAL EXPANSION */}
            <div 
              className={`p-6 md:p-8 rounded-3xl border mb-12 transition-all duration-500 shadow-lg ${
                isDark 
                  ? "bg-zinc-900/40 border-[#2F0C6C]/35 shadow-[#2F0C6C]/5" 
                  : "bg-white/70 border-[#2F0C6C]/20 shadow-sm"
              }`} 
              id="global-expansion-section"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  isDark 
                    ? "bg-[#2F0C6C]/15 border-[#2F0C6C]/35 text-zinc-100 animate-pulse" 
                    : "bg-[#2F0C6C]/5 border-[#2F0C6C]/20 text-[#2F0C6C]"
                }`}>
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className={`font-sans font-bold text-lg md:text-xl transition-colors duration-300 ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}>
                  Global Expansion Initiative
                </h3>
              </div>

              <div className={`font-sans text-[13px] md:text-[14px] leading-relaxed space-y-4 transition-colors duration-300 ${
                isDark ? "text-zinc-200" : "text-zinc-700"
              }`}>
                <p>
                  In May 2025, CGA launched its international expansion framework focused on extending AI-powered financial accessibility beyond the United States.
                </p>
                <p>
                  The company is actively developing compliant infrastructure, multilingual systems, and region-specific onboarding experiences for future global participation.
                </p>
              </div>
            </div>

            {/* SECTION 5 — TARGET COUNTRIES */}
            <div className="mb-12">
              <h3 className={`font-display text-lg md:text-xl font-bold tracking-tight mb-6 transition-colors duration-300 ${
                isDark ? "text-white" : "text-zinc-900"
              }`}>
                Target Global Jurisdictions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ASIA */}
                <div 
                  className={`p-6 rounded-3xl border transition-all duration-300 shadow-sm ${
                    isDark 
                      ? "bg-zinc-900/40 border-[#2F0C6C]/30 hover:border-[#2F0C6C]/60" 
                      : "bg-white border-[#2F0C6C]/25 hover:border-[#2F0C6C]/45"
                  }`} 
                  id="asia-countries-tier"
                >
                  <div className={`flex items-center space-x-2.5 mb-5 border-b pb-3 transition-colors duration-300 ${
                    isDark ? "border-[#2F0C6C]/30" : "border-[#2F0C6C]/15"
                  }`}>
                    <div className={`p-2 rounded-xl border transition-colors ${
                      isDark 
                        ? "bg-[#2F0C6C]/15 border-[#2F0C6C]/30 text-zinc-100" 
                        : "bg-[#2F0C6C]/5 border-[#2F0C6C]/20 text-[#2F0C6C]"
                    }`}>
                      <Compass className="w-4 h-4" />
                    </div>
                    <h4 className={`font-sans font-extrabold text-[13px] tracking-wider uppercase transition-colors ${
                      isDark ? "text-zinc-300" : "text-[#2F0C6C]"
                    }`}>
                      Asia Target Scope
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Singapore", "Japan", "South Korea", "India", "Malaysia", "Indonesia", "Thailand", "Philippines", "Vietnam", "UAE"].map((c, i) => (
                      <motion.span 
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className={`text-[11.5px] font-sans font-medium px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer shadow-sm ${
                          isDark 
                            ? "bg-zinc-950/40 border-[#2F0C6C]/25 hover:bg-[#2F0C6C]/15 hover:border-[#2F0C6C]/60 text-zinc-200" 
                            : "bg-[#2F0C6C]/5 border-[#2F0C6C]/15 hover:bg-[#2F0C6C]/10 hover:border-[#2F0C6C]/40 text-[#2F0C6C]"
                        }`}
                      >
                        {c}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* EUROPE */}
                <div 
                  className={`p-6 rounded-3xl border transition-all duration-300 shadow-sm ${
                    isDark 
                      ? "bg-zinc-900/40 border-[#2F0C6C]/30 hover:border-[#2F0C6C]/60" 
                      : "bg-white border-[#2F0C6C]/25 hover:border-[#2F0C6C]/45"
                  }`} 
                  id="europe-countries-tier"
                >
                  <div className={`flex items-center space-x-2.5 mb-5 border-b pb-3 transition-colors duration-300 ${
                    isDark ? "border-[#2F0C6C]/30" : "border-[#2F0C6C]/15"
                  }`}>
                    <div className={`p-2 rounded-xl border transition-colors ${
                      isDark 
                        ? "bg-[#2F0C6C]/15 border-[#2F0C6C]/30 text-zinc-100" 
                        : "bg-[#2F0C6C]/5 border-[#2F0C6C]/20 text-[#2F0C6C]"
                    }`}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h4 className={`font-sans font-extrabold text-[13px] tracking-wider uppercase transition-colors ${
                      isDark ? "text-zinc-300" : "text-[#2F0C6C]"
                    }`}>
                      Europe Target Scope
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["United Kingdom", "Germany", "France", "Netherlands", "Switzerland", "Sweden", "Norway", "Italy", "Spain", "Belgium"].map((c, i) => (
                      <motion.span 
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className={`text-[11.5px] font-sans font-medium px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer shadow-sm ${
                          isDark 
                            ? "bg-zinc-950/40 border-[#2F0C6C]/25 hover:bg-[#2F0C6C]/15 hover:border-[#2F0C6C]/60 text-zinc-200" 
                            : "bg-[#2F0C6C]/5 border-[#2F0C6C]/15 hover:bg-[#2F0C6C]/10 hover:border-[#2F0C6C]/40 text-[#2F0C6C]"
                        }`}
                      >
                        {c}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* AFRICA */}
                <div 
                  className={`p-6 rounded-3xl border transition-all duration-300 shadow-sm ${
                    isDark 
                      ? "bg-zinc-900/40 border-[#2F0C6C]/30 hover:border-[#2F0C6C]/60" 
                      : "bg-white border-[#2F0C6C]/25 hover:border-[#2F0C6C]/45"
                  }`} 
                  id="africa-countries-tier"
                >
                  <div className={`flex items-center space-x-2.5 mb-5 border-b pb-3 transition-colors duration-300 ${
                    isDark ? "border-[#2F0C6C]/30" : "border-[#2F0C6C]/15"
                  }`}>
                    <div className={`p-2 rounded-xl border transition-colors ${
                      isDark 
                        ? "bg-[#2F0C6C]/15 border-[#2F0C6C]/30 text-zinc-100" 
                        : "bg-[#2F0C6C]/5 border-[#2F0C6C]/20 text-[#2F0C6C]"
                    }`}>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <h4 className={`font-sans font-extrabold text-[13px] tracking-wider uppercase transition-colors ${
                      isDark ? "text-zinc-300" : "text-[#2F0C6C]"
                    }`}>
                      Africa Target Scope
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Nigeria", "South Africa", "Kenya", "Ghana", "Rwanda", "Egypt", "Morocco", "Botswana"].map((c, i) => (
                      <motion.span 
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className={`text-[11.5px] font-sans font-medium px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer shadow-sm ${
                          isDark 
                            ? "bg-zinc-950/40 border-[#2F0C6C]/25 hover:bg-[#2F0C6C]/15 hover:border-[#2F0C6C]/60 text-zinc-200" 
                            : "bg-[#2F0C6C]/5 border-[#2F0C6C]/15 hover:bg-[#2F0C6C]/10 hover:border-[#2F0C6C]/40 text-[#2F0C6C]"
                        }`}
                      >
                        {c}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6 — TAVARIWAVE PLATFORM */}
            <div className="mb-12">
              <div 
                className={`p-8 md:p-10 rounded-3xl border relative overflow-hidden transition-all duration-500 shadow-2xl ${
                  isDark 
                    ? "bg-zinc-900/55 border-[#2F0C6C]/40 shadow-[#2F0C6C]/5" 
                    : "bg-white/75 backdrop-blur-md border-[#2F0C6C]/25 shadow-[#2F0C6C]/5"
                }`} 
                id="tavariwave-premium-spotlight"
              >
                
                {/* Diagonal subtle lines context */}
                <div className="absolute inset-0 bg-[#2F0C6C]/[0.02] bg-grid-pattern opacity-40 pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2F0C6C] animate-ping" />
                      <span className={`text-[11px] font-mono tracking-widest uppercase font-bold transition-colors ${
                        isDark ? "text-zinc-300" : "text-[#2F0C6C]"
                      }`}>
                        International Onboarding Live
                      </span>
                    </div>
                    <h3 className={`font-display font-black text-2xl md:text-3xl tracking-tight leading-none transition-colors duration-300 ${
                      isDark ? "text-white" : "text-zinc-900"
                    }`}>
                      International Extension Platform
                    </h3>
                    <p className={`font-sans text-[13.5px] md:text-[14px] leading-relaxed transition-colors duration-300 ${
                      isDark ? "text-zinc-200" : "text-zinc-700"
                    }`}>
                      To support users outside the United States, CGA introduced its international extension ecosystem designed for Africa, Europe, and Asia.
                    </p>
                    <p className={`font-sans text-[13.5px] md:text-[14px] leading-relaxed transition-colors duration-300 ${
                      isDark ? "text-zinc-400" : "text-zinc-550"
                    }`}>
                      The TavariWave platform provides a modern AI-powered financial experience focused on accessibility, exploration, and secure automated investment technology for global users.
                    </p>

                    {/* Domain Display with custom click, glow, and hover */}
                    <div className="pt-3">
                      <a 
                        href="https://www.tavariwave.online"
                        target="_blank"
                        rel="noreferrer"
                        className={`group relative inline-flex items-center gap-2 font-mono text-base font-extrabold transition-all duration-300 ${
                          isDark 
                            ? "text-[#a47bdf] hover:text-[#bca4e7]" 
                            : "text-[#2F0C6C] hover:text-[#3d108d]"
                        }`}
                      >
                        <span className="underline underline-offset-4 decoration-current/40 group-hover:decoration-[#bca4e7] transition-colors">
                          www.tavariwave.online
                        </span>
                        <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex justify-end">
                    <a 
                      href="https://www.tavariwave.online"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full lg:w-auto h-12 px-8 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer shadow-md bg-[#2F0C6C] text-white hover:bg-[#3e138c] active:scale-[0.97] shadow-[0_4px_20px_rgba(47,12,108,0.25)]"
                    >
                      Explore TavariWave
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Nav Link block at bottom */}
            <div className={`text-center py-8 border-t border-dashed max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 ${
              isDark ? "border-[#2F0C6C]/45" : "border-[#2F0C6C]/25"
            }`}>
              <p className={`font-sans text-[12px] leading-relaxed text-left sm:max-w-md transition-colors duration-300 ${
                isDark ? "text-zinc-400" : "text-zinc-550"
              }`}>
                CGA Capital Growth Alliance is committed to expanding digital asset administration in coordinate with sovereign whitelists on an ongoing basis.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

      {/* Floating Modern Chatbot Modal (Glassmorphic conversational UI) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 w-[calc(100%-2rem)] sm:w-[360px] md:w-[390px] h-[500px] max-h-[85vh] backdrop-blur-xl rounded-2xl border flex flex-col z-50 overflow-hidden transition-all duration-700 ${
              isDark 
                ? "bg-zinc-950/85 border-zinc-805/80 text-zinc-100 shadow-[0_25px_60px_rgba(0,0,0,0.7)]" 
                : "bg-white/90 border-zinc-200/80 text-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
            }`}
            id="cga-chatbot-modal"
          >
            {/* Chat Header inside Modal */}
            <div className={`p-4 border-b flex justify-between items-center shrink-0 transition-colors duration-700 ${
              isDark ? "border-zinc-800/85 bg-zinc-900/40" : "border-zinc-200/80 bg-zinc-50/50"
            }`}>
              <div className="flex items-center space-x-2.5">
                {/* Bot Icon with contrast background badge */}
                <div className="p-1 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
                  <img 
                    src="https://i.imgur.com/u7ADhK0.png" 
                    alt="CGA logo" 
                    className="w-5 h-5 object-contain select-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className={`font-sans font-bold text-xs leading-tight transition-colors duration-700 ${
                    isDark ? "text-zinc-50" : "text-zinc-900"
                  }`}>CGA Trades SupportDesk</h3>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={`text-[10px] font-mono transition-colors duration-700 ${
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    }`}>Compliant AI Agent</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className={`p-1 px-2 rounded-lg transition-colors cursor-pointer ${
                  isDark ? "hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200" : "hover:bg-zinc-200/60 text-zinc-400 hover:text-zinc-700"
                }`}
                id="close-chatbot-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body panel (scrollable feed) */}
            <div className={`flex-1 p-4 overflow-y-auto space-y-4 select-text transition-colors duration-700 ${
              isDark ? "bg-zinc-950/20" : "bg-zinc-50/20"
            }`}>
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${m.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
                                        {m.sender === "bot" && (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 transition-colors duration-700 ${
                        isDark ? "bg-zinc-800 text-zinc-200" : "bg-primary/20 text-primary-dark"
                      }`}>
                        CT
                      </div>
                    )}

                    <div className="flex flex-col">
                      <div className={`p-3 rounded-2xl text-[12.5px] leading-relaxed transition-all duration-300 ${
                        m.sender === "user" 
                          ? "bg-primary text-zinc-950 font-semibold rounded-tr-none shadow-sm" 
                          : isDark
                            ? "bg-zinc-900/80 text-zinc-100 rounded-tl-none border border-zinc-800 shadow-md"
                            : "bg-white text-zinc-800 rounded-tl-none border border-zinc-200/80 shadow-sm"
                      }`}>
                        {m.text}
                      </div>
                      <span className={`text-[9px] mt-1 font-mono transition-colors duration-700 ${
                        isDark ? "text-zinc-500" : "text-zinc-400"
                      } ${m.sender === "user" ? "text-right" : "text-left"}`}>
                        {m.time}
                      </span>
                    </div>

                  </div>
                </div>
              ))}

              {/* Bot Loading Bubble Typing state */}
              {isTyping && (
                <div className="flex justify-start items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors duration-700 ${
                    isDark ? "bg-zinc-800 text-zinc-200" : "bg-primary/20 text-primary-dark"
                  }`}>
                    CT
                  </div>
                  <div className={`rounded-2xl rounded-tl-none p-3 px-4 shadow-sm flex items-center space-x-1 border transition-all duration-700 ${
                    isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-white border-zinc-200/80"
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Custom Interactive Quick Response Menu (fintech compliance path actions) */}
            <div className={`px-4 py-2 border-t space-y-1 shrink-0 transition-colors duration-700 ${
              isDark ? "border-zinc-800 bg-zinc-950/40" : "border-zinc-105 bg-white/50"
            }`}>
              <span className={`text-[9.5px] uppercase tracking-wider font-mono font-bold block mb-1 transition-colors duration-700 ${
                isDark ? "text-zinc-500" : "text-zinc-400"
              }`}>
                Suggested compliance inquiries:
              </span>
              <div className="flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={() => handleQuickReply(
                    "Can I request a manual IP override?",
                    "Manual IP whitelist overrides are regulated under SEC Regulation D and CFTC Rule § 4.7. Our compliance system requires submitting a certified LEI verification. Please file an official request or email compliance@cga-trades.com."
                  )}
                  className={`w-full text-left p-1.5 px-2.5 rounded-lg border text-[11px] transition-all font-medium cursor-pointer ${
                    isDark 
                      ? "border-zinc-850 bg-zinc-900/30 hover:border-primary hover:bg-primary/5 text-zinc-400 hover:text-primary" 
                      : "border-zinc-200 hover:border-primary-dark hover:bg-primary/10 text-zinc-600 hover:text-primary-dark"
                  }`}
                >
                  Request Regional Whitelist Override
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickReply(
                    "I am a verified Qualified Institutional Buyer (QIB).",
                    "Under ESMA MiFID II guidelines, verified QIB status overrides default regional filter bans. For underwriting manual setup, please forward your institutional credentials directly to compliance@cga-trades.com."
                  )}
                  className={`w-full text-left p-1.5 px-2.5 rounded-lg border text-[11px] transition-all font-medium cursor-pointer ${
                    isDark 
                      ? "border-zinc-850 bg-zinc-900/30 hover:border-primary hover:bg-primary/5 text-zinc-400 hover:text-primary" 
                      : "border-zinc-200 hover:border-primary-dark hover:bg-primary/10 text-zinc-600 hover:text-primary-dark"
                  }`}
                >
                  State Verified Institutional Investor Status
                </button>
              </div>
            </div>

            {/* Default Typed Input Area */}
            <form onSubmit={handleSendMessage} className={`p-3 border-t flex items-center gap-2 shrink-0 transition-colors duration-700 ${
              isDark ? "border-zinc-800 bg-zinc-900/60" : "border-zinc-200 bg-zinc-50"
            }`}>
              <input 
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={`flex-1 h-9 rounded-xl border px-3 text-[12px] outline-none transition-all duration-700 font-sans ${
                  isDark 
                    ? "border-zinc-805 bg-gray-950 text-white focus:border-primary" 
                    : "border-zinc-200 bg-white text-zinc-800 focus:border-primary"
                }`}
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-primary text-zinc-950 flex items-center justify-center hover:bg-primary-hover transition-colors cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Expansion Regions Modal has been migrated to the new routed subpage */}

      {/* CGA Regulatory Informational Overlay Overlay */}
      <AnimatePresence>
        {overlay === "about" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-lg rounded-3xl border overflow-hidden flex flex-col transition-all duration-700 ${
                isDark 
                  ? "bg-zinc-950/95 border-zinc-800/80 shadow-[0_30px_80px_rgba(0,0,0,0.8)]" 
                  : "bg-white border-zinc-200/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)]"
              }`}
              id="cga-about-modal"
            >
              {/* Modal Header */}
              <div className={`p-6 pb-4 border-b flex justify-between items-center transition-colors duration-700 ${
                isDark ? "border-zinc-800/80 bg-zinc-900/50" : "border-zinc-100 bg-zinc-50/50"
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-md">
                    <img 
                      src="https://i.imgur.com/u7ADhK0.png" 
                      alt="CGA Logo" 
                      className="w-8 h-8 object-contain select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className={`font-sans font-semibold text-md leading-tight transition-colors duration-700 ${
                      isDark ? "text-zinc-50" : "text-zinc-950"
                    }`}>CGA Trades Corporate Mandate</h3>
                    <p className={`text-[10px] uppercase tracking-widest font-mono transition-colors duration-700 ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}>Official Regulatory Brief</p>
                  </div>
                </div>
                <button 
                  onClick={() => setOverlay("none")}
                  className={`p-1 px-2.5 rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 ${
                    isDark 
                      ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200" 
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <X className="w-3.5 h-3.5" /> Close
                </button>
              </div>

              {/* Modal Body Scroll */}
              <div className={`p-6 md:p-8 space-y-5 text-xs leading-relaxed overflow-y-auto max-h-[350px] select-text transition-colors duration-700 ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}>
                <p>
                  <strong>CGA Trades</strong> is an international multi-asset absolute-return administrator and fiduciary, catering strictly to sovereign entities, accredited corporate allocators, and certified qualified purchasers globally.
                </p>
                <p>
                  Our services are offered and maintained based upon geographic compliance criteria. <strong>CGA Trades</strong> does not market, make representations, or permit digital accessibility in selected jurisdictions where regional regulatory guidelines (including CFTC Subpart C, ESMA retail MiFID restrictions, or specific financial oversight bans) constrain the public dispersal of complex alternative assets.
                </p>

                {/* Simulated Key Compliance Matrices */}
                <div className={`rounded-xl p-4 border space-y-2.5 font-mono text-[11px] transition-all duration-700 ${
                  isDark ? "bg-zinc-900/40 border-zinc-800/80" : "bg-zinc-50 border-zinc-200/50"
                }`}>
                  <div className={`flex justify-between border-b pb-2 ${isDark ? "border-zinc-800/60" : "border-zinc-200/40"}`}>
                    <span className="text-zinc-400">Parameter Protocol</span>
                    <span className={isDark ? "text-zinc-200 font-semibold" : "text-zinc-800 font-semibold"}>CGA-TRADES-D4</span>
                  </div>
                  <div className={`flex justify-between border-b pb-2 ${isDark ? "border-zinc-800/60" : "border-zinc-200/40"}`}>
                    <span className="text-zinc-400">Qualifying Exemption</span>
                    <span className={isDark ? "text-zinc-200 font-semibold" : "text-zinc-800 font-semibold"}>SEC Rule 506(c)</span>
                  </div>
                  <div className="flex justify-between pb-0">
                    <span className="text-zinc-400">Edge Guard Lock</span>
                    <span className="text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">ACTIVE FILTER BANS</span>
                  </div>
                </div>

                <div className={`border rounded-xl p-4 text-[11.5px] flex gap-2.5 transition-all duration-700 ${
                  isDark 
                    ? "bg-primary/5 border-primary/20 text-zinc-300" 
                    : "bg-primary/10 border-primary/15 text-zinc-800"
                }`}>
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    To coordinate manual region testing or institutional whitelist reviews, please leverage our secure helpdesk chat directly, or forward credential forms to compliance@cga-trades.com.
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`p-5 border-t flex justify-end transition-colors duration-700 ${
                isDark ? "border-zinc-800/60 bg-zinc-900/30" : "border-zinc-100 bg-zinc-50"
              }`}>
                <button
                  onClick={() => setOverlay("none")}
                  className={`px-5 h-10 font-medium text-xs rounded-lg cursor-pointer transition-colors shadow-sm ${
                    isDark 
                      ? "bg-zinc-105 hover:bg-zinc-200 text-zinc-900" 
                      : "bg-zinc-950 hover:bg-zinc-800 text-white"
                  }`}
                >
                  Acknowledge & Exit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
