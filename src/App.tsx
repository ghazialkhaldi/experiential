
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModeProvider } from '@/contexts/ModeContext';
import { Capacitor } from '@capacitor/core';

// Import both regular and mobile app components
import { MobileApp } from '@/mobile';
import Index from './pages/Index';

const queryClient = new QueryClient();

const App = () => {
  // Use mobile app when running on native platform or when URL contains mobile parameter
  const isMobile = Capacitor.isNativePlatform() || 
                   new URLSearchParams(window.location.search).has('mobile');

  return (
    <QueryClientProvider client={queryClient}>
      <ModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {isMobile ? <MobileApp /> : (
              <Routes>
                <Route path="/*" element={<Index />} />
              </Routes>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </ModeProvider>
    </QueryClientProvider>
  );
};

export default App;
