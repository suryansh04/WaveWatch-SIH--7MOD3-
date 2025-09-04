import React, { useState } from "react";
import { ChevronDown, Bell, Settings, User, LogOut } from "lucide-react";
import "./Header.css";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Welcome Section */}
        <div className="header-welcome">
          <h1 className="welcome-text">Welcome Admin,👋</h1>
          <p className="welcome-subtitle">
            Monitor ocean safety and manage alerts
          </p>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Notifications */}
          {/* <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span> */}
          {/* </button> */}

          {/* User Profile Dropdown */}
          <div className="user-profile-container">
            <button className="user-profile-btn" onClick={toggleDropdown}>
              <div className="user-avatar">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format&q=60"
                  alt="Admin Avatar"
                  className="avatar-image"
                />
              </div>
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-role">Administrator</span>
              </div>
              <ChevronDown
                size={16}
                className={`dropdown-arrow ${
                  isDropdownOpen ? "dropdown-arrow-open" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div className="dropdown-overlay" onClick={closeDropdown}></div>
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format&q=60"
                        alt="Admin Avatar"
                      />
                    </div>
                    <div className="dropdown-user-info">
                      <span className="dropdown-name">Administrator</span>
                      <span className="dropdown-email">
                        admin@wavewatch.com
                      </span>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-items">
                    <a href="#" className="dropdown-item">
                      <User size={16} />
                      <span>Profile Settings</span>
                    </a>
                    <a href="#" className="dropdown-item">
                      <Settings size={16} />
                      <span>System Settings</span>
                    </a>
                    <a href="#" className="dropdown-item">
                      <Bell size={16} />
                      <span>Notification Preferences</span>
                    </a>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-items">
                    <a href="#" className="dropdown-item logout-item">
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
