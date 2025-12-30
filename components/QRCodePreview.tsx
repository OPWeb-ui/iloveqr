
import React, { useEffect, useRef, useState } from 'react';
import type { QROptions, LabelOptions } from '../types';

declare global {
  interface Window {
    QRCodeStyling: any;
  }
}

interface QRCodePreviewProps {
  text: string;
  options: QROptions;
  labelOptions: LabelOptions;
  qrCodeRef: React.MutableRefObject<any | null>;
  previewContainerRef: React.RefObject<HTMLDivElement>;
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({ text, options, labelOptions, qrCodeRef, previewContainerRef }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevOptionsRef = useRef<string>(JSON.stringify(options));

  useEffect(() => {
    if (typeof window !== 'undefined' && !qrCodeRef.current && window.QRCodeStyling) {
      qrCodeRef.current = new window.QRCodeStyling({ ...options, data: text });
      if (previewRef.current) qrCodeRef.current.append(previewRef.current);
    }
  }, []);

  useEffect(() => {
    if (qrCodeRef.current) {
      const currentOptionsString = JSON.stringify(options);
      if (prevOptionsRef.current === currentOptionsString) {
        qrCodeRef.current.update({ data: text });
        return;
      }
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        qrCodeRef.current?.update({ ...options, data: text });
        setIsTransitioning(false);
      }, 80);
      prevOptionsRef.current = currentOptionsString;
      return () => clearTimeout(timer);
    }
  }, [text, options]);
  
  const LabelComponent = () => (
    <div 
      className="w-full text-center text-sm sm:text-base font-black uppercase tracking-tighter" 
      style={{ 
        fontFamily: labelOptions.font, 
        color: labelOptions.color,
        textShadow: `0 0 10px ${labelOptions.color}44`
      }}
      data-label="true"
    >
      {labelOptions.text}
    </div>
  );
  
  return (
    <div
      ref={previewContainerRef}
      className="flex flex-col items-center justify-start pt-0 pb-2 px-2 md:py-8 md:px-0 gap-3 md:gap-4 w-full mx-auto md:sticky md:top-40 transition-all duration-300"
    >
      <div className="relative group w-full max-w-[180px] md:max-w-[230px] transition-all duration-300">
        <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-[60px] group-hover:opacity-100 opacity-30 transition-all duration-700"></div>
        <div className="relative glass-card p-4 sm:p-5 rounded-none border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-black/60 backdrop-blur-3xl">
          {labelOptions.text && labelOptions.position === 'top' && <div className="mb-4"><LabelComponent /></div>}
          <div ref={previewRef} className={`w-full relative [&>canvas]:w-full [&>canvas]:h-auto [&>canvas]:rounded-none transition-all duration-200 ${isTransitioning ? 'opacity-0 scale-[0.98] blur-[2px]' : 'opacity-100 scale-100 blur-0'}`} />
          {labelOptions.text && labelOptions.position === 'bottom' && <div className="mt-4"><LabelComponent /></div>}
          
          {/* Subtle Corner Accents */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/20"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/20"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/20"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/20"></div>
        </div>
      </div>
      
      <div className="glass px-3 py-1 sm:px-5 sm:py-2 rounded-none text-[6px] sm:text-[8px] font-black uppercase tracking-[0.4em] text-white/20 border-white/5 shadow-xl bg-black/30">
        Active Matrix
      </div>
    </div>
  );
};

export default QRCodePreview;
