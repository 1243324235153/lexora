import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Landing from "./pages/Landing";
import AppPage from "./pages/AppPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading, isFirebaseConfigured } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-lexora-bg">Laddar...</div>;
  }

  // If Firebase is not configured, we allow access for demo purposes, 
  // but ideally we'd force them to configure it.
  if (!isFirebaseConfigured) {
    return <>{children}</>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <AppPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}
