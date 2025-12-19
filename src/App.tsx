import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { CandidatePortal } from "./components/CandidatePortal";
import { RecruiterDashboard } from "./components/RecruiterDashboard";
import { JobPostings } from "./components/JobPostings";
import { Navigation } from "./components/Navigation";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/candidate/*" element={
            <Authenticated>
              <AuthenticatedApp userType="candidate" />
            </Authenticated>
          } />
          <Route path="/recruiter/*" element={
            <Authenticated>
              <AuthenticatedApp userType="recruiter" />
            </Authenticated>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to HireMind AI</h1>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
        <Authenticated>
          <Navigate to="/recruiter" replace />
        </Authenticated>
      </div>
    </div>
  );
}

function AuthenticatedApp({ userType }: { userType: "candidate" | "recruiter" }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Navigation userType={userType} />
      <main className="flex-1">
        <Routes>
          {userType === "candidate" ? (
            <>
              <Route path="/" element={<CandidatePortal />} />
              <Route path="/profile" element={<CandidatePortal />} />
              <Route path="/interview" element={<CandidatePortal />} />
            </>
          ) : (
            <>
              <Route path="/" element={<RecruiterDashboard />} />
              <Route path="/candidates" element={<RecruiterDashboard />} />
              <Route path="/analytics" element={<RecruiterDashboard />} />
              <Route path="/jobs" element={<JobPostings />} />
            </>
          )}
        </Routes>
      </main>
    </>
  );
}
