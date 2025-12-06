import React, { useState, useEffect } from 'react';
import QRCodeGenerator from './components/QRCodeGenerator';
import ScannerModal from './components/ScannerModal';
import { Logo } from './components/Logo';
import { ScanLine, CheckCircle2, Layers, Zap, Download, Shield, LayoutGrid, Smartphone, Printer, Globe, ShoppingBag, Wifi, Ticket, UserCircle, ExternalLink, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check local storage or fallback to system preference/HTML class
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const htmlHasDark = document.documentElement.classList.contains('dark');

    if (savedTheme === 'dark' || (!savedTheme && htmlHasDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
       // Default fallback
       setIsDark(true);
       document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleScanSuccess = (data: string) => {
    setScannedData(data);
    setIsScannerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#121212] text-gray-900 dark:text-gray-200 overflow-x-hidden transition-colors duration-300">
      <div className="relative z-10">
        
        {/* Compact Header */}
        <header className="w-full max-w-7xl mx-auto py-3 px-4 md:px-6 flex items-center justify-between relative animate-slide-in-up-fade" style={{ animationDelay: '100ms'}}>
            
            {/* Left: Brand */}
            <div className="flex items-center gap-2.5 z-20">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#A76BFF] via-[#FF4BC8] to-[#46C6FF] rounded-full blur-md opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <Logo className="relative z-10 w-8 h-8" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#A76BFF] via-[#FF4BC8] to-[#46C6FF] text-transparent bg-clip-text tracking-tight pb-0.5">
                    iLoveQR
                </h1>
            </div>

            {/* Center: Tagline (Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium whitespace-nowrap tracking-wide">
                    Create beautiful, fluid QR codes right in your browser.
                </p>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3 z-20">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
            </div>
        </header>

        {/* Mobile Tagline (Below header for small screens) */}
        <div className="md:hidden text-center px-4 mb-4 -mt-1 animate-slide-in-up-fade" style={{ animationDelay: '150ms'}}>
             <p className="text-gray-500 dark:text-gray-400 text-[10px] font-medium tracking-wide">
                Create beautiful, fluid QR codes right in your browser.
            </p>
        </div>

        <main className="container mx-auto px-4 pb-12 animate-slide-in-up-fade" style={{ animationDelay: '200ms'}}>
          {scannedData && (
            <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 p-4 rounded-3xl shadow-lg mb-8 max-w-4xl mx-auto text-center animate-fade-in transition-colors">
              <h3 className="font-semibold text-lg text-[#A76BFF]">Last Scanned QR Code:</h3>
              <p className="text-gray-600 dark:text-gray-300 break-all font-mono text-sm mt-1">
                {/^https?:\/\//.test(scannedData) ? (
                  <a href={scannedData} target="_blank" rel="noopener noreferrer" className="text-[#46C6FF] hover:underline flex items-center justify-center gap-2">
                    {scannedData} <ExternalLink size={14} />
                  </a>
                ) : (
                  scannedData
                )}
              </p>
              <button onClick={() => setScannedData(null)} className="text-sm mt-3 text-pink-500 hover:text-pink-400 transition-colors">Clear</button>
            </div>
          )}
          
          <QRCodeGenerator initialText={scannedData || ''} />

          {/* SEO & Informational Content Sections */}
          <div className="mt-24 max-w-5xl mx-auto space-y-24 text-gray-600 dark:text-gray-300 transition-colors">
            
            {/* 1. Extended Hero Section */}
            <section className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-[#A76BFF] to-[#46C6FF] text-transparent bg-clip-text inline-block">
                Professional QR Code Generator for Everyone
              </h2>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                iLoveQR is a next-generation, browser-based QR code generator trusted by users worldwide. 
                Whether you need a code for a <span className="text-gray-900 dark:text-gray-200 font-medium">business card</span>, 
                <span className="text-gray-900 dark:text-gray-200 font-medium"> product packaging</span>, or a 
                <span className="text-gray-900 dark:text-gray-200 font-medium"> digital marketing campaign</span>, 
                our tool provides professional-grade customization completely for free. 
                Create unique designs with custom gradients, embedded logos, and artistic dot styles. 
                Because iLoveQR runs entirely in your browser, your data remains 
                <span className="text-[#A76BFF] font-medium"> 100% private and secure</span>—it never touches a server.
              </p>
            </section>

            {/* 2. Feature List */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Key Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: <Layers size={24} className="text-[#A76BFF]" />, title: "Custom Gradients", text: "Design eye-catching codes with linear and radial gradients to match your brand." },
                  { icon: <CheckCircle2 size={24} className="text-[#46C6FF]" />, title: "Logo Integration", text: "Seamlessly embed your brand logo or icon directly into the center of the QR code." },
                  { icon: <Download size={24} className="text-[#FF4BC8]" />, title: "High-Res Export", text: "Download crystal-clear PNG, SVG, and PDF formats suitable for professional printing." },
                  { icon: <Shield size={24} className="text-[#A76BFF]" />, title: "Privacy First", text: "100% client-side processing means your data never leaves your device." },
                  { icon: <LayoutGrid size={24} className="text-[#46C6FF]" />, title: "Advanced Styles", text: "Customize corner squares, dot patterns, and frames for a unique look." },
                  { icon: <Zap size={24} className="text-[#FF4BC8]" />, title: "Error Correction", text: "Adjustable correction levels (L, M, Q, H) ensure your code remains scannable." }
                ].map((feature, i) => (
                  <div key={i} className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/5 p-6 rounded-2xl hover:border-gray-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
                    <div className="mb-3">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Use Cases */}
            <section className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/5 p-8 md:p-12 rounded-3xl shadow-sm dark:shadow-none">
               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Global Use Cases</h2>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 text-center">
                  {[
                    { icon: <UserCircle size={32} />, label: "Business Cards" },
                    { icon: <ShoppingBag size={32} />, label: "Product Packaging" },
                    { icon: <Ticket size={32} />, label: "Event Tickets" },
                    { icon: <Globe size={32} />, label: "Marketing Campaigns" },
                    { icon: <Wifi size={32} />, label: "Wi-Fi Access" },
                    { icon: <Printer size={32} />, label: "Print Media" },
                  ].map((useCase, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 group">
                       <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-full text-gray-600 dark:text-gray-300 group-hover:text-[#FF4BC8] group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-all">
                         {useCase.icon}
                       </div>
                       <span className="font-medium text-gray-600 dark:text-gray-300">{useCase.label}</span>
                    </div>
                  ))}
               </div>
            </section>

            {/* 4. How-To Guide */}
            <section>
               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">How to Create a Custom QR Code</h2>
               <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
                  {[
                    { step: "01", title: "Enter Data", text: "Paste your website URL, text, or contact information into the input field." },
                    { step: "02", title: "Customize", text: "Choose colors, adjust gradients, select shapes, and upload your logo." },
                    { step: "03", title: "Export", text: "Download your code in PNG, SVG, or PDF and test it with your camera." }
                  ].map((item, i) => (
                    <div key={i} className="flex-1 text-center md:text-left relative">
                       <span className="text-6xl font-bold text-gray-200 dark:text-white/5 absolute -top-8 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 -z-10 transition-colors">{item.step}</span>
                       <h3 className="text-xl font-bold text-[#A76BFF] mb-2">{item.title}</h3>
                       <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
               </div>
            </section>

            {/* 5. FAQ Section */}
            <section className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "Can I add a logo to my QR code?", a: "Yes! iLoveQR allows you to upload and embed any custom logo or image directly into the center of your code." },
                  { q: "Which formats can I export?", a: "We support high-quality PNG, SVG, and PDF exports. SVG and PDF are perfect for large-scale printing without quality loss." },
                  { q: "How to keep custom colors scannable?", a: "Always ensure there is high contrast between your foreground (dots) and background colors. Dark dots on a light background work best." },
                  { q: "Does iLoveQR support presets?", a: "Absolutely. We offer a variety of professionally designed presets to help you get started instantly." }
                ].map((faq, i) => (
                  <div key={i} className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
            
          </div>
        </main>

        <footer className="text-center p-8 mt-12 border-t border-gray-200 dark:border-white/5 text-gray-500 text-sm bg-gray-50 dark:bg-black/20 transition-colors">
          <p className="mb-2">© {new Date().getFullYear()} iLoveQR. All rights reserved.</p>
          <p>100% client-side secure generation.</p>
        </footer>

        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 p-4 rounded-full shadow-lg hover:scale-105 hover:border-gray-300 dark:hover:border-white/20 active:scale-95 transition-all duration-300"
            aria-label="Open QR Code Scanner"
          >
            <ScanLine size={24} />
          </button>
        </div>
      </div>

      {isScannerOpen && (
        <ScannerModal
          onClose={() => setIsScannerOpen(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}
    </div>
  );
};

export default App;