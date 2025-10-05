import React, { JSX } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import HomePage from '@/components/HomePage';
import AdminPage from '@/components/AdminPage';
import HowItWorks from '@/components/HowItWorks';
import Leaderboard from '@/components/Leaderboard';
import { Toaster } from '@/components/ui/sonner';

function App(): JSX.Element {
  const location = useLocation();

  return (
    <div id="app-container" className="min-h-screen flex flex-col bg-black relative">
      {/* Pixel art background with transparency */}
      <div 
        className="fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: 'url(https://tarobase-app-storage-public-v2-prod.s3.amazonaws.com/tarobase-app-storage-68e2492c770e4b80ae2cbf08/68e2553dd6d3436ae302cfdc)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 z-0 bg-black/70" />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main id="app-main" className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin" element={<AdminPage adminAddresses={["0x1234567890123456789012345678901234567890"]} />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Toaster />
      </div>
    </div>
  );
}

export default App;
