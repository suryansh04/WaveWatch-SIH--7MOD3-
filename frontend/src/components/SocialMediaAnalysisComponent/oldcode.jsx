"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./SocialMediaAnalysis.css";
// Fix default marker icon issue
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const SocialMediaAnalysis = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const postsPerPage = 6;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/social-media/posts",
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
          params: {
            _t: new Date().getTime(),
          },
        }
      );

      const postsData = response.data.posts || response.data;
      setPosts(Array.isArray(postsData) ? postsData : []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch posts. Please try again later.");
      console.error("Error fetching posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFloodLabelText = (label) => {
    return label === 1 ? "Flood Related" : "Not Flood Related";
  };

  const getFloodLabelClass = (label) => {
    return label === 1
      ? "social-media-analysis-tag-flood"
      : "social-media-analysis-tag-normal";
  };

  const filteredPosts = Array.isArray(posts)
    ? posts.filter((post) => {
        if (!post) return false;

        const matchesSearch =
          (post.text &&
            post.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (post.subreddit &&
            post.subreddit.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filter === "all") return matchesSearch;
        if (filter === "flood") return matchesSearch && post.flood_label === 1;
        if (filter === "non-flood")
          return matchesSearch && post.flood_label === 0;

        return matchesSearch;
      })
    : [];

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRefresh = () => {
    fetchPosts();
    setCurrentPage(1);
  };

  const getTotalPosts = () => (Array.isArray(posts) ? posts.length : 0);
  const getFloodPosts = () =>
    Array.isArray(posts)
      ? posts.filter((p) => p && p.flood_label === 1).length
      : 0;
  const getNonFloodPosts = () =>
    Array.isArray(posts)
      ? posts.filter((p) => p && p.flood_label === 0).length
      : 0;
  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };
  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

        /* Main Container */
        .social-media-analysis-container {
          margin-left: 280px;
          padding: 30px 40px;
          background-color: #f8fafc;
          min-height: 100vh;
          width: calc(100% - 280px);
          font-family: "Inter", sans-serif;
          color: #1e293b;
          box-sizing: border-box;
        }

        /* Header */
        .social-media-analysis-header {
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .social-media-analysis-header h1 {
          color: #0f172a;
          font-size: 1.8rem;
          margin: 0 0 5px 0;
          font-weight: 700;
        }

        .social-media-analysis-header p {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0;
        }

        /* Controls Section (White Card) */
        .social-media-analysis-controls {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .social-media-analysis-filter-group {
            display: flex;
            align-items: center;
            gap: 20px;
            flex: 1;
            flex-wrap: wrap;
        }

        /* Search Box */
        .social-media-analysis-search-wrapper {
            position: relative;
            width: 300px;
        }

        .social-media-analysis-search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
        }

        .social-media-analysis-search-input {
            width: 100%;
            padding: 10px 14px 10px 40px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 0.9rem;
            color: #334155;
            outline: none;
            transition: all 0.2s;
            font-family: 'Inter', sans-serif;
        }

        .social-media-analysis-search-input:focus {
            border-color: #0077b6;
            box-shadow: 0 0 0 2px rgba(0, 119, 182, 0.1);
        }

        /* Filter Tabs */
        .social-media-analysis-tabs {
            display: flex;
            gap: 8px;
        }

        .social-media-analysis-tab {
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            border: 1px solid transparent;
            background: transparent;
            color: #64748b;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .social-media-analysis-tab:hover {
            background: #f1f5f9;
            color: #334155;
        }

        .social-media-analysis-tab.active {
            background: #e0f2fe;
            color: #0077b6;
            border-color: #bae6fd;
        }

        .count-badge {
            background: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.75rem;
            opacity: 0.8;
        }

        /* Refresh Button */
        .social-media-analysis-refresh-btn {
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            border: 1px solid #cbd5e1;
            background: white;
            color: #475569;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
        }

        .social-media-analysis-refresh-btn:hover {
            background: #f1f5f9;
            color: #1e293b;
            border-color: #94a3b8;
        }

        .spinning {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Posts Grid */
        .social-media-analysis-posts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 24px;
            margin-bottom: 30px;
        }

        /* Post Card */
        .social-media-analysis-post-card {
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            transition: box-shadow 0.3s ease;
            overflow: hidden;
        }

        .social-media-analysis-post-card:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
        }

        .social-media-analysis-card-header {
            padding: 20px 20px 12px 20px;
            border-bottom: 1px solid #f1f5f9;
        }

        .social-media-analysis-meta-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .social-media-analysis-subreddit {
            font-size: 0.85rem;
            font-weight: 600;
            color: #0077b6;
            background: #e0f2fe;
            padding: 4px 8px;
            border-radius: 6px;
        }

        .social-media-analysis-tag {
            font-size: 0.75rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 6px;
            text-transform: uppercase;
        }

        .social-media-analysis-tag-flood {
            background: #fef2f2;
            color: #ef4444;
            border: 1px solid #fecaca;
        }

        .social-media-analysis-tag-normal {
            background: #f0fdf4;
            color: #16a34a;
            border: 1px solid #bbf7d0;
        }

        .social-media-analysis-date {
            font-size: 0.8rem;
            color: #94a3b8;
            display: flex;
            align-items: center;
        }

        .social-media-analysis-card-content {
            padding: 20px;
            flex-grow: 1;
        }

        .social-media-analysis-text {
            color: #334155;
            font-size: 0.95rem;
            line-height: 1.6;
            margin: 0;
        }

        .social-media-analysis-card-footer {
            padding: 12px 20px;
            background: #f8fafc;
            border-top: 1px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .social-media-analysis-location {
            font-size: 0.8rem;
            color: #64748b;
            display: flex;
            align-items: center;
            background: white;
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }

        .social-media-analysis-link {
            font-size: 0.8rem;
            color: #0077b6;
            text-decoration: none;
            font-weight: 600;
            display: flex;
            align-items: center;
            transition: color 0.2s;
        }

        .social-media-analysis-link:hover {
            color: #005f8a;
            text-decoration: underline;
        }

        /* Pagination */
        .social-media-analysis-pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin-bottom: 24px;
        }

        /* FIXED: Added missing class to align numbers horizontally */
        .social-media-analysis-page-numbers {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .social-media-analysis-page-btn {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            background: white;
            color: #64748b;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .social-media-analysis-page-btn:hover:not(:disabled) {
            background: #f1f5f9;
            color: #1e293b;
            border-color: #94a3b8;
        }

        .social-media-analysis-page-btn.active {
            background: #0077b6;
            color: white;
            border-color: #0077b6;
        }

        .social-media-analysis-page-btn.nav {
            width: auto;
            padding: 0 16px;
            gap: 8px;
        }

        .social-media-analysis-page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: #f8fafc;
        }

        .social-media-analysis-footer-info {
            text-align: center;
            color: #94a3b8;
            font-size: 0.9rem;
        }

        /* Empty State */
        .social-media-analysis-empty-state {
            grid-column: 1 / -1;
            background: white;
            border-radius: 12px;
            padding: 60px 40px;
            text-align: center;
            border: 2px dashed #cbd5e1;
            color: #64748b;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .social-media-analysis-empty-state h3 {
            margin: 0 0 8px 0;
            color: #334155;
        }

        .social-media-analysis-empty-state p {
            margin: 0;
            font-size: 1rem;
        }

        /* Loading */
        .social-media-analysis-loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
            color: #64748b;
        }

        .social-media-analysis-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e2e8f0;
            border-top: 3px solid #0077b6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
        }

        /* Error */
        .social-media-analysis-error-message {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }

        .social-media-analysis-retry-btn {
            background: #dc2626;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.85rem;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .social-media-analysis-container {
            margin-left: 260px;
            width: calc(100% - 260px);
          }
        }

        @media (max-width: 1024px) {
          .social-media-analysis-container {
            margin-left: 0;
            width: 100%;
            padding: 20px;
          }
        }

        @media (max-width: 768px) {
          .social-media-analysis-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .social-media-analysis-filter-group {
            flex-direction: column;
            align-items: stretch;
          }

          .social-media-analysis-search-wrapper {
            width: 100%;
          }

          .social-media-analysis-tabs {
            overflow-x: auto;
            padding-bottom: 4px;
          }

          .social-media-analysis-refresh-btn {
            justify-content: center;
          }

          .social-media-analysis-posts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="social-media-analysis-container">
        <div className="social-media-analysis-header">
          <div className="social-media-analysis-header-content">
            <h1>Social Media Analysis</h1>
            <p>
              Real-time sentiment and flood report analysis from social
              platforms
            </p>
          </div>
        </div>

        {error && (
          <div className="social-media-analysis-error-message">
            <AlertTriangle size={20} />
            <span>{error}</span>
            <button
              onClick={handleRefresh}
              className="social-media-analysis-retry-btn"
            >
              Retry
            </button>
          </div>
        )}

        {/* Controls Card */}
        <div className="social-media-analysis-controls">
          <div className="social-media-analysis-filter-group">
            <div className="social-media-analysis-search-wrapper">
              <Search className="social-media-analysis-search-icon" size={18} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="social-media-analysis-search-input"
              />
            </div>

            <div className="social-media-analysis-tabs">
              <button
                onClick={() => {
                  setFilter("all");
                  setCurrentPage(1);
                }}
                className={`social-media-analysis-tab ${
                  filter === "all" ? "active" : ""
                }`}
              >
                All Posts <span className="count-badge">{getTotalPosts()}</span>
              </button>
              <button
                onClick={() => {
                  setFilter("flood");
                  setCurrentPage(1);
                }}
                className={`social-media-analysis-tab ${
                  filter === "flood" ? "active" : ""
                }`}
              >
                Flood Related{" "}
                <span className="count-badge">{getFloodPosts()}</span>
              </button>
              <button
                onClick={() => {
                  setFilter("non-flood");
                  setCurrentPage(1);
                }}
                className={`social-media-analysis-tab ${
                  filter === "non-flood" ? "active" : ""
                }`}
              >
                Non-Flood{" "}
                <span className="count-badge">{getNonFloodPosts()}</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="social-media-analysis-refresh-btn"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "spinning" : ""} />
            Refresh
          </button>
        </div>

        {/* Loading and Empty State for initial load handled above, this handles filtered empty state */}
        {loading && (
          <div
            className="social-media-analysis-loading-state"
            style={{ height: "300px" }}
          >
            <div className="social-media-analysis-spinner"></div>
            <p>Updating...</p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && (
          <div className="social-media-analysis-posts-grid">
            {currentPosts.length === 0 ? (
              <div className="social-media-analysis-empty-state">
                <MessageSquare
                  size={48}
                  style={{ opacity: 0.2, marginBottom: 16 }}
                />
                <h3>No posts found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              currentPosts.map((post) => (
                <div
                  key={post._id || Math.random()}
                  className="social-media-analysis-post-card"
                >
                  <div className="social-media-analysis-card-header">
                    <div className="social-media-analysis-meta-top">
                      <span className="social-media-analysis-subreddit">
                        r/{post.subreddit || "unknown"}
                      </span>
                      <div
                        className={`social-media-analysis-tag ${getFloodLabelClass(
                          post.flood_label
                        )}`}
                      >
                        {getFloodLabelText(post.flood_label)}
                      </div>
                    </div>
                    <div className="social-media-analysis-date">
                      <Calendar size={14} style={{ marginRight: 6 }} />
                      {formatDate(post.date)}
                    </div>
                  </div>
                  <div className="social-media-analysis-card-content">
                    <p className="social-media-analysis-text">
                      {post.text && post.text.length > 200
                        ? `${post.text.substring(0, 200)}...`
                        : post.text || "No content available"}
                    </p>
                  </div>

                  <div className="social-media-analysis-card-footer">
                    <div className="social-media-analysis-location">
                      <MapPin size={14} style={{ marginRight: 6 }} />
                      <span>
                        {post.lat ? post.lat.toFixed(4) : "0.00"},{" "}
                        {post.lon ? post.lon.toFixed(4) : "0.00"}
                      </span>
                    </div>
                    <button
                      onClick={() => openModal(post)}
                      className="social-media-analysis-link social-media-analysis-view-detail-btn"
                    >
                      View Details{" "}
                      <ExternalLink size={14} style={{ marginLeft: 4 }} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredPosts.length > postsPerPage && (
          <div className="social-media-analysis-pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="social-media-analysis-page-btn nav"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="social-media-analysis-page-numbers">
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`social-media-analysis-page-btn ${
                      currentPage === pageNumber ? "active" : ""
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="social-media-analysis-page-btn nav"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {!loading && currentPosts.length > 0 && (
          <div className="social-media-analysis-footer-info">
            Showing page {currentPage} of {totalPages} ({filteredPosts.length}{" "}
            total posts)
          </div>
        )}
        {/* Modal */}
        {selectedPost && (
          <div
            className="social-media-analysis-modal-overlay"
            onClick={closeModal}
          >
            <div
              className="social-media-analysis-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="social-media-analysis-modal-close"
                onClick={closeModal}
              >
                ×
              </button>

              <div className="social-media-analysis-modal-header">
                <h2>Post Details</h2>
                <div className="social-media-analysis-modal-meta">
                  <span className="social-media-analysis-subreddit">
                    r/{selectedPost.subreddit || "unknown"}
                  </span>
                  <div
                    className={`social-media-analysis-tag ${getFloodLabelClass(
                      selectedPost.flood_label
                    )}`}
                  >
                    {getFloodLabelText(selectedPost.flood_label)}
                  </div>
                </div>
                <div className="social-media-analysis-date">
                  <Calendar size={14} style={{ marginRight: 6 }} />
                  {formatDate(selectedPost.date)}
                </div>
              </div>

              <div className="social-media-analysis-modal-body">
                <div className="social-media-analysis-modal-text-section">
                  <h3>Content</h3>
                  <p className="social-media-analysis-modal-text">
                    {selectedPost.text || "No content available"}
                  </p>
                </div>
                {/* Add this after the modal-text-section div and before modal-map-section */}
                <div className="social-media-analysis-modal-engagement-section">
                  <h3>Engagement Metrics</h3>
                  <div className="social-media-analysis-engagement-grid">
                    <div className="social-media-analysis-engagement-card">
                      <div className="social-media-analysis-engagement-icon">
                        👍
                      </div>
                      <div className="social-media-analysis-engagement-data">
                        <span className="social-media-analysis-engagement-label">
                          Upvotes
                        </span>
                        <span className="social-media-analysis-engagement-value">
                          {selectedPost.reddit_score || 0}
                        </span>
                      </div>
                    </div>

                    <div className="social-media-analysis-engagement-card">
                      <div className="social-media-analysis-engagement-icon">
                        💬
                      </div>
                      <div className="social-media-analysis-engagement-data">
                        <span className="social-media-analysis-engagement-label">
                          Comments
                        </span>
                        <span className="social-media-analysis-engagement-value">
                          {selectedPost.reddit_num_comments || 0}
                        </span>
                      </div>
                    </div>

                    <div className="social-media-analysis-engagement-card">
                      <div className="social-media-analysis-engagement-icon">
                        👁️
                      </div>
                      <div className="social-media-analysis-engagement-data">
                        <span className="social-media-analysis-engagement-label">
                          Views
                        </span>
                        <span className="social-media-analysis-engagement-value">
                          {selectedPost.n_yt_views || 0}
                        </span>
                      </div>
                    </div>

                    <div className="social-media-analysis-engagement-card">
                      <div className="social-media-analysis-engagement-icon">
                        ❤️
                      </div>
                      <div className="social-media-analysis-engagement-data">
                        <span className="social-media-analysis-engagement-label">
                          Likes
                        </span>
                        <span className="social-media-analysis-engagement-value">
                          {selectedPost.n_yt_likes || 0}
                        </span>
                      </div>
                    </div>

                    <div className="social-media-analysis-engagement-card">
                      <div className="social-media-analysis-engagement-icon">
                        📊
                      </div>
                      <div className="social-media-analysis-engagement-data">
                        <span className="social-media-analysis-engagement-label">
                          Engagement Score
                        </span>
                        <span className="social-media-analysis-engagement-value">
                          {selectedPost.engagement_score || 0}
                        </span>
                      </div>
                    </div>

                    <div className="social-media-analysis-engagement-card">
                      <div className="social-media-analysis-engagement-icon">
                        📈
                      </div>
                      <div className="social-media-analysis-engagement-data">
                        <span className="social-media-analysis-engagement-label">
                          Upvote Ratio
                        </span>
                        <span className="social-media-analysis-engagement-value">
                          {selectedPost.reddit_upvote_ratio
                            ? `${(
                                selectedPost.reddit_upvote_ratio * 100
                              ).toFixed(0)}%`
                            : "0%"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="social-media-analysis-modal-map-section">
                  <h3>Location</h3>
                  <div className="social-media-analysis-modal-map">
                    <MapContainer
                      center={[selectedPost.lat || 0, selectedPost.lon || 0]}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={[
                          selectedPost.lat || 0,
                          selectedPost.lon || 0,
                        ]}
                        icon={icon}
                      >
                        <Popup>
                          <strong>Post Location</strong>
                          <br />
                          Lat: {selectedPost.lat?.toFixed(4)}
                          <br />
                          Lon: {selectedPost.lon?.toFixed(4)}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <div className="social-media-analysis-modal-coordinates">
                    <MapPin size={16} />
                    <span>
                      {selectedPost.lat?.toFixed(6)},{" "}
                      {selectedPost.lon?.toFixed(6)}
                    </span>
                  </div>
                </div>

                {selectedPost.url && (
                  <div className="social-media-analysis-modal-source">
                    <a
                      href={selectedPost.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-media-analysis-modal-source-link"
                    >
                      <ExternalLink size={16} />
                      View Original Source
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SocialMediaAnalysis;
