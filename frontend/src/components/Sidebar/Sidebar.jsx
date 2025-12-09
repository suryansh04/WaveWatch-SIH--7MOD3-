// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Map,
//   FileBarChart,
//   Bell,
//   MessageSquareText,
//   Menu,
//   UserCheck,
//   X,
//   MessageCircle, // Added for WhatsApp Reports
// } from "lucide-react";
// import "./Sidebar.css";

// const Sidebar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const location = useLocation();

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const handleNavClick = () => {
//     setIsMobileMenuOpen(false); // Close mobile menu on navigation
//   };

//   // Check if current path is active
//   const isActiveRoute = (path) => {
//     if (
//       path === "/dashboard" &&
//       (location.pathname === "/" || location.pathname === "/dashboard")
//     ) {
//       return true;
//     }
//     return location.pathname === path;
//   };

//   const navItems = [
//     { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
//     { name: "View Map", icon: Map, path: "/view-map" },
//     { name: "Reports", icon: FileBarChart, path: "/reports" },
//     // {

//     { name: "Create Alert", icon: Bell, path: "/create-alert" },
//     {
//       name: "Social Media Analysis",
//       icon: MessageSquareText,
//       path: "/social-media-analysis",
//     },
//     { name: "Approve Users", icon: UserCheck, path: "/approve-users" },
//   ];

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
//         {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//       </button>

//       {/* Mobile Overlay */}
//       {isMobileMenuOpen && (
//         <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
//       )}

//       {/* Sidebar */}
//       <div className={`sidebar ${isMobileMenuOpen ? "sidebar-open" : ""}`}>
//         {/* Header Section */}
//         <div className="sidebar-header">
//           <Link to="/dashboard" className="logo-link" onClick={handleNavClick}>
//             <h1 className="logo">WaveWatch</h1>
//             <p className="tagline">Guarding Oceans, Saving Lives</p>
//           </Link>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="sidebar-nav">
//           <ul className="nav-list">
//             {navItems.map((item) => {
//               const IconComponent = item.icon;
//               return (
//                 <li
//                   key={item.name}
//                   className={`nav-item ${
//                     isActiveRoute(item.path) ? "active" : ""
//                   }`}
//                 >
//                   <Link
//                     to={item.path}
//                     className="nav-link"
//                     onClick={handleNavClick}
//                   >
//                     <span className="nav-icon">
//                       <IconComponent size={18} />
//                     </span>
//                     <span className="nav-text">{item.name}</span>
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  FileBarChart,
  Bell,
  MessageSquareText,
  Menu,
  UserCheck,
  X,
  MessageCircleMore,
  Phone, // Added for Call Reports
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  // Check if current path is active
  const isActiveRoute = (path) => {
    if (
      path === "/dashboard" &&
      (location.pathname === "/" || location.pathname === "/dashboard")
    ) {
      return true;
    }
    return location.pathname === path;
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "View Map", icon: Map, path: "/view-map" },
    { name: "Reports", icon: FileBarChart, path: "/reports" },
    { name: "Call Reports", icon: Phone, path: "/call-reports" },

    { name: "Create Alert", icon: Bell, path: "/create-alert" },
    {
      name: "Social Media Analysis",
      icon: MessageSquareText,
      path: "/social-media-analysis",
    },
    { name: "Approve Users", icon: UserCheck, path: "/approve-users" },
    { name: "SMS Reports", icon: MessageCircleMore, path: "/sms-reports" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? "sidebar-open" : ""}`}>
        {/* Header Section */}
        <div className="sidebar-header">
          <Link to="/dashboard" className="logo-link" onClick={handleNavClick}>
            <h1 className="logo">WaveWatch</h1>
            <p className="tagline">Guarding Oceans, Saving Lives</p>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li
                  key={item.name}
                  className={`nav-item ${
                    isActiveRoute(item.path) ? "active" : ""
                  }`}
                >
                  <Link
                    to={item.path}
                    className="nav-link"
                    onClick={handleNavClick}
                  >
                    <span className="nav-icon">
                      <IconComponent size={18} />
                    </span>
                    <span className="nav-text">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
