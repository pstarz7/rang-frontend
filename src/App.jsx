import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ColorProvider } from './context/ColorContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
// Layout & Navigation
import Navbar from './components/Layout/Navbar';
import LandingPage from './components/Layout/LandingPage';

// Pages
import Generatorpage from './pages/Generatorpage';
import Dashboardpage from './pages/Dashboard'; 
import Explorepage from './pages/Explore';
import Librarypage from './pages/Library';

// Tools
import ImageExtractor from './components/Tools/ImageExtractor'; // COLLAGE MAKER

// Auth
import Loginpage from './components/Auth/Login';
import Signuppage from './components/Auth/Signup';

// Minimal Loading State for smooth transitions
const LoadingScreen = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Syncing Architect...</p>
    </div>
  </div>
);

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <ColorProvider>
        <Router>
          {/* Navbar is outside Routes so it stays pinned at the top */}
          <Navbar /> 
          
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* CORE PAGES */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/generate" element={<Generatorpage />} />
              <Route path="/explore" element={<Explorepage />} />
              <Route path="/library" element={<Librarypage />} />
              <Route path="/dashboard" element={<Dashboardpage />} />
              
              {/* TOOLS - FIXING THE COLLAGE ROUTE HERE */}
              <Route path="/collage" element={<ImageExtractor />} />
              
              {/* AUTHENTICATION */}
              <Route path="/login" element={<Loginpage />} />
              <Route path="/signup" element={<Signuppage />} />
              
              {/* FALLBACK */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </Suspense>
        </Router>
      </ColorProvider>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;