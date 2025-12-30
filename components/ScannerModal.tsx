
import React, { useRef, useEffect, useState } from 'react';
import { X, VideoOff, Zap } from 'lucide-react';

declare global {
  interface Window {
    jsQR: (data: Uint8ClampedArray, width: number, height: number, options?: {
      inversionAttempts?: "dontInvert" | "onlyInvert" | "attemptBoth";
    }) => any | null;
  }
}

interface ScannerModalProps {
  onClose: () => void;
  onScanSuccess: (data: string) => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ onClose, onScanSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isFlashSupported, setIsFlashSupported] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let stream: MediaStream | null = null;
    
    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
             onScanSuccess(code.data);
             return; // Stop scanning
          }
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    const startScan = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        const track = stream.getVideoTracks()[0];
        if (track) {
          videoTrackRef.current = track;
          const capabilities = track.getCapabilities() as any;
          if (capabilities.torch) {
            setIsFlashSupported(true);
          }
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true"); // required for iOS
          videoRef.current.play();
          animationFrameId = requestAnimationFrame(tick);
        }
      } catch (err) {
        console.error("Camera Error:", err);
        setError("Could not access camera. Please check permissions.");
      }
    };
    
    startScan();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScanSuccess]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200); // Snappier exit
  };

  const toggleFlash = async () => {
    if (videoTrackRef.current && isFlashSupported) {
      try {
        await videoTrackRef.current.applyConstraints({
          advanced: [{ torch: !isFlashOn }],
        });
        setIsFlashOn(!isFlashOn);
      } catch (err) {
        console.error('Failed to toggle flash:', err);
      }
    }
  };


  return (
    <div 
      className={`fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-[#0a0a0f] text-white rounded-3xl shadow-[0_50px_100px_rgba(0,0,0,0.9)] w-full max-w-md m-4 p-6 relative overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${isClosing ? 'scale-90 translate-y-8 opacity-0' : 'scale-100 translate-y-0 opacity-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors z-20 p-2 hover:bg-white/5 rounded-full">
          <X size={28} />
        </button>
        <h2 className="text-2xl font-black text-center mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text uppercase tracking-tighter">QR Scanner</h2>
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
          <video ref={videoRef} className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-center p-8">
              <VideoOff size={64} className="text-red-500/50 mb-6" />
              <p className="text-red-500 font-bold uppercase tracking-widest text-sm">{error}</p>
            </div>
          )}
          {!error && (
            <>
              <div className="absolute inset-0 border-[12px] border-black/20 rounded-2xl pointer-events-none"></div>
              <div className="scanner-line absolute left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-cyan-400/60 rounded-tl-xl pointer-events-none"></div>
              <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-cyan-400/60 rounded-tr-xl pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-cyan-400/60 rounded-bl-xl pointer-events-none"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-cyan-400/60 rounded-br-xl pointer-events-none"></div>
            </>
          )}
           {isFlashSupported && (
            <button
              onClick={toggleFlash}
              className={`absolute bottom-6 right-6 p-4 rounded-2xl transition-all duration-200 z-20 ${
                isFlashOn ? 'bg-cyan-400 text-black shadow-[0_0_30px_rgba(34,211,238,0.5)]' : 'bg-black/40 text-white/80 backdrop-blur-xl border border-white/10'
              }`}
            >
              <Zap size={24} />
            </button>
          )}
        </div>
        <p className="text-center text-white/40 mt-6 text-[11px] font-black uppercase tracking-[0.2em]">Align matrix within guides</p>
        <style>{`
          @keyframes scan-animation {
            0% { top: 0; opacity: 0.5; }
            50% { opacity: 1; }
            100% { top: calc(100% - 8px); opacity: 0.5; }
          }
          .scanner-line {
            animation: scan-animation 2.5s ease-in-out infinite alternate;
            box-shadow: 0 0 40px 4px rgba(34, 211, 238, 0.6);
            filter: blur(2px);
          }
        `}</style>
      </div>
    </div>
  );
};

export default ScannerModal;
