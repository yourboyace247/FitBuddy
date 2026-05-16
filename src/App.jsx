import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/shared/ProtectedRoute";

import { WorkoutProvider } from './context/WorkoutContext';

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AboutUsPage from "./pages/AboutUsPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";

import AddWorkoutPlanPage from './pages/AddWorkoutPlanPage';
import WorkoutPlansPage from './pages/WorkoutPlansPage';
import AddDailyMealsPage from './pages/AddDailyMealsPage';
import DailyMealsPage from './pages/DailyMealsPage';

function App() {

  return (
    <AuthProvider>
      <WorkoutProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />

          {/* Protected routes - Only logged in users */}
          <Route path="/" element={<ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/add-workout" element={
          <ProtectedRoute>
            <AddWorkoutPlanPage />
          </ProtectedRoute>
        } />
        <Route path="/workout-plans" element={
          <ProtectedRoute>
            <WorkoutPlansPage />
          </ProtectedRoute>
        } />
        <Route path="/add-meals" element={
          <ProtectedRoute>
            <AddDailyMealsPage />
          </ProtectedRoute>
        } />
        <Route path="/daily-meals" element={
          <ProtectedRoute>
            <DailyMealsPage />
          </ProtectedRoute>
        } />
          {/* Redirect all unknown routes to auth */}
          <Route path="*" element={<AuthPage />} />

        </Routes>
      </Router>
    </WorkoutProvider>
    </AuthProvider>
  );
}

export default App;