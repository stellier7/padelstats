import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import MatchesList from './components/matches/MatchesList';
import CreateMatch from './components/matches/CreateMatch';
import MatchDetails from './components/matches/MatchDetails';
import LiveMatch from './components/matches/LiveMatch';
import Stats from './components/stats/Stats';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <Dashboard />
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/matches"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <MatchesList />
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/matches/new"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <CreateMatch />
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/matches/:id"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <MatchDetails />
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/matches/:id/live"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <LiveMatch />
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/stats"
              element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <Stats />
                  </div>
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
