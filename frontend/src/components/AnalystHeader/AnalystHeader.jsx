import React, { useState, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AnalystHeader.css";

const AnalystHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Analyst");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setUserName(user.name);
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="analyst-header">
      <div className="analyst-header-content">
        {/* Welcome Section */}
        <div className="analyst-header-welcome">
          <h1 className="analyst-header-welcome-text">
            Welcome {userName}, 👋
          </h1>
          <p className="analyst-header-welcome-subtitle">
            Analyze ocean data and monitor reports
          </p>
        </div>

        {/* Header Actions */}
        <div className="analyst-header-actions">
          {/* User Profile Dropdown */}
          <div className="analyst-header-user-profile-container">
            <button
              className="analyst-header-user-profile-btn"
              onClick={toggleDropdown}
            >
              <div className="analyst-header-user-avatar">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format&q=60"
                  alt="Analyst Avatar"
                  className="analyst-header-avatar-image"
                />
              </div>
              <div className="analyst-header-user-info">
                <span className="analyst-header-user-name">{userName}</span>
                <span className="analyst-header-user-role">Analyst</span>
              </div>
              <ChevronDown
                size={16}
                className={`analyst-header-dropdown-arrow ${
                  isDropdownOpen ? "analyst-header-dropdown-arrow-open" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div
                  className="analyst-header-dropdown-overlay"
                  onClick={closeDropdown}
                ></div>
                <div className="analyst-header-dropdown-menu">
                  <div className="analyst-header-dropdown-header">
                    <div className="analyst-header-dropdown-avatar">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format&q=60"
                        alt="Analyst Avatar"
                      />
                    </div>
                    <div className="analyst-header-dropdown-user-info">
                      <span className="analyst-header-dropdown-name">
                        {userName}
                      </span>
                      <span className="analyst-header-dropdown-role">
                        Analyst
                      </span>
                    </div>
                  </div>

                  <div className="analyst-header-dropdown-divider"></div>

                  <div className="analyst-header-dropdown-items">
                    <button
                      onClick={handleLogout}
                      className="analyst-header-dropdown-item analyst-header-logout-item"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
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

export default AnalystHeader;
