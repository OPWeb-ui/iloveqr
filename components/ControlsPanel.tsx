import React, { useState, useCallback, ChangeEvent, useRef, useEffect } from 'react';
import type { QROptions, Preset, LabelOptions } from '../types';
import { FONT_PRESETS, COLOR_PALETTE } from '../constants';
import { Download, Copy, Share2, Image as ImageIcon, ChevronDown, Palette, Shapes, CornerUpRight, Droplet, Type, RefreshCw, Grid, Trash2, ShieldCheck, ExternalLink } from 'lucide-react';

// A simple accordion component for UI organization
const Accordion: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode, defaultOpen?: boolean, zIndex?: number }> = ({ title, icon, children, defaultOpen = false, zIndex }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isOverflowVisible, setIsOverflowVisible] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  const contentHeight = contentRef.current?.scrollHeight ?? 0;

  const handleToggle = () => {
    if (isOpen) {
      setIsOverflowVisible(false);
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleTransitionEnd = () => {
    if (isOpen) {
      setIsOverflowVisible(true);
    }
  };
  
  return (
    <div className="relative border border-gray-200 dark:border-white/10 rounded-2xl mb-4" style={{ zIndex }}>
      <button
        className={`w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-[#1e1e1e] hover:bg-gray-100 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200 transition-colors ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold">{title}</span>
        </div>
        <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`bg-white dark:bg-[#1a1a1a] rounded-b-2xl transition-all duration-300 ease-in-out ${!isOverflowVisible ? 'overflow-hidden' : ''}`}
        style={{ maxHeight: isOpen ? `${contentHeight}px` : '0px' }}
      >
        <div ref={contentRef} className="p-4 border-t border-gray-100 dark:border-white/5">
          {children}
        </div>
      </div>
    </div>
  );
};

// Custom animated selector
interface CustomSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  renderOption?: (option: { value: string; label: string }) => React.ReactNode;
}
const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, renderOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  const handleToggle = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200);
    } else {
      setIsOpen(true);
    }
  };

  const handleSelect = (newValue: string) => {
    onChange(newValue);
    handleToggle();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        if (isOpen) {
           handleToggle();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={selectRef}>
      <button
        onClick={handleToggle}
        className="w-full flex justify-between items-center p-2 bg-white dark:bg-[#121212] border border-gray-300 dark:border-white/10 rounded-md text-gray-800 dark:text-gray-200 hover:border-violet-400 transition-colors"
      >
        {renderOption ? renderOption(selectedOption) : <span>{selectedOption.label}</span>}
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className={`absolute top-full mt-2 w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-white/10 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto ${isClosing ? 'animate-select-slide-up' : 'animate-select-slide-down'}`}>
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${value === option.value ? 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' : ''}`}
            >
              {renderOption ? renderOption(option) : option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CustomColorPicker: React.FC<{ value: string; onChange: (color: string) => void; direction?: 'up' | 'down' }> = ({ value, onChange, direction = 'down' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    const handleToggle = useCallback(() => {
        if (isOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsClosing(false);
            }, 200);
        } else {
            setIsOpen(true);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                if (isOpen) handleToggle();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, handleToggle]);
    
    const animationClass = isClosing
      ? (direction === 'up' ? 'animate-slide-down-fade-out' : 'animate-select-slide-up')
      : (direction === 'up' ? 'animate-slide-up-fade-in' : 'animate-select-slide-down');

    const positionClass = direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2';

    return (
        <div className="relative" ref={pickerRef}>
            <button onClick={handleToggle} className="w-full h-10 p-1 bg-white dark:bg-[#121212] border border-gray-300 dark:border-white/10 rounded-md flex items-center justify-between px-2 hover:border-violet-400 transition-colors">
                <span className="text-sm font-mono text-gray-800 dark:text-gray-200">{value}</span>
                <div style={{ backgroundColor: value }} className={`w-6 h-6 rounded ${value === 'transparent' ? 'bg-transparent border-dashed border border-black/20 dark:border-white/20' : ''}`}></div>
            </button>
            {isOpen && (
                <div className={`absolute p-3 w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-white/10 rounded-lg shadow-lg z-20 ${positionClass} ${animationClass}`}>
                    <div className="grid grid-cols-8 gap-1.5 mb-2">
                        {COLOR_PALETTE.map(color => (
                            <button 
                              key={color} 
                              onClick={() => { onChange(color); handleToggle(); }}
                              className="w-full aspect-square rounded transition-transform hover:scale-110 ring-1 ring-black/5 dark:ring-white/10" 
                              style={{ backgroundColor: color, border: color === 'transparent' ? '1px dashed rgba(150,150,150,0.5)' : ''}}
                              aria-label={`Select color ${color}`}
                            ></button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-white/10">
                        <div className="relative flex-grow">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-mono">#</span>
                            <input 
                                type="text" 
                                value={value.startsWith('#') ? value.substring(1).toUpperCase() : value.toUpperCase()}
                                onChange={e => {
                                    const sanitized = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                                    onChange(`#${sanitized}`);
                                }}
                                className="w-full p-2 pl-6 bg-gray-50 dark:bg-[#121212] border border-gray-300 dark:border-white/10 rounded-md text-sm font-mono text-gray-800 dark:text-gray-200 focus:outline-none focus:border-violet-500"
                                maxLength={6}
                            />
                        </div>
                        <div className="relative w-9 h-9 flex-shrink-0">
                            <input 
                                type="color" 
                                value={value === 'transparent' ? '#000000' : value} 
                                onChange={e => onChange(e.target.value)} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div 
                                style={{ backgroundColor: value }} 
                                className={`w-full h-full rounded-md border border-gray-300 dark:border-white/10 ${value === 'transparent' ? 'bg-transparent border-dashed' : ''}`}
                            ></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdvancedColorControl: React.FC<{
    label: string;
    options: { color?: string; gradient?: { type?: 'linear' | 'radial'; rotation?: number; colorStops: { offset: number; color: string }[] } };
    onOptionChange: (newOptions: any) => void;
    allowTransparent?: boolean;
}> = ({ label, options, onOptionChange, allowTransparent = false }) => {
    const isGradient = !!options.gradient;

    const handleTabChange = (useGradient: boolean) => {
        if (useGradient && !options.gradient) {
            onOptionChange({
                color: '#000000',
                gradient: {
                    type: 'linear',
                    rotation: Math.PI / 4,
                    colorStops: [{ offset: 0, color: '#8A2EFF' }, { offset: 1, color: '#46C6FF' }],
                }
            });
        } else if (!useGradient) {
            onOptionChange({ color: options.gradient?.colorStops[0].color || '#A76BFF', gradient: undefined });
        }
    };
    
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            <div className="flex items-center bg-gray-200/50 dark:bg-[#121212] dark:border dark:border-white/10 rounded-lg p-1 mb-3">
                <button onClick={() => handleTabChange(false)} className={`flex-1 text-sm py-1.5 rounded-md transition-all ${!isGradient ? 'bg-white shadow-sm font-medium text-gray-900 dark:bg-[#3a3a3a] dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/5'}`}>Solid</button>
                <button onClick={() => handleTabChange(true)} className={`flex-1 text-sm py-1.5 rounded-md transition-all ${isGradient ? 'bg-white shadow-sm font-medium text-gray-900 dark:bg-[#3a3a3a] dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/5'}`}>Gradient</button>
            </div>
            
            {!isGradient && (
                <div className="flex items-center gap-2">
                    <div className="flex-grow">
                        <CustomColorPicker value={options.color || '#000000'} onChange={(color) => onOptionChange({ ...options, color, gradient: undefined })} />
                    </div>
                    {allowTransparent && <button onClick={() => onOptionChange({ ...options, color: 'transparent', gradient: undefined })} className="p-2.5 bg-white dark:bg-[#2a2a2a] rounded-md border border-gray-300 dark:border-white/10 hover:border-violet-400 text-gray-600 dark:text-gray-300 transition-colors" title="Set transparent background"><Droplet size={16} /></button>}
                </div>
            )}

            {isGradient && options.gradient && (
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Start Color</label>
                        <CustomColorPicker 
                            value={options.gradient.colorStops[0].color} 
                            onChange={(color) => {
                                const newStops = [...options.gradient.colorStops];
                                newStops[0] = { ...newStops[0], color };
                                onOptionChange({ ...options, gradient: { ...options.gradient, colorStops: newStops } });
                            }} 
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">End Color</label>
                        <CustomColorPicker 
                            value={options.gradient.colorStops[1].color} 
                            onChange={(color) => {
                                const newStops = [...options.gradient.colorStops];
                                newStops[1] = { ...newStops[1], color };
                                onOptionChange({ ...options, gradient: { ...options.gradient, colorStops: newStops } });
                            }} 
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 flex justify-between mb-1">
                            <span>Rotation</span>
                            <span>{Math.round((options.gradient.rotation || 0) * 180 / Math.PI)}°</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="6.28"
                            step="0.01"
                            value={options.gradient.rotation}
                            onChange={(e) => onOptionChange({ ...options, gradient: { ...options.gradient, rotation: parseFloat(e.target.value) } })}
                            className="w-full h-2 bg-gray-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-violet-600"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};


interface ControlsPanelProps {
  text: string;
  setText: (text: string) => void;
  options: QROptions;
  setOptions: React.Dispatch<React.SetStateAction<QROptions>>;
  labelOptions: LabelOptions;
  setLabelOptions: React.Dispatch<React.SetStateAction<LabelOptions>>;
  presets: Preset[];
  onPresetSelect: (preset: Preset) => void;
  onDownload: (extension: 'png' | 'svg') => void;
  onDownloadPdf: () => void;
  onCopyImage: () => void;
  onShare: () => void;
  onResetToDefault: () => void;
  estimatedSize: string;
  selectedPresetName: string | null;
  onDesignChange: () => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  text,
  setText,
  options,
  setOptions,
  labelOptions,
  setLabelOptions,
  presets,
  onPresetSelect,
  onDownload,
  onDownloadPdf,
  onCopyImage,
  onShare,
  onResetToDefault,
  estimatedSize,
  selectedPresetName,
  onDesignChange,
}) => {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isDownloadClosing, setIsDownloadClosing] = useState(false);
  const downloadContainerRef = useRef<HTMLDivElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const isLabelActive = !!labelOptions.text && labelOptions.position !== 'none';

  const handleDownloadClose = useCallback(() => {
    if (isDownloadOpen && !isDownloadClosing) {
      setIsDownloadClosing(true);
      setTimeout(() => {
        setIsDownloadOpen(false);
        setIsDownloadClosing(false);
      }, 200); // Animation duration
    }
  }, [isDownloadOpen, isDownloadClosing]);

  const handleDownloadToggle = () => {
    if (isDownloadOpen) {
      handleDownloadClose();
    } else {
      setIsDownloadOpen(true);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadContainerRef.current && !downloadContainerRef.current.contains(event.target as Node)) {
        handleDownloadClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleDownloadClose]);


  const handleOptionChange = useCallback((path: string, value: any) => {
    setOptions(prev => {
      // Create a shallow copy of the previous state
      const newOptions = { ...prev };
      let currentLevel: any = newOptions;
      
      const keys = path.split('.');
      // Traverse the path, creating copies of nested objects
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // Ensure we're creating a new object at each level
        currentLevel[key] = { ...currentLevel[key] };
        currentLevel = currentLevel[key];
      }
      
      // Set the new value at the final key in the path
      currentLevel[keys[keys.length - 1]] = value;
      
      return newOptions;
    });
    onDesignChange();
  }, [setOptions, onDesignChange]);
  
  const handleLabelChange = useCallback((key: keyof LabelOptions, value: string) => {
    setLabelOptions(prev => ({ ...prev, [key]: value }));
    onDesignChange();
  }, [setLabelOptions, onDesignChange]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleOptionChange('image', event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const dotTypes = ['dots', 'rounded', 'classy', 'classy-rounded', 'square', 'extra-rounded'].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }));
  const cornerSquareTypes = ['dot', 'square', 'extra-rounded'].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }));
  const labelPositions = [{value: 'bottom', label: 'Bottom'}, {value: 'top', label: 'Top'}, {value: 'none', label: 'None'}];
  const fontOptions = FONT_PRESETS.map(f => ({ value: f, label: f }));

  return (
    <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-xl dark:shadow-none h-full flex flex-col transition-colors">
      <div className="flex-grow overflow-y-auto">
        {/* Input Section */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <label htmlFor="qr-text" className="block font-semibold text-lg text-gray-900 dark:text-white">Your Data</label>
            {(() => {
                try {
                    new URL(text);
                    return (
                        <a 
                            href={text} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline bg-violet-50 dark:bg-violet-900/20 px-2 py-1 rounded-full transition-colors"
                        >
                            Visit Site <ExternalLink size={12} />
                        </a>
                    )
                } catch (e) { return null }
            })()}
          </div>
          <div className="relative w-full">
              <textarea
                id="qr-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Insert Link / URL"
                className="w-full h-24 p-4 bg-gray-50 dark:bg-[#121212] border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all resize-none placeholder-gray-400 dark:placeholder-gray-600"
              />
          </div>
        </div>
        
        {/* Customization Accordions */}
        <Accordion title="Presets" icon={<Grid size={18} className="text-violet-600 dark:text-violet-400" />} defaultOpen zIndex={20}>
          <div className="flex flex-wrap gap-2">
            {presets.map(preset => (
              <button
                key={preset.name}
                onClick={() => onPresetSelect(preset)}
                className={`px-4 py-2 text-sm rounded-full transition-colors border ${
                  selectedPresetName === preset.name
                    ? 'bg-violet-600 text-white border-transparent hover:bg-violet-700'
                    : 'bg-white dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-[#3a3a3a]'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </Accordion>

        <Accordion title="Colors & Styles" icon={<Palette size={18} className="text-pink-500" />} zIndex={30}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dot Style</label>
              <CustomSelect options={dotTypes} value={options.dotsOptions.type || 'dots'} onChange={v => handleOptionChange('dotsOptions.type', v)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Corner Style</label>
              <CustomSelect options={cornerSquareTypes} value={options.cornersSquareOptions?.type || 'square'} onChange={v => handleOptionChange('cornersSquareOptions.type', v)} />
            </div>
          </div>
          <div className="mt-4 border-t border-gray-100 dark:border-white/5 pt-4">
            <AdvancedColorControl label="Dots Color" options={options.dotsOptions} onOptionChange={opts => handleOptionChange('dotsOptions', { ...options.dotsOptions, ...opts })} />
            <AdvancedColorControl label="Corner Square Color" options={options.cornersSquareOptions || {}} onOptionChange={opts => handleOptionChange('cornersSquareOptions', { ...options.cornersSquareOptions, ...opts })} />
            <AdvancedColorControl label="Background Color" options={options.backgroundOptions} onOptionChange={opts => handleOptionChange('backgroundOptions', opts)} allowTransparent />
          </div>
        </Accordion>

        <Accordion title="Logo / Image" icon={<ImageIcon size={18} className="text-blue-500" />} zIndex={40}>
          <div className="flex items-center gap-4">
            <label htmlFor="image-upload" className="flex-1 cursor-pointer text-center py-2.5 px-4 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors text-sm font-medium flex items-center justify-center gap-2">
               <ImageIcon size={16} /> Upload Image
            </label>
            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {options.image && <button onClick={() => handleOptionChange('image', '')} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20"><Trash2 size={18} /></button>}
          </div>

          {options.image && (
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
              <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 flex justify-between mb-2">Image Size <span>{options.imageOptions.imageSize}</span></label>
                  <input type="range" min="0.1" max="1" step="0.05" value={options.imageOptions.imageSize} onChange={e => handleOptionChange('imageOptions.imageSize', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>
               <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 flex justify-between mb-2">Image Margin <span>{options.imageOptions.margin}</span></label>
                  <input type="range" min="0" max="20" step="1" value={options.imageOptions.margin} onChange={e => handleOptionChange('imageOptions.margin', parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="hide-dots" checked={options.imageOptions.hideBackgroundDots} onChange={e => handleOptionChange('imageOptions.hideBackgrounddots', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                <label htmlFor="hide-dots" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Hide background dots</label>
              </div>
            </div>
          )}
        </Accordion>
        
        <Accordion title="Label / Text" icon={<Type size={18} className="text-green-500" />} zIndex={50}>
          <div className="space-y-4">
              <input type="text" placeholder="Your Label Text" value={labelOptions.text} onChange={e => handleLabelChange('text', e.target.value)} className="w-full p-2.5 bg-white dark:bg-[#121212] border border-gray-300 dark:border-white/10 rounded-md text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
              <div className="grid grid-cols-2 gap-4">
                  <CustomSelect options={fontOptions} value={labelOptions.font} onChange={v => handleLabelChange('font', v)} renderOption={(opt) => <span style={{ fontFamily: opt.value }}>{opt.label}</span>} />
                  <CustomSelect options={labelPositions} value={labelOptions.position} onChange={v => handleLabelChange('position', v)} />
              </div>
              <CustomColorPicker value={labelOptions.color} onChange={v => handleLabelChange('color', v)} direction="up" />
          </div>
        </Accordion>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative flex-grow" ref={downloadContainerRef}>
            <button
              onClick={handleDownloadToggle}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold bg-violet-600 text-white rounded-xl hover:bg-violet-700 active:bg-violet-800 transition-colors focus:z-10 shadow-lg shadow-violet-500/20"
            >
              <Download size={18} />
              <span>Download</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isDownloadOpen && !isDownloadClosing ? 'rotate-180' : ''}`} />
            </button>
            {isDownloadOpen && (
              <div
                ref={downloadMenuRef}
                className={`absolute bottom-full mb-2 w-full origin-bottom z-50 ${isDownloadClosing ? 'animate-slide-down-fade-out' : 'animate-slide-up-fade-in'}`}
              >
                <div className="rounded-xl bg-white dark:bg-[#2a2a2a] shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-2 border border-gray-100 dark:border-white/5">
                  <button onClick={() => { onDownload('png'); handleDownloadClose(); }} className="w-full text-left p-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 flex justify-between items-center group">
                      <span className="font-medium">PNG</span> 
                      <span className="text-xs text-gray-400 bg-gray-50 dark:bg-black/20 px-1.5 py-0.5 rounded">{estimatedSize}</span>
                  </button>
                  <button onClick={() => { onDownload('svg'); handleDownloadClose(); }} className={`w-full text-left p-2.5 rounded-lg text-sm flex justify-between items-center ${isLabelActive ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'}`} disabled={isLabelActive} title={isLabelActive ? 'SVG not supported with label' : ''}>
                      <span className="font-medium">SVG</span>
                      <span className="text-xs text-gray-400">Vector</span>
                  </button>
                  <button onClick={() => { onDownloadPdf(); handleDownloadClose(); }} className="w-full text-left p-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 flex justify-between items-center">
                      <span className="font-medium">PDF</span>
                      <span className="text-xs text-gray-400">Print</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <button onClick={onCopyImage} title="Copy Image" className="p-3.5 text-sm font-semibold bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3a3a3a] rounded-xl transition-colors border border-gray-200 dark:border-white/5"><Copy size={20} /></button>
          <button onClick={onShare} title="Share" className="p-3.5 text-sm font-semibold bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3a3a3a] rounded-xl transition-colors border border-gray-200 dark:border-white/5"><Share2 size={20} /></button>
          <button onClick={onResetToDefault} title="Reset Styles" className="p-3.5 text-sm font-semibold bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3a3a3a] rounded-xl transition-colors border border-gray-200 dark:border-white/5"><RefreshCw size={20} /></button>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;