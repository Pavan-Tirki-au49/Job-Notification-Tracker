import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import './components/layout/Page.css';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { SavedPage } from './pages/SavedPage';
import { DigestPage } from './pages/DigestPage';
import { ProofPage } from './pages/ProofPage';
import { TestChecklistPage } from './pages/TestChecklistPage';
import { ShipPage } from './pages/ShipPage';

// Layout wrapper for all pages
const AppLayout = () => {
  return (
    <div className="layout bg-bg text-text min-h-screen font-sans">
      <Navigation />
      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/digest" element={<DigestPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/proof" element={<ProofPage />} />
          <Route path="/jt/proof" element={<ProofPage />} />
          <Route path="/jt/07-test" element={<TestChecklistPage />} />
          <Route path="/jt/08-ship" element={<ShipPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
