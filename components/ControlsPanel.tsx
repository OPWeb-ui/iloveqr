
import React, { useState, useRef, useEffect } from 'react';
import { FONT_PRESETS } from '../constants';
import { Tooltip } from './Tooltip';
import { 
  Download, Copy, Share2, Image as ImageIcon, ChevronDown, 
  Palette, Type, RefreshCw, Grid, Trash2, FileText, 
  Box, Settings2, Fingerprint, PenTool, Layout, SlidersHorizontal, Maximize,
  Database
} from 'lucide-react';

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center gap-1.5 md:gap-2 py-2.5 md:py-4 border-b-2 transition-all relative z-10 beam-btn ${
      active 
        ? 'text-cyan-400 border-cyan-400 bg-cyan-400/5' 
        : 'text-white/60 border-transparent hover:text-white/90 hover:bg-white/[0.02]'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'scale-100'}`}>{icon}</div>
    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.25em]">{label}</span>
  </button>
);

const CustomSelect: React.FC<{ options: { value: string; label: string }[]; value: string; onChange: (value: string) => void }> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 md:p-4 bg-white/[0.03] border border-white/5 rounded-sm text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/80 hover:bg-white/[0.06] transition-all beam-btn"
      >
        <span className="truncate mr-2">{selectedOption.label}</span>
        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-white/50 shrink-0`} />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1.5 w-full bg-[#0a0a0f] border border-white/10 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,1)] z-[600] max-h-48 overflow-y-auto py-1">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 md:px-5 md:py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors ${value === option.value ? 'text-cyan-400' : 'text-white/70'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ColorInput: React.FC<{ value: string; onChange: (color: string) => void }> = ({ value, onChange }) => (
  <div className="flex items-center gap-3 w-full">
    <div className="relative w-10 h-10 md:w-11 md:h-11 shrink-0 rounded-sm overflow-hidden border border-white/10 group">
      <input 
        type="color" 
        value={value === 'transparent' ? '#000000' : value} 
        onChange={(e) => onChange(e.target.value)} 
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
      />
      <div 
        style={{ backgroundColor: value }} 
        className={`w-full h-full ${value === 'transparent' ? 'bg-[url(https://www.transparenttextures.com/patterns/checkerboard.png)] bg-gray-600' : ''}`}
      />
    </div>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 bg-white/[0.02] border border-white/5 rounded-sm px-3 py-2.5 md:px-4 md:py-3 text-[10px] md:text-[11px] font-mono text-white/80 focus:text-white focus:border-cyan-500/30 transition-all outline-none"
      placeholder="#HEX"
    />
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-1.5 md:space-y-4">
    <h3 className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-white/50 px-1">{title}</h3>
    <div className="space-y-2.5 md:space-y-4">{children}</div>
  </div>
);

type ActiveTab = 'content' | 'design' | 'colors' | 'brand';

