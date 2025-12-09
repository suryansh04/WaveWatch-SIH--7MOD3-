import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileBarChart,
  Map,
  Phone,
  Menu,
  X,
} from "lucide-react";
import "./AnalystSidebar.css";

const AnalystSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    if (
      path === "/analyst-dashboard" &&
      location.pathname === "/analyst-dashboard"
    ) {
      return true;
    }
    return location.pathname === path;
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/analyst-dashboard" },
    { name: "Analysis", icon: FileBarChart, path: "/analyst-analysis" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="analyst-mobile-menu-btn" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="analyst-mobile-overlay"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`analyst-sidebar ${
          isMobileMenuOpen ? "analyst-sidebar-open" : ""
        }`}
      >
        {/* Header Section */}
        <div className="analyst-sidebar-header">
          <Link
            to="/analyst-dashboard"
            className="analyst-logo-link"
            onClick={handleNavClick}
          >
            <h1 className="analyst-logo">WaveWatch</h1>
            <p className="analyst-tagline">Analyst Portal</p>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="analyst-sidebar-nav">
          <ul className="analyst-nav-list">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li
                  key={item.name}
                  className={`analyst-nav-item ${
                    isActiveRoute(item.path) ? "analyst-nav-active" : ""
                  }`}
                >
                  <Link
                    to={item.path}
                    className="analyst-nav-link"
                    onClick={handleNavClick}
                  >
                    <span className="analyst-nav-icon">
                      <IconComponent size={18} />
                    </span>
                    <span className="analyst-nav-text">{item.name}</span>
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

export default AnalystSidebar;
