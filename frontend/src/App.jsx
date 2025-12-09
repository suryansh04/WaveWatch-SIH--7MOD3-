// import React from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
// import Sidebar from "./components/Sidebar/Sidebar";
// import Dashboard from "./Pages/Dashboard";
// import ViewMap from "./components/ViewMap/ViewMap";
// import LoginForm from "./components/Login/LoginForm";
// import SignupForm from "./components/Signup/SignupForm";
// import ApproveUsers from "./components/ApproveUsers/ApproveUsers";
// import AlertComponent from "./components/AlertComponent/AlertComponent";
// import ViewReports from "./components/ViewReport/ViewReport";
// import SocialMediaAnalysis from "./components/SocialMediaAnalysisComponent/SocialMediaAnalysis";
// import CallReports from "./components/CallReports/CallReports";
// import AnalystDashboard from "./Pages/AnalystDashboard/AnalystDashboard";

// const App = () => {
//   const location = useLocation();
//   const hideSidebarRoutes = ["/", "/login", "/signup"];
//   const shouldHideSidebarRoutes = hideSidebarRoutes.includes(location.pathname);

//   return (
//     <div className="app">
//       {!shouldHideSidebarRoutes && <Sidebar />}
//       <Routes>
//         <Route path="/" element={<LoginForm />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/view-map" element={<ViewMap />} />
//         <Route path="/login" element={<LoginForm />} />
//         <Route path="/signup" element={<SignupForm />} />
//         <Route path="/create-alert" element={<AlertComponent />} />
//         <Route path="/approve-users" element={<ApproveUsers />} />
//         <Route path="/reports" element={<ViewReports />} />
//         <Route path="/Call-reports" element={<CallReports />} />
//         <Route
//           path="/social-media-analysis"
//           element={<SocialMediaAnalysis />}
//         />
//         <Route path="/analyst-dashboard" element={<AnalystDashboard />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;

//------------------------------ NEW CODE---------------------------------------------------------------------------------------------------

import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Your existing imports
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./Pages/Dashboard";
import ViewMap from "./components/ViewMap/ViewMap";
import LoginForm from "./components/Login/LoginForm";
import SignupForm from "./components/Signup/SignupForm";
import ApproveUsers from "./components/ApproveUsers/ApproveUsers";
import AlertComponent from "./components/AlertComponent/AlertComponent";
import ViewReports from "./components/ViewReport/ViewReport";
import SocialMediaAnalysis from "./components/SocialMediaAnalysisComponent/SocialMediaAnalysis";
import CallReports from "./components/CallReports/CallReports";

// NEW: Analyst Dashboard imports
import AnalystDashboard from "./Pages/AnalystDashboard/AnalystDashboard";
import AnalystReports from "./components/AnalystReports/AnalystReports";
import AnalystMap from "./components/AnalystMap/AnalystMap";
import AnalystCallReports from "./components/AnalystCallReports/AnalystCallReports";
import SmsReports from "./components/SMSReports/SmsReports";
import AnalysisPage from "./components/AnalysisPage/AnalysisPage";
const App = () => {
  const location = useLocation();

  // Hide sidebar for login, signup, and all analyst routes
  const hideSidebarRoutes = [
    "/",
    "/login",
    "/signup",
    "/analyst-dashboard",
    "/analyst-reports",
    "/analyst-map",
    "/analyst-call-reports",
    "/analyst-analysis",
  ];

  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="app">
      {!shouldHideSidebar && <Sidebar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view-map" element={<ViewMap />} />
        <Route path="/create-alert" element={<AlertComponent />} />
        <Route path="/approve-users" element={<ApproveUsers />} />
        <Route path="/reports" element={<ViewReports />} />
        <Route path="/call-reports" element={<CallReports />} />
        <Route
          path="/social-media-analysis"
          element={<SocialMediaAnalysis />}
        />
        <Route path="/sms-reports" element={<SmsReports />} />

        {/* Analyst Routes */}
        <Route path="/analyst-dashboard" element={<AnalystDashboard />} />
        <Route path="/analyst-analysis" element={<AnalysisPage />} />
      </Routes>
    </div>
  );
};

export default App;
