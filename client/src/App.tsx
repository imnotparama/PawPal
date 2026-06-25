import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { AppShell } from '@/components/AppShell';
import { Dashboard } from '@/pages/Dashboard';
import { MyPets } from '@/pages/MyPets';
import { AIChat } from '@/pages/AIChat';
import { Vaccinations } from '@/pages/Vaccinations';
import { MedicalRecords } from '@/pages/MedicalRecords';
import { HealthTimeline } from '@/pages/HealthTimeline';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pets" element={<MyPets />} />
          <Route path="chat" element={<AIChat />} />
          <Route path="vaccinations" element={<Vaccinations />} />
          <Route path="records" element={<MedicalRecords />} />
          <Route path="timeline" element={<HealthTimeline />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
