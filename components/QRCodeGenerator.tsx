
import React, { useState, useEffect, useRef } from 'react';
import ControlsPanel from './ControlsPanel';
import QRCodePreview from './QRCodePreview';
import { DEFAULT_OPTIONS, PRESETS, DEFAULT_LABEL_OPTIONS } from '../constants';
import type { QROptions, Preset, LabelOptions } from '../types';

interface QRCodeGeneratorProps {
  initialText?: string;
}

declare global {
  interface window {
    jspdf: any;
    QRCodeStyling: any;
  }
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ initialText }) => {
  const [text, setText] = useState(initialText || 'https://eztify.pages.dev/#/');
  const [options, setOptions] = useState<QROptions>(DEFAULT_OPTIONS);
  const [labelOptions, setLabelOptions] = useState<LabelOptions>(DEFAULT_LABEL_OPTIONS);
  const [selectedPresetName, setSelectedPresetName] = useState<string | null>(null);

  const qrCodeRef = useRef<any | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialText) setText(initialText);
  }, [initialText]);

  const handlePreset = (preset: Preset) => {
    setOptions(prev => ({ ...prev, ...preset.options }));
    setSelectedPresetName(preset.name);
  };

  const handleResetToDefault = () => {
    setOptions(DEFAULT_OPTIONS);
    setLabelOptions(DEFAULT_LABEL_OPTIONS);
    setSelectedPresetName(null);
  };
  
  const handleDesignChange = () => setSelectedPresetName(null);

  const getCombinedImageBlob = async (): Promise<Blob | null> => {
    const isLabelActive = labelOptions.text && labelOptions.position !== 'none';
    if (!isLabelActive) {
      const rawData = await qrCodeRef.current?.getRawData('png');
      return rawData ?? null;
    }

    const qrCanvas = previewContainerRef.current?.querySelector('canvas');
    const labelElement = previewContainerRef.current?.querySelector('[data-label="true"]');
    if (!qrCanvas || !labelElement) return (await qrCodeRef.current?.getRawData('png')) ?? null;

    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d');
    if (!ctx) return null;

    const computedStyle = window.getComputedStyle(labelElement);
    const font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
    ctx.font = font;
    const textMetrics = ctx.measureText(labelOptions.text);
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    const desiredVisibleGap = 4;
    const paddingAdjustment = desiredVisibleGap - (options.margin || 0);
    const finalMargin = 5;

    newCanvas.width = qrCanvas.width;
    newCanvas.height = qrCanvas.height + textHeight + paddingAdjustment + finalMargin;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = font;
    ctx.textAlign = 'center';

    if (labelOptions.position === 'top') {
      ctx.fillText(labelOptions.text, newCanvas.width / 2, finalMargin + textMetrics.actualBoundingBoxAscent);
      ctx.drawImage(qrCanvas, 0, finalMargin + textHeight + paddingAdjustment);
    } else {
      ctx.drawImage(qrCanvas, 0, 0);
      ctx.fillText(labelOptions.text, newCanvas.width / 2, qrCanvas.height + paddingAdjustment + textMetrics.actualBoundingBoxAscent);
    }
    return new Promise(resolve => newCanvas.toBlob(resolve, 'image/png'));
  };

  const handleDownload = (extension: 'png' | 'svg') => {
    const isLabelActive = labelOptions.text && labelOptions.position !== 'none';
    if (extension === 'svg' && isLabelActive) return alert("SVG not supported with labels.");
    if (extension === 'svg' && qrCodeRef.current) return qrCodeRef.current.download({ name: 'iLoveQR', extension: 'svg' });

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
    if ((window as any).jspdf) {
      const blob = await getCombinedImageBlob();
      if (!blob) return;
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF();
        doc.addImage(reader.result, 'PNG', (doc.internal.pageSize.getWidth()-75)/2, (doc.internal.pageSize.getHeight()-75)/2, 75, 75);
        doc.save('iLoveQR.pdf');
      }
    }
  };

  const handleCopyImage = async () => {
    try {
      const blob = await getCombinedImageBlob();
      if (blob) {
        await navigator.clipboard.write([ new ClipboardItem({ 'image/png': blob }) ]);
        alert('Copied to clipboard!');
      }
    } catch (e) { alert('Failed to copy.'); }
  };

  const handleShare = async () => {
    if (!navigator.share) return alert("Share API not supported.");
    const blob = await getCombinedImageBlob();
    if (!blob) return;
    const file = new File([blob], 'iLoveQR.png', { type: 'image/png' });
    try { await navigator.share({ files: [file], title: 'My QR Code' }); } catch (e) {}
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:gap-10 lg:gap-16 items-start">
      <div className="w-full md:w-[25%] mb-4 md:mb-0">
        <QRCodePreview 
          text={text} options={options} labelOptions={labelOptions}
          qrCodeRef={qrCodeRef} previewContainerRef={previewContainerRef}
        />
      </div>
      <div className="w-full md:w-[75%]">
        <ControlsPanel
          text={text} setText={setText}
          options={options} setOptions={setOptions}
          labelOptions={labelOptions} setLabelOptions={setLabelOptions}
          presets={PRESETS} onPresetSelect={handlePreset}
          onDownload={handleDownload} onDownloadPdf={handleDownloadPdf}
          onCopyImage={handleCopyImage} onShare={handleShare}
          onResetToDefault={handleResetToDefault}
          selectedPresetName={selectedPresetName}
          onDesignChange={handleDesignChange}
        />
      </div>
    </div>
  );
};

export default QRCodeGenerator;
