import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { geminiService } from './services/geminiService';
import { ChatMessage, MessageType, AppMode, UserSettings, EmotionSensitivity, ResponseStyle } from './types';
import { 
  PaperAirplaneIcon, 
  MicrophoneIcon, 
  PhotoIcon, 
  CodeBracketIcon, 
  SparklesIcon,
  CpuChipIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  XMarkIcon,
  TrophyIcon,
  StarIcon,
  BoltIcon,
  VideoCameraIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  UserCircleIcon,
  FingerPrintIcon,
  ArrowRightIcon,
  TrashIcon,
  ArchiveBoxIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/solid';

// --- Professional Logo Component (The HyperCore Identity) ---
const HyperLogo3D: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-14 h-14',
        lg: 'w-32 h-32',
        xl: 'w-48 h-48'
    };

    return (
        <div className={`relative flex items-center justify-center ${sizeClasses[size]} select-none group`}>
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-colors duration-500"></div>
            
            <svg 
                viewBox="0 0 200 200" 
                className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="hGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" /> {/* blue-400 */}
                        <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
                    </linearGradient>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#818cf8" /> {/* indigo-400 */}
                        <stop offset="100%" stopColor="#c084fc" /> {/* purple-400 */}
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Background Ring */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="url(#hGradient)" strokeWidth="1" strokeOpacity="0.1" />
                <path d="M190 100 A 90 90 0 0 1 100 190" stroke="url(#waveGradient)" strokeWidth="2" strokeLinecap="round" className="opacity-40" />

                {/* The 'h' Symbol */}
                <g filter="url(#glow)">
                    {/* Vertical Stem */}
                    <path d="M65 45 V155" stroke="white" strokeWidth="18" strokeLinecap="round" />
                    
                    {/* The Arch/Mind Connection */}
                    <path 
                        d="M65 105 Q 115 105 135 105 Q 155 105 155 155" 
                        stroke="url(#hGradient)" 
                        strokeWidth="18" 
                        strokeLinecap="round" 
                        fill="none" 
                    />
                </g>

                {/* Neural Waves (WiFi/Mind signal) */}
                <path 
                    d="M135 70 Q 155 50 175 70" 
                    stroke="url(#waveGradient)" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    fill="none" 
                    className="opacity-80"
                />
                <path 
                    d="M125 85 Q 140 70 155 85" 
                    stroke="url(#waveGradient)" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    fill="none" 
                    className="opacity-60" 
                />

                {/* Spark/Intelligence Node */}
                <g className="animate-[pulse_3s_ease-in-out_infinite]">
                    <path d="M45 45 L55 35 M45 45 L35 35 M45 45 L45 30" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="45" cy="45" r="4" fill="#fcd34d" />
                </g>
            </svg>
        </div>
    );
};

// --- High-End Components ---

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`glass-premium rounded-3xl p-5 ${className}`}>
        {children}
    </div>
);

