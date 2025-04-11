import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/About";
import Jobs from "./pages/Jobs";
import Events from "./pages/Events";
import Survey from "./pages/Surveys";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Profile from "./pages/Profile";
import ProfilesList from "./components/userProfilesList/ProfilesList";
import AddProfile from "./components/userProfilesList/AddProfile";
import EditProfile from "./components/userProfilesList/EditProfile";
import Footer from "./components/Footer";
import JobLanding from "./pages/JobLanding";
import EmployeeJobDashboard from "./pages/EmployeeJobDashboard";
import JobDetails from "./pages/JobDetails";
import Agenda from "./components/eventDetails/Agenda";
import Speakers from "./components/eventDetails/Speakers";
import Attendees from "./components/eventDetails/Attendees";
import Organizers from "./components/eventDetails/Organizers";
import Sponsors from "./components/eventDetails/Sponsors";
import EventDashboard from "./pages/EventDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from 'react-hot-toast';
import PostJob from "./pages/PostJob";
import ApplicantListing from "./pages/ApplicantListing";
import CandidateListing from "./pages/CandidateListing";
import ForgotPassword from "./pages/ForgotPassword";
import ManageJobs from "./pages/ManageJobs";
import ManageApplications from "./pages/ManageApplications";
import NotFound from "./pages/NotFound";
import SurveyDashboard from "./pages/SurveyDashboard";

import FormBuilder from "./pages/FormBuilder";
import Forms from "./pages/Forms";
import FormSubmit from "./pages/FormSubmit";
import FormResponses from "./pages/FormResponses";
import ScrollToTop from "./components/ScrollToTop";

import ComingSoon from "./pages/ComingSoon";
import ThankYou from './pages/ThankYou';
import ThankYouVoucher from "./pages/ThankYouVoucher";

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar key={user ? user.id : "logged-out"} />
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route
          path="/eventAdmin"
          element={
            <ProtectedRoute allowedRoles={["admin", "company"]}>
              <EventDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Redirect all job-related routes to coming-soon */}
        <Route path="/jobs/*" element={<Navigate to="/coming-soon" replace />} />
        <Route path="/joblanding" element={<Navigate to="/coming-soon" replace />} />
        <Route path="/applicantlisting" element={<Navigate to="/coming-soon" replace />} />
        <Route path="/candidatelisting" element={<Navigate to="/coming-soon" replace />} />
        <Route path="/employeeDashboard" element={<Navigate to="/coming-soon" replace />} />
        <Route path="/manage-jobs" element={<Navigate to="/coming-soon" replace />} />
        <Route path="/manage-applications/*" element={<Navigate to="/coming-soon" replace />} />

        {/* Events Routes */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route
          path="/events/create"
          element={
            <ProtectedRoute allowedRoles={["admin", "company"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "company"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route path="/events/agenda/:id" element={<Agenda />} />
        <Route path="/events/speakers/:id" element={<Speakers />} />
        <Route path="/events/attendees/:id" element={<Attendees />} />
        <Route path="/events/organizers/:id" element={<Organizers />} />
        <Route path="/events/sponsors/:id" element={<Sponsors />} />
        <Route path="/about" element={<About />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/SurveyDashboard" element={<SurveyDashboard />} />

        {/* Form Routes */}
        <Route path="/forms" element={<Forms />} />
        <Route
          path="/forms/create"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FormBuilder />
            </ProtectedRoute>
          }
        />
        {/* Add this new route for editing forms */}
        <Route
          path="/forms/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FormBuilder />
            </ProtectedRoute>
          }
        />
        <Route path="/forms/:id/submit" element={<FormSubmit />} />
        <Route
          path="/forms/:id/responses"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FormResponses />
            </ProtectedRoute>
          }
        />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/thank-you-voucher" element={<ThankYouVoucher />} />

          {/* Existing route for admins viewing other users */}
          <Route 
            path="/profile/user/:id" 
            element={
              <ProtectedRoute allowedRoles={["admin", "company", "member"]}>
                <Profile adminView />
              </ProtectedRoute>
            } 
          />

          {/* New route for regular users viewing their own profile */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={["admin", "company", "member"]}>
                <Profile />
              </ProtectedRoute>
            } 
          />

        {/* Catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
