import React, { useState, useEffect, useRef } from 'react';
import ControlsPanel from './ControlsPanel';
import QRCodePreview from './QRCodePreview';
import { DEFAULT_OPTIONS, PRESETS, DEFAULT_LABEL_OPTIONS } from '../constants';
import type { QROptions, Preset, LabelOptions } from '../types';

interface QRCodeGeneratorProps {
  initialText?: string;
}

declare global {
  interface Window {
    jspdf: any;
    QRCodeStyling: any;
  }
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ initialText }) => {
  const [text, setText] = useState(initialText || 'https://multiwebapps.pages.dev/');
  const [options, setOptions] = useState<QROptions>(DEFAULT_OPTIONS);
  const [labelOptions, setLabelOptions] = useState<LabelOptions>(DEFAULT_LABEL_OPTIONS);
  const [estimatedSize, setEstimatedSize] = useState('');
  const [selectedPresetName, setSelectedPresetName] = useState<string | null>(null);

  // Use any for the library type to avoid import issues
  const qrCodeRef = useRef<any | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialText) {
      setText(initialText);
    }
  }, [initialText]);

  const formatBytes = (bytes: number, decimals = 1): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  useEffect(() => {
    const calculateEstimate = () => {
        const level = options.qrOptions?.errorCorrectionLevel || 'M';
        const correctionFactor: Record<string, number> = { L: 0.05, M: 0.055, Q: 0.06, H: 0.065 };
        
        let bytes = ((options.width || 0) * (options.height || 0)) * (correctionFactor[level] || 0.05);

        if (options.image) {
            bytes += 20 * 1024; // Add a rough 20KB estimate for an embedded logo
        }
        
        setEstimatedSize(formatBytes(bytes));
    };
    
    calculateEstimate();
  }, [options.width, options.height, options.qrOptions?.errorCorrectionLevel, options.image]);
  
  const handlePreset = (preset: Preset) => {
    setOptions(prev => ({
      ...prev,
      ...preset.options
    }));
    setSelectedPresetName(preset.name);
  };

  const handleResetToDefault = () => {
    setOptions(DEFAULT_OPTIONS);
    setLabelOptions(DEFAULT_LABEL_OPTIONS);
    setSelectedPresetName(null);
  };
  
  const handleDesignChange = () => {
    setSelectedPresetName(null);
  }

  const getCombinedImageBlob = async (): Promise<Blob | null> => {
    const isLabelActive = labelOptions.text && labelOptions.position !== 'none';
    if (!isLabelActive) {
      const rawData = await qrCodeRef.current?.getRawData('png');
      return rawData ?? null;
    }

    const qrCanvas = previewContainerRef.current?.querySelector('canvas');
    const labelElement = previewContainerRef.current?.querySelector('[data-label="true"]');

    if (!qrCanvas || !labelElement) {
       const rawData = await qrCodeRef.current?.getRawData('png'); // Fallback
       return rawData ?? null;
    }

    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d');
    if (!ctx) return null;

    const computedStyle = window.getComputedStyle(labelElement);
    const font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
    const text = labelOptions.text;
    
    ctx.font = font;
    const textMetrics = ctx.measureText(text);
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    
    // The qr-code-styling library adds an internal margin. We must counteract this to bring the text closer.
    const desiredVisibleGap = 4; // The desired space in pixels between QR dots and text.
    const libraryInternalMargin = options.margin || 0; // It's 10 in our default config.
    const paddingAdjustment = desiredVisibleGap - libraryInternalMargin; // This will be a negative number.

    const finalMargin = 5; // A small margin at the top/bottom of the final image.
    newCanvas.width = qrCanvas.width;
    newCanvas.height = qrCanvas.height + textHeight + paddingAdjustment + finalMargin;

    // Add a white background to ensure text is visible
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Use black for the text color for contrast
    ctx.fillStyle = '#000000';
    ctx.font = font;
    ctx.textAlign = 'center';

    if (labelOptions.position === 'top') {
      const textY = finalMargin + textMetrics.actualBoundingBoxAscent;
      const qrY = finalMargin + textHeight + paddingAdjustment;
      ctx.fillText(text, newCanvas.width / 2, textY);
      ctx.drawImage(qrCanvas, 0, qrY);
    } else { // bottom
      const qrY = 0;
      const textY = qrCanvas.height + paddingAdjustment + textMetrics.actualBoundingBoxAscent;
      ctx.drawImage(qrCanvas, 0, qrY);
      ctx.fillText(text, newCanvas.width / 2, textY);
    }

    return new Promise(resolve => newCanvas.toBlob(resolve, 'image/png'));
  };

  const handleDownload = (extension: 'png' | 'svg') => {
    const isLabelActive = labelOptions.text && labelOptions.position !== 'none';
    if (extension === 'svg' && isLabelActive) {
      alert("SVG download is not supported with text labels. Please download as PNG or PDF.");
      return;
    }
    
    if (extension === 'svg' && qrCodeRef.current) {
       qrCodeRef.current.download({ name: 'iLoveQR', extension: 'svg' });
       return;
    }

    getCombinedImageBlob().then(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'iLoveQR.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const handleDownloadPdf = async () => {
    if (window.jspdf) {
      try {
        const blob = await getCombinedImageBlob();
        if (!blob) {
          alert('Could not get QR code image data.');
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF();
          
          const qrSizeInPdf = 75;
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          
          const x = (pageWidth - qrSizeInPdf) / 2;
          const y = (pageHeight - qrSizeInPdf) / 2;

          doc.addImage(base64data, 'PNG', x, y, qrSizeInPdf, qrSizeInPdf);
          doc.save('iLoveQR.pdf');
        }
      } catch (error) {
        console.error('Failed to create PDF:', error);
        alert('Failed to generate PDF. An error occurred.');
      }
    }
  };


  const handleCopyImage = async () => {
    try {
      const blob = await getCombinedImageBlob();
      if (blob) {
        await navigator.clipboard.write([ new ClipboardItem({ 'image/png': blob }) ]);
        alert('QR Code image copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to copy image:', error);
      alert('Failed to copy image. Your browser may not support this feature.');
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      alert("Web Share API is not supported in your browser.");
      return;
    }

    try {
      const blob = await getCombinedImageBlob();
      if (!blob) {
        alert('Could not generate QR code image for sharing.');
        return;
      }
      
      const file = new File([blob], 'iLoveQR.png', { type: 'image/png' });
      const shareData = {
        files: [file],
        title: 'My QR Code from iLoveQR',
        text: 'Check out this QR code I made!',
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        alert("Sharing this file type is not supported on your device.");
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
        alert('An error occurred while sharing the QR code.');
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto lg:gap-8">
      <div className="lg:order-2 lg:w-2/3">
        <ControlsPanel
          text={text}
          setText={setText}
          options={options}
          setOptions={setOptions}
          labelOptions={labelOptions}
          setLabelOptions={setLabelOptions}
          presets={PRESETS}
          onPresetSelect={handlePreset}
          onDownload={handleDownload}
          onDownloadPdf={handleDownloadPdf}
          onCopyImage={handleCopyImage}
          onShare={handleShare}
          onResetToDefault={handleResetToDefault}
          estimatedSize={estimatedSize}
          selectedPresetName={selectedPresetName}
          onDesignChange={handleDesignChange}
        />
      </div>
      <div className="lg:order-1 order-first lg:w-1/3">
        <QRCodePreview 
          text={text} 
          options={options} 
          labelOptions={labelOptions}
          qrCodeRef={qrCodeRef}
          previewContainerRef={previewContainerRef}
        />
      </div>
    </div>
  );
};

export default QRCodeGenerator;