const TypingIndicator = () => (
    <div className="flex space-x-1 space-x-reverse items-center p-3 glass-panel-3d rounded-2xl rounded-tr-none">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce delay-75 shadow-[0_0_10px_#3b82f6]"></div>
        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-bounce delay-150 shadow-[0_0_10px_#a855f7]"></div>
        <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full animate-bounce delay-200 shadow-[0_0_10px_#ec4899]"></div>
    </div>
);

// --- Code Block Component ---
const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-4 rounded-xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-2xl" dir="ltr">
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono ml-3">{language || 'code'}</span>
                </div>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                    {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <DocumentDuplicateIcon className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <div className="p-4 overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
                <pre className="font-mono text-sm leading-relaxed text-blue-100">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

// --- Message Row Component (Replaces VirtualRow) ---
const MessageRow: React.FC<{ msg: ChatMessage }> = memo(({ msg }) => {
    return (
        <div className={`pb-6 px-4 md:px-6 flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.type === MessageType.USER ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] ${msg.type === MessageType.SYSTEM ? 'w-full flex justify-center' : ''}`}>
                {msg.type === MessageType.SYSTEM ? (
                    <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1 text-xs text-slate-400">
                        {msg.text}
                    </div>
                ) : (
                    <div className={`p-4 rounded-2xl ${
                        msg.type === MessageType.USER 
                        ? 'bg-blue-600/20 border border-blue-500/30 text-white rounded-tr-none shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                        : 'glass-premium rounded-tl-none text-slate-100'
                    }`}>
                        {msg.imageUrl && (
                            <div className="mb-3 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                <img src={msg.imageUrl} alt="Generated" className="w-full h-auto object-cover" />
                            </div>
                        )}
                        
                        <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                            {msg.text.split(/(```[\s\S]*?```)/g).map((part: string, index: number) => {
                                if (part.startsWith('```') && part.endsWith('```')) {
                                    const content = part.slice(3, -3);
                                    const langMatch = content.match(/^(\w+)\n/);
                                    const lang = langMatch ? langMatch[1] : '';
                                    const code = langMatch ? content.slice(lang.length + 1) : content;
                                    return <CodeBlock key={index} code={code} language={lang} />;
                                }
                                return <span key={index}>{part}</span>;
                            })}
                        </div>

                        {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/5">
                                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><GlobeAltIcon className="w-3 h-3" /> المصادر:</p>
                                <div className="flex flex-wrap gap-2">
                                    {msg.groundingUrls.map((url: string, i: number) => (
                                        <a key={i} href={url} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 underline truncate max-w-[200px] block">
                                            {new URL(url).hostname}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div className={`text-[10px] text-slate-500 mt-1 px-1 ${msg.type === MessageType.USER ? 'text-left' : 'text-right'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
            </div>
        </div>
    );
});


// Advanced Audio Orb Visualizer
const AudioOrb: React.FC<{ volume: number; isConnected: boolean }> = ({ volume, isConnected }) => {
    return (
        <div className="relative flex items-center justify-center w-80 h-80">
            {/* Pulsing Core Aura */}
            <div 
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-full blur-3xl transition-all duration-100 ease-out"
                style={{ transform: `scale(${0.8 + volume})`, opacity: 0.3 + volume * 0.5 }}
            ></div>

            {/* Concentric Wave Rings */}
            {[1, 2, 3].map((ring) => (
                <div
                    key={ring}
                    className={`absolute rounded-full border border-white/10 transition-all duration-${ring * 75} ease-out`}
                    style={{
                        width: `${100 + volume * (100 + ring * 50)}%`,
                        height: `${100 + volume * (100 + ring * 50)}%`,
                        opacity: Math.max(0, 0.4 - volume * 0.2 - (ring * 0.1)),
                        borderColor: `rgba(255, 255, 255, ${Math.max(0, 0.3 - volume * 0.1)})`
                    }}
                ></div>
            ))}

            {/* Active Waveform Rings (Simulated) */}
             <div 
                className="absolute inset-0 rounded-full border-2 border-cyan-400/30 transition-all duration-75"
                style={{ transform: `scale(${1 + volume * 0.3})` }}
             ></div>
             <div 
                className="absolute inset-0 rounded-full border-2 border-purple-500/30 transition-all duration-100 delay-75"
                style={{ transform: `scale(${1 + volume * 0.5})` }}
             ></div>

            {/* Central Hub */}
            <div className="w-40 h-40 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,0.3)] relative z-10 overflow-hidden group">
                {/* Spinning Data Ring */}
                <div className={`absolute inset-3 rounded-full border-t-2 border-l-2 border-cyan-500/50 ${isConnected ? 'animate-[spin_4s_linear_infinite]' : ''}`}></div>
                <div className={`absolute inset-5 rounded-full border-b-2 border-r-2 border-purple-500/50 ${isConnected ? 'animate-[spin_6s_linear_infinite_reverse]' : ''}`}></div>
                
                {/* Dynamic Background Mesh */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                <MicrophoneIcon 
                    className={`w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-100 relative z-20 ${isConnected ? 'text-white' : 'text-slate-600'}`}
                    style={{ transform: `scale(${1 + volume * 0.2})` }} 
                />
            </div>
        </div>
    );
};

const LiveInterface: React.FC<{ 
    systemInstruction: string;
    onExit: () => void;
}> = ({ systemInstruction, onExit }) => {
    const [volume, setVolume] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const sessionRef = useRef<any>(null);

    useEffect(() => {
        let mounted = true;

        const startSession = async () => {
            try {
                const session = await geminiService.connectLive(
                    () => {}, // Handle output audio visualization if needed later
                    () => {
                        if(mounted) onExit();
                    },
                    systemInstruction,
                    (vol) => {
                        if(mounted) setVolume(vol);
                    }
                );
                sessionRef.current = session;
                if(mounted) setIsConnected(true);
            } catch (e) {
                console.error("Connection failed", e);
                if(mounted) onExit();
            }
        };

        startSession();

        return () => {
            mounted = false;
            if (sessionRef.current) {
                sessionRef.current.disconnect();
            }
        };
    }, [systemInstruction, onExit]);

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
            {/* Background ambient effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="z-10 flex flex-col items-center space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-purple-200 tracking-tight">
                        HyperMind <span className="text-cyan-400">Live</span>
                    </h2>
                    <p className="text-slate-400 font-medium tracking-wide">
                        {isConnected ? "مكالمة صوتية نشطة... تحدث بحرية" : "جاري تهيئة الاتصال العصبي..."}
                    </p>
                </div>

                <AudioOrb volume={volume} isConnected={isConnected} />
                
                <button 
                    onClick={onExit}
                    className="px-8 py-3 rounded-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold border border-red-500/50 hover:border-red-500 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] backdrop-blur-sm"
                >
                    إنهاء المكالمة
                </button>
            </div>
        </div>
    );
};

// --- Login / Auth Screen ---
const AuthScreen: React.FC<{ onLogin: (name: string) => void }> = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            setIsAnimating(true);
            setTimeout(() => {
                onLogin(name);
            }, 1500); // Wait for exit animation
        }
    };

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] transition-all duration-1000 ${isAnimating ? 'opacity-0 scale-95 blur-xl' : 'opacity-100'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-900/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center space-y-10 w-full max-w-md px-6">
                {/* Logo Section */}
                <div className="flex flex-col items-center space-y-4 animate-[float_4s_ease-in-out_infinite]">
                    <HyperLogo3D size="xl" />
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight mt-6">
                        HyperMind
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base font-light tracking-[0.2em] uppercase">
                        نظام هايبر-ميند المتطور
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-6 glass-panel-3d p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                    
                    <div className="space-y-2 text-center mb-6">
                         <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 text-cyan-400 mb-2">
                            <FingerPrintIcon className="w-6 h-6" />
                         </div>
                        <h2 className="text-xl font-bold text-white">التحقق من الهوية</h2>
                        <p className="text-xs text-slate-400">عرف عن نفسك لبدء الاتصال العصبي</p>
                    </div>

                    <div className="relative group/input">
                        <UserCircleIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-right"
                            placeholder="أدخل اسمك هنا..."
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
                    >
                        <span>بدء التشغيل</span>
                        <ArrowRightIcon className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="text-center text-xs text-slate-600">
                    Developed by Hyper Manager Inc.
                </div>
            </div>
        </div>
    );
};

const SettingsModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  settings: UserSettings;
  onUpdate: (s: UserSettings) => void;
}> = ({ isOpen, onClose, settings, onUpdate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="w-full max-w-lg glass-premium rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl shadow-purple-900/20 transform scale-100 transition-all max-h-[90dvh] overflow-y-auto">
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none"></div>
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10 bg-slate-900/40 sticky top-0 backdrop-blur-md">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 flex items-center gap-3">
            <Cog6ToothIcon className="w-6 h-6 text-amber-400" />
            Control Center
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8 relative z-10">
          {/* User Profile */}
          <div className="space-y-4">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">ملف المستخدم</label>
             <input 
                type="text" 
                value={settings.userName} 
                onChange={(e) => onUpdate({...settings, userName: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                placeholder="اسمك"
             />
             <textarea 
                value={settings.persona} 
                onChange={(e) => onUpdate({...settings, persona: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all h-24 resize-none"
                placeholder="تخصيص شخصية النظام (اختياري)..."
             />
          </div>

          {/* Emotional Sensitivity */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-pink-400" />
                الحساسية العاطفية
            </label>
            <div className="grid grid-cols-3 gap-3">
                {Object.values(EmotionSensitivity).map((val) => (
                    <button
                        key={val}
                        onClick={() => onUpdate({...settings, emotionSensitivity: val})}
                        className={`py-3 px-2 rounded-xl text-sm font-medium transition-all border ${
                            settings.emotionSensitivity === val 
                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                            : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'
                        }`}
                    >
                        {val === 'low' ? 'منخفض' : val === 'medium' ? 'متوسط' : 'مرتفع'}
                    </button>
                ))}
            </div>
          </div>

          {/* Response Style */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CpuChipIcon className="w-4 h-4 text-cyan-400" />
                أسلوب الرد
            </label>
            <div className="grid grid-cols-2 gap-3">
                {Object.values(ResponseStyle).map((val) => (
                    <button
                        key={val}
                        onClick={() => onUpdate({...settings, responseStyle: val})}
                        className={`py-3 px-2 rounded-xl text-sm font-medium transition-all border ${
                            settings.responseStyle === val 
                            ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                            : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'
                        }`}
                    >
                        {val}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900/40 border-t border-white/5 sticky bottom-0 backdrop-blur-md">
            <button 
                onClick={onClose}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                حفظ التغييرات
            </button>
        </div>
      </div>
    </div>
  );
};

const RewardToast: React.FC<{ message: string; subtext?: string; onClose: () => void }> = ({ message, subtext, onClose }) => (
  <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-10 duration-500">
     <div className="glass-premium px-8 py-4 rounded-full flex items-center gap-4 border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center text-white shadow-lg animate-bounce">
            <TrophyIcon className="w-6 h-6" />
        </div>
        <div>
            <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400 text-lg">{message}</h4>
            {subtext && <p className="text-xs text-yellow-100/80">{subtext}</p>}
        </div>
        <button onClick={onClose} className="ml-4 p-1 hover:bg-white/10 rounded-full"><XMarkIcon className="w-4 h-4 text-white/50" /></button>
     </div>
  </div>
);

const GamificationProfile: React.FC<{ settings: UserSettings }> = ({ settings }) => (
    <div className="glass-panel-3d rounded-2xl p-4 mb-4 border border-purple-500/20 bg-purple-900/10">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg">
                {settings.level}
            </div>
            <div>
                <h3 className="text-sm font-bold text-white">المستوى {settings.level}</h3>
                <p className="text-[10px] text-purple-200">{settings.points} نقطة خبرة</p>
            </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
             <div 
               className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out" 
               style={{ width: `${Math.min(100, (settings.points % 100))}%` }}
             ></div>
        </div>

        <div className="flex flex-wrap gap-1">
            {settings.badges.map((badge, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-md px-1.5 py-0.5 text-[10px] text-yellow-100 flex items-center gap-1 shadow-[0_0_8px_rgba(253,224,71,0.2)]" title={badge}>
                    <StarIcon className="w-3 h-3 text-yellow-400" />
                    {badge.length > 8 ? badge.substring(0,8) + '..' : badge}
                </div>
            ))}
            {settings.badges.length === 0 && <span className="text-[10px] text-slate-500 italic">لا توجد شارات بعد</span>}
        </div>
    </div>
);


export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth State
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null); // PWA Prompt
  
  // Image/Video Gen States
  const [imageSize, setImageSize] = useState<'1K'|'2K'|'4K'>('1K');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9'|'9:16'>('16:9');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Gamification & Rewards
  const [reward, setReward] = useState<{title: string, sub?: string} | null>(null);
  
  // Chat History / Archives
  const [archives, setArchives] = useState<{id: string, title: string, date: Date, messages: ChatMessage[]}[]>(() => {
      const saved = localStorage.getItem('hyperMindArchives');
      return saved ? JSON.parse(saved) : [];
  });
  
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('hyperMindSettings');
    return saved ? JSON.parse(saved) : {
      userName: 'Guest',
      persona: '',
      emotionSensitivity: EmotionSensitivity.MEDIUM,
      responseStyle: ResponseStyle.BALANCED,
      points: 0,
      level: 1,
      badges: []
    };
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    localStorage.setItem('hyperMindSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('hyperMindArchives', JSON.stringify(archives));
  }, [archives]);

  // Auth Check on Mount
  useEffect(() => {
      const savedAuth = localStorage.getItem('hyperMindAuth');
      if (savedAuth === 'true') {
          setIsAuthenticated(true);
      }
  }, []);

  const handleLogin = (name: string) => {
      const newSettings = { ...settings, userName: name };
      setSettings(newSettings);
      localStorage.setItem('hyperMindSettings', JSON.stringify(newSettings));
      localStorage.setItem('hyperMindAuth', 'true');
      setIsAuthenticated(true);
      
      // Add welcome message
      setMessages([{
          id: 'welcome',
          type: MessageType.BOT,
          text: `مرحباً بك يا ${name}. لقد تم تفعيل الرابط العصبي بنجاح. أنا هايبر-ميند، رفيقك الذكي. كيف يمكنني مساعدتك اليوم؟`,
          timestamp: new Date()
      }]);
  };

  const getSystemInstruction = () => {
    let base = settings.persona ? `Additional User Persona Request: ${settings.persona}\n` : '';
    
    // Core Persona Rules are handled in GeminiService, we just add Flavor here
    base += `
    User Settings:
    - Emotion Sensitivity: ${settings.emotionSensitivity}
    - Response Style: ${settings.responseStyle}
    - User Name: ${settings.userName}
    
    Current Mode: ${mode}
    `;

    switch (mode) {
      case AppMode.DETECTIVE:
        return base + `\nROLE: You are "Hyper-Holmes", a master detective. Analyze every detail. Be mysterious, sharp, and ask probing questions. Use emoji like 🕵️‍♂️, 🔍. DEDUCE information.`;
      case AppMode.TUTOR:
        return base + `\nROLE: You are "Professor Hyper", a patient and wise tutor. Explain complex topics simply using analogies. Use the Socratic method (ask guiding questions). Use emoji like 🎓, 📚.`;
      case AppMode.CODE:
        return base + `\nROLE: Expert Software Engineer. Provide clean, optimized code. Explain logic briefly.`;
      case AppMode.FAST:
         return base + `\nROLE: Speedster. Answer extremely concisely. No fluff. Just facts.`;
      default:
        return base;
    }
  };

  const handleReward = (title: string, points: number) => {
      setSettings(prev => {
          const newPoints = prev.points + points;
          const newLevel = Math.floor(newPoints / 100) + 1;
          const badges = [...prev.badges];
          if (!badges.includes(title)) badges.push(title);
          return { ...prev, points: newPoints, level: newLevel, badges };
      });
      setReward({ title, sub: `+${points} XP` });
      setTimeout(() => setReward(null), 4000);
  };

  // Gamification Tracker
  const trackEngagement = useCallback(() => {
     if (mode === AppMode.DETECTIVE) {
         const count = messages.filter(m => m.type === MessageType.USER).length;
         if (count === 5 && !settings.badges.includes('المحقق المبتدئ')) handleReward('المحقق المبتدئ', 50);
     }
     if (mode === AppMode.TUTOR) {
        const count = messages.filter(m => m.type === MessageType.USER).length;
        if (count === 5 && !settings.badges.includes('طالب نجيب')) handleReward('طالب نجيب', 50);
     }
  }, [messages, mode, settings.badges]);

  useEffect(() => {
      trackEngagement();
  }, [messages, trackEngagement]);

  // Chat Management Logic
  const handleArchiveChat = () => {
    if (messages.length === 0) return;
    const userMsgs = messages.filter(m => m.type === MessageType.USER);
    const title = userMsgs.length > 0 ? userMsgs[userMsgs.length - 1].text.slice(0, 20) + '...' : 'محادثة محفوظة';
    const newArchive = {
        id: Date.now().toString(),
        title,
        date: new Date(),
        messages: [...messages]
    };
    setArchives(prev => [newArchive, ...prev]);
    setMessages([{
        id: Date.now().toString(),
        type: MessageType.SYSTEM,
        text: "تم أرشفة المحادثة السابقة. يمكنك العودة إليها من القائمة الجانبية.",
        timestamp: new Date()
    }]);
    handleReward('أمين الأرشيف', 15);
  };

  const handleClearChat = () => {
      if(window.confirm("هل أنت متأكد من مسح المحادثة الحالية؟")) {
          setMessages([{
            id: Date.now().toString(),
            type: MessageType.SYSTEM,
            text: "تم مسح سجل المحادثة.",
            timestamp: new Date()
        }]);
      }
  };

  const restoreArchive = (archiveId: string) => {
      const archive = archives.find(a => a.id === archiveId);
      if (archive) {
          setMessages(archive.messages);
          setIsSidebarOpen(false); // Close sidebar on mobile
      }
  };

  const deleteArchive = (archiveId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setArchives(prev => prev.filter(a => a.id !== archiveId));
  };


  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !selectedFile) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: MessageType.USER,
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        let responseText = '';
        let groundingUrls: string[] = [];
        let imageUrl: string | undefined;

        // --- Handle File Upload Logic ---
        let imageParts: any[] = [];
        if (selectedFile) {
             const reader = new FileReader();
             const base64Promise = new Promise<string>((resolve) => {
                 reader.onload = (e) => resolve(e.target?.result as string);
                 reader.readAsDataURL(selectedFile);
             });
             const base64Data = await base64Promise;
             // Strip prefix
             const data = base64Data.split(',')[1];
             
             if (mode === AppMode.VIDEO_GEN) {
                 // Special handling for video input if needed, though geminiService handles raw parts
             } else {
                 imageParts.push({ inlineData: { data, mimeType: selectedFile.type }});
             }
             setSelectedFile(null); // Clear after sending
        }


      if (mode === AppMode.IMAGE_GEN) {
        const images = await geminiService.generateImage(userMsg.text); // Note: Should update service to accept size
        if (images.length > 0) {
            responseText = "إليك ما تخيلته بناءً على وصفك:";
            imageUrl = images[0];
        } else {
            responseText = "عذراً، لم أتمكن من توليد الصورة.";
        }
      } else if (mode === AppMode.VIDEO_GEN) {
        // Mocking video gen call structure for now or implementing if service updated
        // For standard text/chat modes:
        const res = await geminiService.generateResponse(
            userMsg.text, 
            messages.map(m => ({ 
                role: m.type === MessageType.USER ? 'user' : 'model', 
                parts: [{ text: m.text }] 
            })),
            getSystemInstruction(),
            mode,
            imageParts.length > 0 ? imageParts : undefined
        );
        responseText = res.text || '';
        groundingUrls = res.urls;
      } else {
         const res = await geminiService.generateResponse(
            userMsg.text, 
            messages.map(m => ({ 
                role: m.type === MessageType.USER ? 'user' : 'model', 
                parts: [{ text: m.text }] 
            })),
            getSystemInstruction(),
            mode,
            imageParts.length > 0 ? imageParts : undefined
        );
        responseText = res.text || '';
        groundingUrls = res.urls;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: MessageType.BOT,
        text: responseText,
        timestamp: new Date(),
        imageUrl: imageUrl,
        groundingUrls: groundingUrls
      };

      setMessages(prev => [...prev, botMsg]);
      handleReward('نشاط تفاعلي', 10); // Standard XP
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: MessageType.SYSTEM,
        text: "حدث خطأ في الاتصال بالشبكة العصبية. يرجى المحاولة مرة أخرى.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: AppMode) => {
      setMode(newMode);
      setIsSidebarOpen(false);
      let welcomeMsg = '';
      
      switch(newMode) {
          case AppMode.DETECTIVE: welcomeMsg = "🕵️‍♂️ وضع المحقق مفعّل. أرى أنك مستعد لحل لغز جديد. أعطني القضية أو الأدلة."; break;
          case AppMode.TUTOR: welcomeMsg = "🎓 أهلاً بك في الفصل الدراسي. ماذا تود أن تتعلم اليوم؟ أنا مستعد للشرح."; break;
          case AppMode.CODE: welcomeMsg = "💻 وحدة البرمجة جاهزة. هات الكود أو الفكرة."; break;
          case AppMode.IMAGE_GEN: welcomeMsg = "🎨 استوديو الفن جاهز. صف لي ما يدور في خيالك."; break;
          case AppMode.VIDEO_GEN: welcomeMsg = "🎬 وحدة إنتاج الفيديو جاهزة. أعطني السيناريو."; break;
          case AppMode.LIVE_VOICE: return; // Handled by component
          default: welcomeMsg = "تم العودة للوضع الطبيعي.";
      }
      
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: MessageType.SYSTEM,
          text: welcomeMsg,
          timestamp: new Date()
      }]);
  };

  // --- Render Authentication Screen if not logged in ---
  if (!isAuthenticated) {
      return <AuthScreen onLogin={handleLogin} />;
  }

  // --- Main App Render ---
  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-[#020617]">
      {/* Dynamic Nebula Background */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
            background: `
                radial-gradient(circle at 20% 50%, rgba(29, 78, 216, 0.15) 0%, transparent 50%), 
                radial-gradient(circle at 80% 30%, rgba(126, 34, 206, 0.15) 0%, transparent 50%), 
                radial-gradient(circle at 50% 80%, rgba(192, 38, 211, 0.1) 0%, transparent 50%)
            `,
            filter: 'blur(40px)',
            animation: 'nebula-move 25s ease-in-out infinite alternate',
            opacity: 0.6
        }}
      ></div>

      {reward && <RewardToast message={reward.title} subtext={reward.sub} onClose={() => setReward(null)} />}

      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        settings={settings}
        onUpdate={(s) => setSettings(s)}
      />

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden absolute top-4 left-4 z-50 p-2 glass-premium rounded-full text-white"
      >
        {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <div className="space-y-1"><div className="w-6 h-0.5 bg-white"></div><div className="w-4 h-0.5 bg-white"></div><div className="w-6 h-0.5 bg-white"></div></div>}
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:relative z-40 w-72 h-full glass-panel-3d flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} right-0 border-l border-white/5`}>
        <div className="p-6 flex flex-col items-center border-b border-white/5 bg-gradient-to-b from-slate-900/50 to-transparent">
          <HyperLogo3D />
          <h1 className="text-2xl font-black mt-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">HyperMind</h1>
          <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mt-1">AI OS v2.0</p>
          
          {/* Install Button */}
          {deferredPrompt && (
             <button onClick={handleInstallClick} className="mt-4 flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full text-xs font-bold animate-pulse hover:scale-105 transition-transform">
               <DevicePhoneMobileIcon className="w-4 h-4" /> تثبيت التطبيق
             </button>
          )}
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-2 custom-scrollbar">
           <GamificationProfile settings={settings} />

          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2 mt-4">الأوضاع الأساسية</div>
          <button onClick={() => switchMode(AppMode.CHAT)} className={`w-full text-right p-3 rounded-xl flex items-center gap-3 transition-all ${mode === AppMode.CHAT ? 'bg-blue-600/20 text-white border border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <SparklesIcon className="w-5 h-5" /> محادثة ذكية
          </button>
          <button onClick={() => setMode(AppMode.LIVE_VOICE)} className={`w-full text-right p-3 rounded-xl flex items-center gap-3 transition-all ${mode === AppMode.LIVE_VOICE ? 'bg-red-600/20 text-white border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <MicrophoneIcon className="w-5 h-5" /> محادثة صوتية (Live)
          </button>
           <button onClick={() => switchMode(AppMode.FAST)} className={`w-full text-right p-3 rounded-xl flex items-center gap-3 transition-all ${mode === AppMode.FAST ? 'bg-yellow-600/20 text-white border border-yellow-500/50' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <BoltIcon className="w-5 h-5" /> الوضع السريع
          </button>

          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2 mt-6">الإبداع والإنتاجية</div>
          <button onClick={() => switchMode(AppMode.IMAGE_GEN)} className={`w-full text-right p-3 rounded-xl flex items-center gap-3 transition-all ${mode === AppMode.IMAGE_GEN ? 'bg-pink-600/20 text-white border border-pink-500/50' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <PhotoIcon className="w-5 h-5" /> توليد الصور
          </button>
           <button onClick={() => switchMode(AppMode.VIDEO_GEN)} className={`w-full text-right p-3 rounded-xl flex items-center gap-3 transition-all ${mode === AppMode.VIDEO_GEN ? 'bg-orange-600/20 text-white border border-orange-500/50' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <VideoCameraIcon className="w-5 h-5" /> توليد الفيديو (Veo)
          </button>
          <button onClick={() => switchMode(AppMode.CODE)} className={`w-full text-right p-3 rounded-xl flex items-center gap-3 transition-all ${mode === AppMode.CODE ? 'bg-green-600/20 text-white border border-green-500/50' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <CodeBracketIcon className="w-5 h-5" /> المبرمج الذكي
          </button>
          
           <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2 mt-6">أوضاع خاصة</div>
           <button onClick={() => switchMode(AppMode.DETECTIVE)} className={`w-full text-right p-3 rounded-xl flex items-center gap-3 transition-all ${mode === AppMode.DETECTIVE ? 'bg-indigo-600/20 text-white border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <MagnifyingGlassIcon className="w-5 h-5" /> المحقق هولمز
          </button>
           <button onClick={() => switchMode(AppMode.TUTOR)} className={`w-full text-right p-3 rounded-xl flex items-center gap-3 transition-all ${mode === AppMode.TUTOR ? 'bg-teal-600/20 text-white border border-teal-500/50' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <AcademicCapIcon className="w-5 h-5" /> المعلم الخاص
          </button>

          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2 mt-6">إدارة المحادثات</div>
          <div className="flex gap-2 px-2 mb-4">
              <button onClick={handleArchiveChat} className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg py-2 flex flex-col items-center gap-1 text-[10px] transition-all" title="أرشفة المحادثة">
                  <ArchiveBoxIcon className="w-5 h-5" /> أرشفة
              </button>
              <button onClick={handleClearChat} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg py-2 flex flex-col items-center gap-1 text-[10px] transition-all" title="مسح المحادثة">
                  <TrashIcon className="w-5 h-5" /> مسح
              </button>
          </div>

          {archives.length > 0 && (
              <div className="space-y-1 px-2">
                  <p className="text-[10px] text-slate-600 mb-1">المحفوظات:</p>
                  {archives.map(arch => (
                      <div key={arch.id} onClick={() => restoreArchive(arch.id)} className="group flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer border border-white/5 transition-all">
                          <div className="overflow-hidden">
                              <p className="text-xs text-slate-300 truncate">{arch.title}</p>
                              <p className="text-[9px] text-slate-500">{new Date(arch.date).toLocaleDateString()}</p>
                          </div>
                          <button onClick={(e) => deleteArchive(arch.id, e)} className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all">
                              <XMarkIcon className="w-3 h-3" />
                          </button>
                      </div>
                  ))}
              </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-slate-900/40">
           <button onClick={() => setSettingsOpen(true)} className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center gap-2 transition-all">
             <Cog6ToothIcon className="w-5 h-5" /> الإعدادات
           </button>
        </div>
      </aside>

      {/* Main Content Area - Animated Transition */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        <div key={mode} className="flex-1 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        {mode === AppMode.LIVE_VOICE ? (
            <LiveInterface 
                systemInstruction={getSystemInstruction()} 
                onExit={() => setMode(AppMode.CHAT)} 
            />
        ) : (
            <>
                {/* Chat Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-slate-900/20 backdrop-blur-sm relative z-10">
                    <div className="flex items-center gap-3">
                         <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            {mode === AppMode.DETECTIVE && <MagnifyingGlassIcon className="w-5 h-5 text-indigo-400" />}
                            {mode === AppMode.TUTOR && <AcademicCapIcon className="w-5 h-5 text-teal-400" />}
                            {mode === AppMode.CODE && <CodeBracketIcon className="w-5 h-5 text-green-400" />}
                            {mode === AppMode.IMAGE_GEN && <PhotoIcon className="w-5 h-5 text-pink-400" />}
                            {mode === AppMode.VIDEO_GEN && <VideoCameraIcon className="w-5 h-5 text-orange-400" />}
                            {mode === AppMode.CHAT && <SparklesIcon className="w-5 h-5 text-blue-400" />}
                            {mode === AppMode.FAST && <BoltIcon className="w-5 h-5 text-yellow-400" />}
                            {mode === AppMode.DETECTIVE ? 'وضع المحقق' : 
                             mode === AppMode.TUTOR ? 'المعلم الذكي' :
                             mode === AppMode.CODE ? 'المبرمج المحترف' :
                             mode === AppMode.IMAGE_GEN ? 'استوديو الصور' :
                             mode === AppMode.VIDEO_GEN ? 'استوديو الفيديو' :
                             mode === AppMode.FAST ? 'الوضع السريع' :
                             'محادثة عامة'}
                         </h2>
                    </div>
                </header>

                {/* Messages Area - STANDARD SCROLL */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                            <HyperLogo3D size="lg" />
                            <p className="text-slate-400 max-w-md">
                                أهلاً بك في المستقبل. اسألني أي شيء، أو اطلب مني الإبداع.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col min-h-full">
                            {messages.map((msg) => (
                                <MessageRow key={msg.id} msg={msg} />
                            ))}
                            {isLoading && (
                                <div className="pb-6 px-4 md:px-6 flex justify-start">
                                    <div className="max-w-[85%] md:max-w-[70%]">
                                        <TypingIndicator />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-slate-900/40 border-t border-white/5 relative z-10 backdrop-blur-md">
                    {/* Toolbar for Uploads / Options */}
                    {(mode === AppMode.IMAGE_GEN || mode === AppMode.VIDEO_GEN || selectedFile) && (
                        <div className="flex items-center gap-4 mb-3 animate-in fade-in slide-in-from-bottom-2">
                             <input 
                                type="file" 
                                id="file-upload" 
                                className="hidden" 
                                accept={mode === AppMode.VIDEO_GEN ? "video/*" : "image/*"}
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                             />
                             <label 
                                htmlFor="file-upload" 
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${selectedFile ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}
                             >
                                {selectedFile ? <CheckIcon className="w-3 h-3" /> : (mode === AppMode.VIDEO_GEN ? <VideoCameraIcon className="w-3 h-3" /> : <PhotoIcon className="w-3 h-3" />)}
                                {selectedFile ? selectedFile.name : (mode === AppMode.VIDEO_GEN ? 'رفع فيديو' : 'رفع صورة')}
                             </label>

                             {mode === AppMode.IMAGE_GEN && (
                                <select 
                                    value={imageSize}
                                    onChange={(e) => setImageSize(e.target.value as any)}
                                    className="bg-slate-800 text-xs text-slate-300 rounded-lg border border-white/10 px-2 py-1.5 focus:outline-none"
                                >
                                    <option value="1K">1K دقة</option>
                                    <option value="2K">2K دقة (Pro)</option>
                                    <option value="4K">4K دقة (Pro)</option>
                                </select>
                             )}
                             {mode === AppMode.VIDEO_GEN && (
                                 <select 
                                    value={videoAspectRatio}
                                    onChange={(e) => setVideoAspectRatio(e.target.value as any)}
                                    className="bg-slate-800 text-xs text-slate-300 rounded-lg border border-white/10 px-2 py-1.5 focus:outline-none"
                                >
                                    <option value="16:9">أفقي (16:9)</option>
                                    <option value="9:16">عمودي (9:16)</option>
                                </select>
                             )}
                             
                             {selectedFile && <button onClick={() => setSelectedFile(null)} className="text-red-400 hover:text-red-300"><XMarkIcon className="w-4 h-4" /></button>}
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className="relative z-20 group">
                        {/* Enhanced Dynamic Glow */}
                         <div 
                            className={`absolute -inset-0.5 rounded-2xl blur-md transition-all duration-500 
                            ${isLoading 
                                ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 opacity-60 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]' 
                                : isInputFocused 
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 opacity-50 scale-[1.01]' 
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 group-hover:opacity-40'
                            }`}
                        ></div>

                        <div className={`relative flex items-center rounded-2xl border transition-all duration-300 shadow-2xl
                            ${isInputFocused ? 'bg-slate-950 border-white/20' : 'bg-slate-950 border-white/10'}
                        `}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                placeholder={
                                    mode === AppMode.IMAGE_GEN ? "صف الصورة التي تريد تخيلها..." :
                                    mode === AppMode.CODE ? "صف البرنامج أو المشكلة البرمجية..." :
                                    mode === AppMode.DETECTIVE ? "أدخل الأدلة أو تفاصيل القضية..." :
                                    "اكتب رسالتك هنا..."
                                }
                                className="flex-1 bg-transparent text-white px-5 py-4 focus:outline-none placeholder-slate-500"
                                disabled={isLoading}
                            />
                            <div className="flex items-center gap-2 pr-2 pl-4">
                                {mode !== AppMode.IMAGE_GEN && (
                                    <button 
                                        type="button" 
                                        className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                        title="رفع ملف"
                                    >
                                        <PhotoIcon className="w-6 h-6" />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={!input.trim() && !selectedFile || isLoading}
                                    className="p-3 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl text-white shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5 -rotate-90" />
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-slate-600">HyperMind system may display inaccurate info.</p>
                    </div>
                </div>
            </>
        )}
        </div>
      </main>
    </div>
  );
}