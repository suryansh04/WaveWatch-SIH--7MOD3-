import React, { useState, useEffect } from "react";
import {
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Users,
  Filter,
  Search,
} from "lucide-react";
import axios from "axios";
import "./ApproveUsers.css";

const ApproveUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected, all
  const [searchTerm, setSearchTerm] = useState("");
  const [processingUser, setProcessingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/auth/users?status=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        err.response?.data?.msg || "Failed to fetch users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to approve ${userName}?`)) {
      return;
    }

    setProcessingUser(userId);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/auth/approve-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`${userName} has been approved successfully!`);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error approving user:", err);
      setError(
        err.response?.data?.msg || "Failed to approve user. Please try again."
      );
    } finally {
      setProcessingUser(null);
    }
  };

  const handleReject = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to reject ${userName}?`)) {
      return;
    }

    setProcessingUser(userId);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/auth/reject-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`${userName} has been rejected.`);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error rejecting user:", err);
      setError(
        err.response?.data?.msg || "Failed to reject user. Please try again."
      );
    } finally {
      setProcessingUser(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="status-badge status-pending">
            <Clock size={14} />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="status-badge status-approved">
            <CheckCircle size={14} />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="status-badge status-rejected">
            <XCircle size={14} />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFilterCounts = () => {
    const pending = users.filter((u) => u.status === "pending").length;
    const approved = users.filter((u) => u.status === "approved").length;
    const rejected = users.filter((u) => u.status === "rejected").length;
    return { pending, approved, rejected, total: users.length };
  };

  const counts = getFilterCounts();

  return (
    <div className="approve-users-wrapper">
      <div className="approve-users-container">
        <div className="approve-users-header">
          <div className="header-content">
            <h1 className="page-title">
              <Users size={28} />
              User Management
            </h1>
            <p className="page-subtitle">
              Approve or reject analyst account requests
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="refresh-btn"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "spinning" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card pending-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{counts.pending}</div>
              <div className="stat-label">Pending Approval</div>
            </div>
          </div>

          <div className="stat-card approved-card">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{counts.approved}</div>
              <div className="stat-label">Approved Users</div>
            </div>
          </div>

          <div className="stat-card rejected-card">
            <div className="stat-icon">
              <XCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{counts.rejected}</div>
              <div className="stat-label">Rejected Users</div>
            </div>
          </div>

          <div className="stat-card total-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{counts.total}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="controls-section">
          <div className="filter-section">
            <Filter size={16} />
            <span className="filter-label">Filter by status:</span>
            <div className="filter-buttons">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  className={`filter-btn ${filter === status ? "active" : ""}`}
                  onClick={() => setFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== "all" && (
                    <span className="filter-count">
                      {status === "pending" && counts.pending}
                      {status === "approved" && counts.approved}
                      {status === "rejected" && counts.rejected}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="search-section">
            <div className="search-input-container">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="message error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="message success-message">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {/* Users List */}
        <div className="users-section">
          {loading ? (
            <div className="loading-state">
              <RefreshCw size={32} className="spinning" />
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <h3>No users found</h3>
              <p>
                {searchTerm
                  ? `No users match "${searchTerm}"`
                  : `No ${filter === "all" ? "" : filter} users at the moment`}
              </p>
            </div>
          ) : (
            <div className="users-grid">
              {filteredUsers.map((user) => (
                <div key={user._id} className="user-card">
                  <div className="user-card-header">
                    <div className="user-info">
                      <h3 className="user-name">{user.name}</h3>
                      <div className="user-email">
                        <Mail size={14} />
                        {user.email}
                      </div>
                    </div>
                    {getStatusBadge(user.status)}
                  </div>

                  <div className="user-card-body">
                    <div className="user-detail">
                      <Calendar size={14} />
                      <span>
                        Registered: {formatDate(user.createdAt || new Date())}
                      </span>
                    </div>
                    <div className="user-detail">
                      <span className="role-badge">Analyst</span>
                    </div>
                  </div>

                  {user.status === "pending" && (
                    <div className="user-card-actions">
                      <button
                        onClick={() => handleApprove(user._id, user.name)}
                        disabled={processingUser === user._id}
                        className="action-btn approve-btn"
                      >
                        <UserCheck size={16} />
                        {processingUser === user._id
                          ? "Processing..."
                          : "Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(user._id, user.name)}
                        disabled={processingUser === user._id}
                        className="action-btn reject-btn"
                      >
                        <UserX size={16} />
                        {processingUser === user._id
                          ? "Processing..."
                          : "Reject"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveUsers;
