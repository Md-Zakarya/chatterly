import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FriendsPage from "./pages/FriendsPage";
import Header from "./components/Header";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <div className="min-h-screen text-[var(--fg)]">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-black focus:px-3 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <div className="grid h-dvh grid-rows-[auto,1fr] overflow-hidden">
                     <Header />
                      <main id="main" className="min-h-0 overflow-hidden">
                        <HomePage />
                      </main>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/friends" 
              element={
                <ProtectedRoute>
                  <div className="grid h-dvh grid-rows-[auto,1fr] overflow-hidden">
                     <Header />
                      <main id="main" className="min-h-0 overflow-hidden">
                        <FriendsPage />
                      </main>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;