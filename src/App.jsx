
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import InvitationPage from "./pages/InvitationPage";
import PublicInvitationPage from "./pages/PublicInvitationPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import InvitationEditor from "./pages/InvitationEditor";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InvitationPage />} />
        <Route path="/invite/:slug" element={<PublicInvitationPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/invitation-editor/:id" element={<ProtectedRoute><InvitationEditor /></ProtectedRoute>} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