const ControlsPanel: React.FC<any> = (props) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('content');
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) setIsDownloadOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionChange = (path: string, value: any) => {
    props.setOptions((prev: any) => {
      const newOptions = { ...prev };
      let current: any = newOptions;
      const keys = path.split('.');
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newOptions;
    });
    props.onDesignChange();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => handleOptionChange('image', ev.target?.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getPresetColor = (p: any) => {
    if (p.options.dotsOptions?.gradient) {
      return p.options.dotsOptions.gradient.colorStops[0].color;
    }
    return p.options.dotsOptions?.color || '#ffffff';
  };

  return (
    <div className="glass-card rounded-xl h-full flex flex-col shadow-2xl relative border-white/5">
      <div className="flex items-center justify-between px-5 py-3 md:px-8 md:py-4 border-b border-white/10 bg-white/[0.01] relative z-[250] rounded-t-xl">
        <div className="flex items-center gap-2 md:gap-3">
          <Settings2 size={14} className="text-cyan-400" />
          <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-white/90">Generator Studio</h2>
        </div>
        <Tooltip content="Reset All" position="top">
          <button onClick={props.onResetToDefault} className="p-1.5 md:p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-sm transition-all beam-btn">
            <RefreshCw size={14} />
          </button>
        </Tooltip>
      </div>

      <div className="flex border-b border-white/10 bg-black/20 z-[240] shrink-0">
        <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<Database size={16} />} label="Payload" />
        <TabButton active={activeTab === 'design'} onClick={() => setActiveTab('design')} icon={<Layout size={16} />} label="Patterns" />
        <TabButton active={activeTab === 'colors'} onClick={() => setActiveTab('colors')} icon={<Palette size={16} />} label="Colors" />
        <TabButton active={activeTab === 'brand'} onClick={() => setActiveTab('brand')} icon={<Fingerprint size={16} />} label="Signature" />
      </div>

      <div className="flex-grow overflow-y-auto scrollbar-hide flex flex-col shrink-0">
        <div className="p-4 md:p-8 pb-12 md:pb-20 min-h-[250px] md:min-h-[320px]">
          {activeTab === 'content' && (
            <div className="space-y-4 md:space-y-8 animate-tab-transition">
              <Section title="Input Data">
                <div className="relative group">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-sm opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                  <textarea
                    value={props.text}
                    onChange={(e) => props.setText(e.target.value)}
                    placeholder="Enter URL or secure payload..."
                    className="relative w-full h-14 md:h-18 bg-[#08080c] border border-white/10 rounded-sm p-3 md:p-4 text-sm md:text-[15px] font-medium text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/30 transition-all resize-none shadow-inner"
                  />
                </div>
              </Section>
              <Section title="Design Presets">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                  {props.presets.map((p: any) => {
                    const mainColor = getPresetColor(p);
                    const isActive = props.selectedPresetName === p.name;
                    return (
                      <button
                        key={p.name}
                        onClick={() => props.onPresetSelect(p)}
                        style={{ 
                          borderColor: isActive ? mainColor : 'rgba(255,255,255,0.05)',
                          color: isActive ? mainColor : 'rgba(255,255,255,0.7)',
                          boxShadow: isActive ? `0 0 15px ${mainColor}22` : 'none'
                        }}
                        className={`py-2.5 md:py-3.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-sm border transition-all active:scale-95 flex items-center justify-center gap-2 beam-btn ${
                          isActive 
                            ? 'bg-white/[0.05]' 
                            : 'bg-white/[0.03] hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: mainColor }}
                        />
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-4 md:space-y-8 animate-tab-transition">
              <Section title="Geometric Architecture">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <label className="text-[8px] md:text-[9px] font-black text-white/70 uppercase tracking-[0.2em]">Dot Pattern</label>
                    <CustomSelect 
                      options={['square', 'dots', 'rounded', 'classy', 'extra-rounded'].map(v => ({ value: v, label: v }))} 
                      value={props.options.dotsOptions.type} 
                      onChange={v => handleOptionChange('dotsOptions.type', v)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] md:text-[9px] font-black text-white/70 uppercase tracking-[0.2em]">Corner Style</label>
                    <CustomSelect 
                      options={['square', 'dot', 'extra-rounded'].map(v => ({ value: v, label: v }))} 
                      value={props.options.cornersSquareOptions.type} 
                      onChange={v => handleOptionChange('cornersSquareOptions.type', v)} 
                    />
                  </div>
                </div>
              </Section>
              <Section title="Correction Density">
                <div className="bg-white/[0.01] border border-white/5 p-3 md:p-5 rounded-sm space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">
                    <span className="text-white/70">Error Resistance</span>
                    <span className="text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">{props.options.qrOptions?.errorCorrectionLevel || 'H'} Level</span>
                  </div>
                  <div className="flex gap-2">
                    {['L', 'M', 'Q', 'H'].map(lvl => (
                      <button 
                        key={lvl}
                        onClick={() => handleOptionChange('qrOptions.errorCorrectionLevel', lvl)}
                        className={`flex-1 py-2.5 md:py-3 text-[10px] md:text-[11px] font-black border rounded-sm transition-all beam-btn ${
                          (props.options.qrOptions?.errorCorrectionLevel || 'H') === lvl
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                            : 'bg-white/5 border-white/5 text-white/50 hover:text-white/80'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-4 md:space-y-8 animate-tab-transition">
              <Section title="Foreground Elements">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex gap-2 p-1 bg-black/40 rounded-sm border border-white/5">
                    <button 
                      onClick={() => handleOptionChange('dotsOptions.gradient', undefined)}
                      className={`flex-1 py-2 md:py-2.5 text-[9px] font-black uppercase tracking-widest transition-all beam-btn ${!props.options.dotsOptions.gradient ? 'bg-white/10 text-white' : 'text-white/60'}`}
                    >
                      Solid
                    </button>
                    <button 
                      onClick={() => handleOptionChange('dotsOptions.gradient', { type: 'linear', rotation: 0, colorStops: [{ offset: 0, color: '#A855F7' }, { offset: 1, color: '#06B6D4' }] })}
                      className={`flex-1 py-2 md:py-2.5 text-[9px] font-black uppercase tracking-widest transition-all beam-btn ${props.options.dotsOptions.gradient ? 'bg-white/10 text-white' : 'text-white/60'}`}
                    >
                      Gradient
                    </button>
                  </div>
                  {!props.options.dotsOptions.gradient ? (
                    <ColorInput value={props.options.dotsOptions.color || '#ffffff'} onChange={c => handleOptionChange('dotsOptions.color', c)} />
                  ) : (
                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                      <ColorInput value={props.options.dotsOptions.gradient.colorStops[0].color} onChange={c => {
                        const stops = [...props.options.dotsOptions.gradient.colorStops]; stops[0].color = c;
                        handleOptionChange('dotsOptions.gradient.colorStops', stops);
                      }} />
                      <ColorInput value={props.options.dotsOptions.gradient.colorStops[1].color} onChange={c => {
                        const stops = [...props.options.dotsOptions.gradient.colorStops]; stops[1].color = c;
                        handleOptionChange('dotsOptions.gradient.colorStops', stops);
                      }} />
                    </div>
                  )}
                </div>
              </Section>
              <Section title="Background Canvas">
                <div className="bg-white/[0.01] border border-white/5 p-4 md:p-6 rounded-sm">
                  <ColorInput value={props.options.backgroundOptions.color || 'transparent'} onChange={c => handleOptionChange('backgroundOptions.color', c)} />
                  <p className="text-[8px] md:text-[9px] font-bold text-white/50 mt-3 md:mt-4 uppercase tracking-[0.4em] text-center">Transparent recommended for layering</p>
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="space-y-4 md:space-y-8 animate-tab-transition">
              <Section title="Asset Management">
                <div className="grid grid-cols-[1fr,auto] gap-3 md:gap-4">
                  <label className="flex flex-col items-center justify-center gap-3 md:gap-4 h-24 md:h-32 border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] rounded-sm cursor-pointer transition-all group overflow-hidden relative beam-btn">
                    {props.options.image ? (
                      <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <img 
                          src={props.options.image} 
                          alt="Asset" 
                          className="max-w-full max-h-full object-contain transition-transform group-hover:scale-110"
                          style={{ opacity: props.options.imageOptions?.opacity ?? 1 }}
                        />
                      </div>
                    ) : (
                      <>
                        <ImageIcon size={20} className="text-cyan-500/40 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Upload Identity Asset</span>
                      </>
                    )}
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {props.options.image && (
                    <button onClick={() => handleOptionChange('image', '')} className="w-24 md:w-32 h-24 md:h-32 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-sm flex flex-col items-center justify-center gap-2 md:gap-3 text-red-500/20 hover:text-red-500 transition-all beam-btn">
                      <Trash2 size={20} />
                      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter">Purge Asset</span>
                    </button>
                  )}
                </div>

                {props.options.image && (
                  <div className="bg-white/[0.01] border border-white/5 p-4 md:p-6 rounded-sm space-y-6 md:space-y-8 animate-slide-in-up-fade">
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between items-center text-[8px] md:text-[9px] font-black text-white/70 uppercase tracking-[0.3em]">
                        <div className="flex items-center gap-2"><Maximize size={10} className="text-cyan-400" /><span>Logo Scale</span></div>
                        <span className="text-cyan-400 font-mono">{Math.round(props.options.imageOptions.imageSize * 100)}%</span>
                      </div>
                      <input type="range" min="0.1" max="1" step="0.05" value={props.options.imageOptions.imageSize} onChange={e => handleOptionChange('imageOptions.imageSize', parseFloat(e.target.value))} className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-400 cursor-pointer" />
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between items-center text-[8px] md:text-[9px] font-black text-white/70 uppercase tracking-[0.3em]">
                        <div className="flex items-center gap-2"><SlidersHorizontal size={10} className="text-purple-400" /><span>Alpha Blending</span></div>
                        <span className="text-purple-400 font-mono">{Math.round((props.options.imageOptions?.opacity ?? 1) * 100)}%</span>
                      </div>
                      <input type="range" min="0" max="1" step="0.05" value={props.options.imageOptions?.opacity ?? 1} onChange={e => handleOptionChange('imageOptions.opacity', parseFloat(e.target.value))} className="w-full h-1 bg-white/10 rounded-full appearance-none accent-purple-400 cursor-pointer" />
                    </div>
                  </div>
                )}
              </Section>

              <Section title="Typography Overlays">
                <div className="space-y-3 md:space-y-4">
                  <div className="relative">
                    <PenTool size={14} className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-white/50" />
                    <input 
                      type="text" placeholder="Add label text..." 
                      value={props.labelOptions.text} 
                      onChange={e => props.setLabelOptions({...props.labelOptions, text: e.target.value})}
                      className="w-full pl-10 md:pl-12 pr-4 md:pr-5 py-3 md:py-4 bg-white/[0.02] border border-white/5 rounded-sm text-[11px] md:text-[12px] text-white font-bold tracking-[0.15em] placeholder:text-white/30 outline-none focus:border-cyan-500/20 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <CustomSelect options={FONT_PRESETS.map(f => ({ value: f, label: f }))} value={props.labelOptions.font} onChange={v => props.setLabelOptions({...props.labelOptions, font: v})} />
                    <CustomSelect options={[{value: 'bottom', label: 'Position: Bottom'}, {value: 'top', label: 'Position: Top'}, {value: 'none', label: 'Hidden'}]} value={props.labelOptions.position} onChange={v => props.setLabelOptions({...props.labelOptions, position: v})} />
                  </div>
                </div>
              </Section>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 md:p-6 bg-[#040406] border-t border-white/10 flex gap-2 md:gap-4 relative z-[400] shrink-0 rounded-b-xl">
        <div className="flex-1 relative" ref={downloadRef}>
          <button 
            onClick={() => setIsDownloadOpen(!isDownloadOpen)}
            className="w-full h-10 md:h-14 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-sm font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px] flex items-center justify-center gap-2 md:gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-xl group border border-white/10 beam-btn"
          >
            <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> 
            Export Suite
            <ChevronDown size={12} className={`transition-transform duration-300 ${isDownloadOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDownloadOpen && (
            <div className="absolute bottom-full mb-4 w-full bg-[#0a0a0f] p-1.5 rounded-sm shadow-[0_30px_60px_rgba(0,0,0,1)] border border-white/10 z-[700] animate-slide-in-up-fade">
              <div className="flex flex-col gap-1">
                {[
                  { id: 'png', label: 'PNG Image', meta: 'Universal Raster', icon: <ImageIcon size={14}/>, action: () => props.onDownload('png') },
                  { id: 'svg', label: 'SVG Vector', meta: 'Scalable Assets', icon: <Box size={14}/>, action: () => props.onDownload('svg') },
                  { id: 'pdf', label: 'PDF Suite', meta: 'Standard Document', icon: <FileText size={14}/>, action: props.onDownloadPdf },
                ].map((item) => (
                  <button key={item.id} onClick={() => { item.action(); setIsDownloadOpen(false); }} className="w-full p-4 text-left hover:bg-white/[0.05] transition-all flex items-center gap-5 group rounded-sm beam-btn">
                    <div className="text-white/60 group-hover:text-cyan-400 transition-colors">{item.icon}</div>
                    <div className="flex-1">
                      <div className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white/90">{item.label}</div>
                      <div className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white/70">{item.meta}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Tooltip content="Copy Asset" position="top">
            <button onClick={props.onCopyImage} className="w-10 h-10 md:w-14 md:h-14 bg-white/[0.02] hover:bg-white/10 text-white/60 hover:text-white rounded-sm border border-white/5 transition-all flex items-center justify-center active:scale-90 beam-btn"><Copy size={16} /></button>
          </Tooltip>
          <Tooltip content="Share Global" position="top">
            <button onClick={props.onShare} className="w-10 h-10 md:w-14 md:h-14 bg-white/[0.02] hover:bg-white/10 text-white/60 hover:text-white rounded-sm border border-white/5 transition-all flex items-center justify-center active:scale-90 beam-btn"><Share2 size={16} /></button>
          </Tooltip>
        </div>
      </div>

      <style>{`
        @keyframes tab-transition {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-tab-transition { animation: tab-transition 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </div>
  );
};

export default ControlsPanel;
