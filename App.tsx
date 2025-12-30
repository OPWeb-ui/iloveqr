import React, { useState, useRef, useEffect } from 'react';
import QRCodeGenerator from './components/QRCodeGenerator';
import ScannerModal from './components/ScannerModal';
import { Logo } from './components/Logo';
import { Tooltip } from './components/Tooltip';
import { ScanLine, Mail, Copy, Check, Info, Shield, HelpCircle, MessageSquare, Lightbulb, Cpu, Globe, Zap, History, Milestone, Layers, Target, Database, Activity, ArrowUp } from 'lucide-react';

type View = 'generator' | 'help' | 'faq' | 'encyclopedia';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('generator');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const supportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When switching views, jump to top instantly to avoid weird travel animation
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeView]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (supportRef.current && !supportRef.current.contains(event.target as Node)) {
        setIsSupportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Header visibility logic
      if (currentScrollY < 20) {
        setIsHeaderVisible(true);
      } else {
        setIsHeaderVisible(false);
      }

      // Back to top logic
      if (currentScrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer or Click Handler for smooth scrolling to anchors
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        const element = document.querySelector(anchor.hash);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('eztifyapps@gmail.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleScanSuccess = (data: string) => {
    setScannedData(data);
    setIsScannerOpen(false);
    setActiveView('generator');
  };

  const NavLink: React.FC<{ view: View; label: string; tooltip: string }> = ({ view, label, tooltip }) => (
    <Tooltip content={tooltip} position="bottom">
      <button
        onClick={() => setActiveView(view)}
        className={`transition-all duration-200 hover:text-cyan-400 border-b-2 py-1 px-1 beam-btn rounded-sm ${activeView === view ? 'text-cyan-400 border-cyan-400/50' : 'text-white/70 border-transparent'}`}
      >
        {label}
      </button>
    </Tooltip>
  );

  return (
    <div className="min-h-screen text-white selection:bg-cyan-500/30 flex flex-col relative">
      {/* GLOBAL BACK TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-[100] p-4 glass rounded-full border border-white/10 shadow-[0_0_20px_rgba(34,211,238,0.2)] text-cyan-400 hover:scale-110 active:scale-95 transition-all duration-300 ${showBackToTop ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-50 pointer-events-none'}`}
      >
        <ArrowUp size={24} />
      </button>

      <nav className={`fixed top-0 left-0 w-full z-[100] px-4 py-3 md:px-12 md:py-8 flex justify-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'}`}>
        <header className="w-full max-w-7xl glass rounded-xl md:rounded-2xl px-5 py-3 md:px-8 md:py-4 flex items-center justify-between border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 md:gap-4 cursor-pointer group" onClick={() => setActiveView('generator')}>
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-lg blur-xl opacity-20 group-hover:opacity-60 transition duration-500"></div>
              <Logo className="relative z-10 w-8 h-8 md:w-9 md:h-9 transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="flex flex-col -space-y-0.5 md:-space-y-1">
              <h1 id="top" className="text-xl md:text-2xl font-black bg-gradient-to-r from-white to-white/90 text-transparent bg-clip-text tracking-tighter uppercase">
                iLoveQR
              </h1>
              <span className="text-[9px] md:text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase ml-0.5">by EZTIFY</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 lg:gap-12 text-xs font-black uppercase tracking-[0.2em]">
            <NavLink view="generator" label="Generate" tooltip="QR Studio" />
            <NavLink view="encyclopedia" label="Encyclopedia" tooltip="Technical Guide" />
            <NavLink view="help" label="Help" tooltip="User Guide" />
            <NavLink view="faq" label="FAQ" tooltip="Questions" />
          </div>

          <div className="flex items-center gap-3 md:gap-4" ref={supportRef}>
            <button 
              onClick={() => { setIsScannerOpen(true); setIsSupportOpen(false); }}
              className="md:hidden px-4 py-2 glass rounded-lg text-[10px] font-black uppercase tracking-[0.15em] hover:bg-white/10 transition-all flex items-center gap-2 border-white/10 beam-btn text-white/90"
            >
              <ScanLine size={14} className="text-cyan-400" />
              <span>Scan</span>
            </button>

            <Tooltip content="Direct Support" position="bottom">
              <button 
                onClick={() => setIsSupportOpen(!isSupportOpen)}
                className="px-4 py-2 md:px-6 md:py-3 glass rounded-lg text-[10px] font-black uppercase tracking-[0.15em] hover:bg-white/10 transition-all flex items-center gap-2 border-white/10 beam-btn text-white/90 shadow-lg"
              >
                <Mail size={16} className="text-cyan-400" />
                <span className="hidden sm:inline">Support</span>
                <span className="inline sm:hidden">Help</span>
              </button>
            </Tooltip>
            {isSupportOpen && (
              <div className="absolute right-0 top-full mt-4 w-72 md:w-80 bg-[#0a0a0f]/95 backdrop-blur-3xl rounded-xl p-6 animate-slide-in-up-fade shadow-[0_50px_100_rgba(0,0,0,0.8)] border border-white/10 ring-1 ring-white/5 z-50">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Direct Support</h3>
                    <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium">Usually responds within 24h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3.5 border border-white/10 shadow-inner group">
                  <span className="text-[11px] font-mono text-white/80 flex-1 truncate">eztifyapps@gmail.com</span>
                  <button onClick={handleCopyEmail} className="p-2 hover:bg-white/10 rounded-lg transition-all beam-btn">
                    {isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-white/40 group-hover:text-white/80 transition-colors" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
      </nav>

      <main className="container mx-auto px-4 pt-24 md:pt-40 pb-32 max-w-7xl flex-grow">
        {activeView === 'generator' && (
          <div className="animate-slide-in-up-fade">
             {scannedData && (
              <div className="max-w-4xl mx-auto mb-8 md:mb-16 glass-card p-6 md:p-12 rounded-2xl flex flex-col md:flex-row items-center gap-6 md:gap-8 border-cyan-500/20 shadow-cyan-500/10">
                <div className="p-4 md:p-6 bg-cyan-500/10 rounded-2xl text-cyan-400 shadow-xl">
                  <Info size={32} className="md:w-10 md:h-10" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-2 md:mb-3">Decoded Data Result</h3>
                  <p className="text-lg md:text-2xl font-bold text-white break-all leading-tight tracking-tight">{scannedData}</p>
                </div>
                <button 
                  onClick={() => setScannedData(null)} 
                  className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 px-8 py-4 md:px-10 md:py-5 rounded-xl transition-all border border-white/10 active:scale-95 beam-btn text-white"
                >
                  Clear Results
                </button>
              </div>
            )}
            <QRCodeGenerator initialText={scannedData || ''} />
          </div>
        )}

        {activeView === 'encyclopedia' && (
          <div className="animate-slide-in-up-fade max-w-6xl mx-auto space-y-12">
            {/* COMPACT HEADER */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-4 border-b border-white/10 pb-10">
              <div className="space-y-2">
                <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                  QR <span className="text-cyan-400">Encyclopedia</span>
                </h2>
                <p className="text-white/40 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">
                  Technical Symbology & History
                </p>
              </div>
              <div className="hidden md:block text-right">
                <div className="px-4 py-2 glass rounded-lg border-white/5 text-[9px] font-black uppercase tracking-widest text-cyan-400/80">
                  Global Matrix Standard ISO/IEC 18004
                </div>
              </div>
            </div>

            {/* QUICK STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <Database size={18} />, label: "Max Data", val: "7,089 Digits", color: "cyan" },
                { icon: <Layers size={18} />, label: "Versions", val: "1 through 40", color: "purple" },
                { icon: <Shield size={18} />, label: "Resilience", val: "Up to 30%", color: "pink" },
                { icon: <Activity size={18} />, label: "Scan Speed", val: "30ms - 100ms", color: "green" }
              ].map((stat, i) => (
                <div key={i} className="glass-card bg-black/40 p-5 rounded-xl border-white/5 flex items-center gap-4">
                  <div className={`p-2.5 bg-${stat.color}-500/10 rounded-lg text-${stat.color}-400 shrink-0`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-white/30">{stat.label}</div>
                    <div className="text-sm font-bold text-white">{stat.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* TWO COLUMN COMPACT CONTENT */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN: ANATOMY & STRUCTURE */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card bg-white/[0.02] p-8 rounded-2xl border-white/5 space-y-6">
                  <div className="flex items-center gap-3">
                    <Target className="text-cyan-400" size={20} />
                    <h3 className="text-lg font-black uppercase tracking-widest">Code Anatomy</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
                        <h4 className="font-bold text-cyan-400 mb-1 uppercase text-xs tracking-widest flex items-center gap-2" id="ref-finder">
                          Finder Patterns <a href="#footnote-1" className="text-[10px] text-white/20 hover:text-cyan-400 font-mono">[1]</a>
                        </h4>
                        <p className="text-white/50 text-xs leading-relaxed">The large nested squares in three corners allow the scanner to identify the code's orientation and size instantly.</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
                        <h4 className="font-bold text-purple-400 mb-1 uppercase text-xs tracking-widest">Timing Patterns</h4>
                        <p className="text-white/50 text-xs leading-relaxed">Alternating black/white modules that act as a coordinate system, helping the software determine the data grid's pitch.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
                        <h4 className="font-bold text-pink-400 mb-1 uppercase text-xs tracking-widest">Alignment Patterns</h4>
                        <p className="text-white/50 text-xs leading-relaxed">Smaller squares in larger codes that correct for distortion when scanning curved surfaces like bottles or bags.</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
                        <h4 className="font-bold text-green-400 mb-1 uppercase text-xs tracking-widest flex items-center gap-2" id="ref-quiet">
                          Quiet Zone <a href="#footnote-2" className="text-[10px] text-white/20 hover:text-green-400 font-mono">[2]</a>
                        </h4>
                        <p className="text-white/50 text-xs leading-relaxed">A mandatory 4-module wide empty margin around the code required for reliable recognition by optical sensors.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-card bg-black/40 p-6 rounded-2xl border-white/5 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Error Correction (Reed-Solomon)</h3>
                    <div className="space-y-2">
                      {[
                        { lvl: "Level L", cap: "7% Recovery", desc: "Highest storage capacity" },
                        { lvl: "Level M", cap: "15% Recovery", desc: "Standard usage balance" },
                        { lvl: "Level Q", cap: "25% Recovery", desc: "Safe for custom branding" },
                        { lvl: "Level H", cap: "30% Recovery", desc: "Industrial/Damaged environments" }
                      ].map((ec, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5">
                          <div>
                            <span className="text-[10px] font-black text-white/90">{ec.lvl}</span>
                            <span className="text-[9px] text-white/30 ml-2 italic">{ec.desc}</span>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-400">{ec.cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card bg-black/40 p-6 rounded-2xl border-white/5 flex flex-col justify-center text-center space-y-4">
                    <Lightbulb className="text-yellow-400/50 mx-auto" size={32} />
                    <h4 className="text-sm font-bold uppercase tracking-widest">Legacy Invention</h4>
                    <p className="text-[11px] text-white/50 leading-relaxed italic">
                      "A QR code can be read even if 30% of it is obscured, ripped, or covered by a logo."
                    </p>
                    <div className="h-px bg-white/10 w-12 mx-auto"></div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">- Denso Wave Engineering</p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: TIMELINE & ORIGINS */}
              <div className="space-y-6">
                 <div className="glass-card bg-cyan-500/5 p-6 rounded-2xl border border-cyan-500/10 space-y-6 h-full">
                    <div className="flex items-center gap-3">
                      <History className="text-cyan-400" size={18} />
                      <h3 className="text-xs font-black uppercase tracking-[0.3em]">Historical Timeline</h3>
                    </div>
                    <div className="space-y-8 relative">
                      <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10"></div>
                      {[
                        { yr: "1994", title: "The Invention", body: "Masahiro Hara at Denso Wave creates the system to track auto parts with 360° readability." },
                        { yr: "2000", title: "ISO Standard", body: "The International Organization for Standardization formally recognizes QR Code as ISO/IEC 18004." },
                        { yr: "2011", title: "Consumer Shift", body: "Integration into mobile OS camera apps transforms the code into a gateway for digital marketing." },
                        { yr: "2020", title: "Global Essential", body: "Pandemic-era adoption makes QR the universal standard for contactless interactions." }
                      ].map((item, i) => (
                        <div key={i} className="relative pl-10">
                          <div className="absolute left-0 top-1 w-6 h-6 bg-[#0a0a0f] border border-cyan-400/50 rounded-full flex items-center justify-center z-10 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                          </div>
                          <div className="text-[10px] font-black text-cyan-400 mb-1">{item.yr}</div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">{item.title}</h4>
                          <p className="text-[10px] text-white/40 leading-relaxed">{item.body}</p>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
            
            {/* TECHNICAL VARIANTS SECTION */}
            <div className="glass-card bg-black/40 p-10 rounded-[2.5rem] border-white/5">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-black uppercase tracking-[0.3em] mb-2">Technical Variants</h3>
                <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest">Standardized form factors for specific data needs</p>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { name: "Standard QR", use: "Universal", cap: "High", desc: "The standard matrix code used globally for all URLs and text." },
                  { name: "Micro QR", use: "Small Parts", cap: "Low", desc: "Compact version requiring only one finder pattern for limited space." },
                  { name: "iQR Code", use: "Rectangles", cap: "Extreme", desc: "Can be formed in rectangular shapes for long, narrow surfaces." },
                  { name: "Frame QR", use: "Branding", cap: "Flexible", desc: "Includes a dedicated 'canvas area' for images without losing data." }
                ].map((v, i) => (
                  <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] transition-all group">
                    <div className="w-8 h-8 bg-cyan-400/10 rounded-lg flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                      <Zap size={16} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-2 text-white/90">{v.name}</h4>
                    <p className="text-[10px] text-white/40 leading-relaxed mb-4">{v.desc}</p>
                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest pt-4 border-t border-white/5">
                      <span className="text-white/30">Capacity</span>
                      <span className="text-cyan-400">{v.cap}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTNOTES SECTION */}
            <div className="pt-20 border-t border-white/5 space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">References & Citations</h4>
               <div className="space-y-4 text-[11px] text-white/40 leading-relaxed font-medium">
                  <div id="footnote-1" className="flex gap-4 group">
                    <span className="text-cyan-400 font-mono shrink-0">[1]</span>
                    <p>Finder patterns are officially defined in ISO/IEC 18004 as position detection patterns. They are crucial for 360-degree high-speed reading. <a href="#ref-finder" className="text-cyan-400/50 hover:text-cyan-400 underline underline-offset-4 ml-2 transition-colors">Return to context ↑</a></p>
                  </div>
                  <div id="footnote-2" className="flex gap-4 group">
                    <span className="text-green-400 font-mono shrink-0">[2]</span>
                    <p>The standard quiet zone width is at least four modules on each side. Failure to include this often results in scanning failure on noisy backgrounds. <a href="#ref-quiet" className="text-green-400/50 hover:text-green-400 underline underline-offset-4 ml-2 transition-colors">Return to context ↑</a></p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeView === 'help' && (
          <div className="animate-slide-in-up-fade max-w-5xl mx-auto space-y-20">
            <div className="text-center space-y-6">
              <h2 className="text-6xl font-black uppercase tracking-tighter">User <span className="text-cyan-400">Guide</span></h2>
              <p className="text-white/60 text-xl">Everything you need for perfect QR results.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="glass-card bg-black/30 p-12 rounded-3xl border-white/10 space-y-10 shadow-2xl">
                <HelpCircle className="text-cyan-400 w-16 h-16" />
                <h3 className="text-4xl font-black uppercase tracking-tighter">Workflow</h3>
                <ul className="space-y-8">
                  {[
                    "Paste your URL in the Payload field.",
                    "Style the pattern and corner architecture.",
                    "Integrate brand assets with alpha blending.",
                    "Download vector-perfect results instantly."
                  ].map((step, i) => (
                    <li key={i} className="flex gap-5 text-lg text-white/80 font-medium items-start">
                      <span className="text-cyan-400 font-black text-2xl leading-none">0{i+1}</span> {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card bg-black/30 p-12 rounded-3xl border-white/10 space-y-10 shadow-2xl">
                <Shield className="text-purple-400 w-16 h-16" />
                <h3 className="text-4xl font-black uppercase tracking-tighter">Security</h3>
                <p className="text-lg text-white/60 leading-relaxed font-light">
                  iLoveQR processes 100% of your data within the local browser environment. No logs, no telemetry, no tracking.
                </p>
                <div className="pt-6 flex items-center gap-3 text-[11px] font-black uppercase text-purple-400 tracking-widest px-6 py-3 bg-purple-500/5 rounded-xl border border-purple-500/10">
                  <Check size={16}/> Client-Side Verified
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'faq' && (
          <div className="animate-slide-in-up-fade max-w-3xl mx-auto space-y-20">
             <div className="text-center space-y-6">
              <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">Frequently <br/><span className="text-purple-400">Asked</span></h2>
            </div>

            <div className="space-y-6">
              {[
                { q: "Is it really 100% free?", a: "Yes. iLoveQR is an open utility by EZTIFY. No subscriptions, no hidden limits." },
                { q: "Commercial usage rights?", a: "You own 100% of the rights to any QR code generated here for print or digital media." },
                { q: "Best format for large print?", a: "Use SVG or PDF. These vector formats remain mathematically sharp at any scale." }
              ].map((item, i) => (
                <div key={i} className="glass-card bg-black/20 p-10 rounded-2xl border-white/5 group hover:bg-white/[0.04] transition-all shadow-xl">
                  <h4 className="text-xl font-bold text-white mb-4 flex gap-5 items-start">
                    <MessageSquare className="text-purple-400 mt-1 shrink-0" size={24} />
                    {item.q}
                  </h4>
                  <p className="text-white/60 text-lg leading-relaxed pl-11 font-light">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="py-24 border-t border-white/10 bg-[#020203]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-start gap-12">
            <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-default">
              <Logo className="w-10 h-10 grayscale" />
              <span className="text-2xl font-black uppercase tracking-tighter text-white/90">iLoveQR</span>
            </div>
            <div className="flex flex-wrap justify-start gap-8 md:gap-16 text-[12px] font-black uppercase tracking-[0.3em] text-white/50">
              <button onClick={() => setActiveView('generator')} className="hover:text-cyan-400 transition-colors beam-btn p-1 rounded">Generator</button>
              <button onClick={() => setActiveView('encyclopedia')} className="hover:text-cyan-400 transition-colors beam-btn p-1 rounded">Encyclopedia</button>
              <button onClick={() => setActiveView('help')} className="hover:text-cyan-400 transition-colors beam-btn p-1 rounded">Guide</button>
              <button onClick={() => setActiveView('faq')} className="hover:text-cyan-400 transition-colors beam-btn p-1 rounded">Support</button>
            </div>
            <div className="space-y-2 border-l-2 border-white/10 pl-8">
              <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.5em] text-left">
                &copy; {new Date().getFullYear()} EZTIFY.
              </p>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.7em] text-left">
                SOPHISTICATED UTILITIES FOR A MODERN WEB.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {isScannerOpen && <ScannerModal onClose={() => setIsScannerOpen(false)} onScanSuccess={handleScanSuccess} />}
    </div>
  );
};

export default App;