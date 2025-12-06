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
    setTimeout(onClose, 300); // Wait for animation to finish
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
      className={`fixed inset-0 bg-gray-900/50 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-gray-50 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200 rounded-3xl shadow-2xl w-full max-w-md m-4 p-4 relative overflow-hidden ${isClosing ? 'animate-slide-out-down-fade' : 'animate-slide-in-up-fade'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-20">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-[#A76BFF] to-[#FF4BC8] text-transparent bg-clip-text">QR Scanner</h2>
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black border border-black/10 dark:border-white/10">
          <video ref={videoRef} className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1e1e1e]/80 text-center p-4">
              <VideoOff size={48} className="text-red-500 mb-4" />
              <p className="text-red-500">{error}</p>
            </div>
          )}
          {!error && (
            <>
              <div className="absolute inset-0 border-4 border-black/10 rounded-2xl pointer-events-none"></div>
              <div className="scanner-line absolute left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#FF4BC8] to-transparent"></div>
            </>
          )}
           {isFlashSupported && (
            <button
              onClick={toggleFlash}
              className={`absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300 z-20 ${
                isFlashOn ? 'bg-yellow-400 text-black shadow-lg' : 'bg-black/20 dark:bg-black/40 text-white backdrop-blur-sm'
              }`}
              aria-label={isFlashOn ? 'Turn off flash' : 'Turn on flash'}
            >
              <Zap size={20} />
            </button>
          )}
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4 text-sm">Point your camera at a QR code</p>
        <style>{`
          @keyframes scan-animation {
            0% { 
              top: 0;
              opacity: 0.7;
            }
            50% {
                opacity: 1;
            }
            100% { 
              top: calc(100% - 6px); /* 6px is height */
              opacity: 0.7;
            }
          }
          .scanner-line {
            animation: scan-animation 3s ease-in-out infinite alternate;
            box-shadow: 0 0 20px 2px rgba(255, 75, 200, 0.7);
            filter: blur(2px);
          }
        `}</style>
      </div>
    </div>
  );
};

export default ScannerModal;