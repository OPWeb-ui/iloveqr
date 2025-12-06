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

  // QR Code Styling setup
  useEffect(() => {
    if (typeof window !== 'undefined' && !qrCodeRef.current && window.QRCodeStyling) {
      qrCodeRef.current = new window.QRCodeStyling({
        ...options,
        data: text,
      });
      if (previewRef.current) {
        qrCodeRef.current.append(previewRef.current);
      }
    }
  }, []);

  // QR Code update with transition
  useEffect(() => {
    if (qrCodeRef.current) {
      const currentOptionsString = JSON.stringify(options);

      // If only text has changed, update immediately without a visual transition.
      if (prevOptionsRef.current === currentOptionsString) {
        qrCodeRef.current.update({ data: text });
        return;
      }
      
      // If style options have changed (e.g., from a preset), fade it in.
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        qrCodeRef.current?.update({
          ...options,
          data: text,
        });
        setIsTransitioning(false);
      }, 150); // Duration should match the fade-out

      prevOptionsRef.current = currentOptionsString;
      
      return () => clearTimeout(timer);
    }
  }, [text, options]);
  
  const LabelComponent = () => (
    <div 
      className="w-full text-center text-lg" 
      style={{ 
        fontFamily: labelOptions.font, 
        color: labelOptions.color, 
        textShadow: '0px 1px 3px rgba(0, 0, 0, 0.5)' 
      }}
      data-label="true"
    >
      {labelOptions.text}
    </div>
  );
  
  // Static styles and classes
  const containerClasses = 'flex flex-col items-center justify-center p-6 sticky top-8 animate-[levitate_6s_ease-in-out_infinite] gap-4 w-full max-w-md mx-auto animate-slide-in-up-fade';
  const containerStyles: React.CSSProperties = { animationDelay: '400ms' };
  const innerDivClasses = `w-full [&>canvas]:w-full [&>canvas]:h-auto [&>canvas]:rounded-2xl [&>img]:rounded-2xl transition-opacity duration-150 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`;

  return (
    <div
      ref={previewContainerRef}
      className={containerClasses}
      style={containerStyles}
    >
      {labelOptions.text && labelOptions.position === 'top' && <LabelComponent />}
      <div ref={previewRef} className={innerDivClasses} />
      {labelOptions.text && labelOptions.position === 'bottom' && <LabelComponent />}
    </div>
  );
};

export default QRCodePreview;