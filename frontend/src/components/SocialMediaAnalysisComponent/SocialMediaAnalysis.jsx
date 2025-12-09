"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Calendar,
  ArrowUp,
  MessageCircle,
  TrendingUp,
  Activity,
  Facebook,
  Twitter,
  Hash,
  ThumbsUp,
  Eye,
  Heart,
  Tag,
  Zap,
  Award,
  BarChart3,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./SocialMediaAnalysis.css";

// Cache for geocoding results to avoid repeated API calls
const geocodingCache = {};

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
  const [viewMode, setViewMode] = useState("individual"); // 'individual' or 'grouped'
  const [expandedGroups, setExpandedGroups] = useState(new Set());
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
    if (!dateString) return "Invalid Date";

    // Try postTimestamp first, then fall back to date
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // Reverse geocoding function to get city from coordinates
  const getCityFromCoordinates = async (lat, lon) => {
    const cacheKey = `${lat.toFixed(3)},${lon.toFixed(3)}`; // Round to 3 decimals for nearby points

    if (geocodingCache[cacheKey]) {
      return geocodingCache[cacheKey];
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/social-media/reverse-geocode?lat=${lat}&lon=${lon}`
      );

      if (response.data.results && response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;

        // Try to find city (locality) or district (sublocality)
        let city = addressComponents.find((comp) =>
          comp.types.includes("locality")
        )?.long_name;

        if (!city) {
          city = addressComponents.find((comp) =>
            comp.types.includes("administrative_area_level_2")
          )?.long_name;
        }

        if (!city) {
          city = addressComponents.find((comp) =>
            comp.types.includes("sublocality")
          )?.long_name;
        }

        const finalCity = city || "Unknown Location";
        geocodingCache[cacheKey] = finalCity;
        return finalCity;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }

    return "Unknown Location";
  };

  const filteredPosts = useMemo(() => {
    return Array.isArray(posts)
      ? posts.filter((post) => {
          if (!post) return false;

          const matchesSearch =
            (post.text &&
              post.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (post.subreddit &&
              post.subreddit.toLowerCase().includes(searchTerm.toLowerCase()));

          if (filter === "all") return matchesSearch;
          if (filter === "flood")
            return matchesSearch && post.flood_label === 1;
          if (filter === "non-flood")
            return matchesSearch && post.flood_label === 0;

          return matchesSearch;
        })
      : [];
  }, [posts, searchTerm, filter]);

  const groupPostsByEventAndLocation = async (postsArray) => {
    const groups = {};

    // First, get cities for all posts with coordinates
    const postsWithCities = await Promise.all(
      postsArray.map(async (post) => {
        if (!post.eventType || !post.latitude || !post.longitude) {
          return { ...post, city: null };
        }

        const city = await getCityFromCoordinates(
          post.latitude,
          post.longitude
        );
        return { ...post, city };
      })
    );

    // Then group by eventType and city
    postsWithCities.forEach((post) => {
      if (!post.eventType || !post.city) return;

      const key = `${post.eventType}_${post.city}`;

      if (!groups[key]) {
        groups[key] = {
          eventType: post.eventType,
          location: post.city, // This is now the city name
          posts: [],
          totalEngagement: 0,
          latestDate: post.postTimestamp || post.date,
          avgLatitude: 0,
          avgLongitude: 0,
        };
      }

      groups[key].posts.push(post);
      groups[key].totalEngagement += post.engagement_score || 0;

      const postDate = new Date(post.postTimestamp || post.date);
      const groupDate = new Date(groups[key].latestDate);
      if (postDate > groupDate) {
        groups[key].latestDate = post.postTimestamp || post.date;
      }
    });

    // Calculate average coordinates for each group
    Object.values(groups).forEach((group) => {
      const validPosts = group.posts.filter((p) => p.latitude && p.longitude);
      if (validPosts.length > 0) {
        group.avgLatitude =
          validPosts.reduce((sum, p) => sum + p.latitude, 0) /
          validPosts.length;
        group.avgLongitude =
          validPosts.reduce((sum, p) => sum + p.longitude, 0) /
          validPosts.length;
      }
    });

    return Object.values(groups).sort(
      (a, b) => b.posts.length - a.posts.length
    );
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const [groupedPosts, setGroupedPosts] = useState([]);

  // Add this useEffect after the filteredPosts definition
  useEffect(() => {
    const loadGroupedPosts = async () => {
      if (filteredPosts.length > 0) {
        const grouped = await groupPostsByEventAndLocation(filteredPosts);
        setGroupedPosts(grouped);
      } else {
        setGroupedPosts([]);
      }
    };

    if (viewMode === "grouped") {
      loadGroupedPosts();
    }
  }, [filteredPosts, viewMode]);
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

  const getPlatformInfo = (post) => {
    if (post.platform === "Facebook") {
      return {
        name: "Facebook",
        icon: <Facebook size={16} />,
        color: "#1877f2",
      };
    } else if (post.platform === "X") {
      return {
        name: "X (Twitter)",
        icon: <Twitter size={16} />,
        color: "#000000",
      };
    } else {
      return { name: "Reddit", icon: <Hash size={16} />, color: "#ff4500" };
    }
  };

  const getEngagementMetrics = (post) => {
    const platform = post.platform;

    if (platform === "Facebook") {
      return [
        {
          icon: <ThumbsUp size={20} />,
          label: "Likes",
          value: post.n_yt_likes || 0,
        },
        {
          icon: <MessageCircle size={20} />,
          label: "Comments",
          value: post.n_yt_comments || 0,
        },
        {
          icon: <Eye size={20} />,
          label: "Views",
          value: post.n_yt_views || 0,
        },
        {
          icon: <Activity size={20} />,
          label: "Engagement",
          value: post.engagement_score?.toFixed(2) || 0,
        },
      ];
    } else if (platform === "X") {
      return [
        {
          icon: <Heart size={20} />,
          label: "Likes",
          value: post.yt_like_count || 0,
        },
        {
          icon: <MessageCircle size={20} />,
          label: "Comments",
          value: post.yt_comment_count || 0,
        },
        {
          icon: <Eye size={20} />,
          label: "Views",
          value: post.yt_view_count || 0,
        },
        {
          icon: <Activity size={20} />,
          label: "Engagement",
          value: post.engagement_score?.toFixed(2) || 0,
        },
      ];
    } else {
      // Reddit
      return [
        {
          icon: <ArrowUp size={20} />,
          label: "Likes",
          value: post.reddit_score || 0,
        },
        {
          icon: <MessageCircle size={20} />,
          label: "Comments",
          value: post.reddit_num_comments || 0,
        },
        {
          icon: <TrendingUp size={20} />,
          label: "Upvote Ratio",
          value: post.reddit_upvote_ratio
            ? `${(post.reddit_upvote_ratio * 100).toFixed(0)}%`
            : "0%",
        },
        {
          icon: <Activity size={20} />,
          label: "Engagement ratio",
          value: post.engagementScore?.toFixed(2) || 0,
        },
      ];
    }
  };

  const getRedditDetailedMetrics = (post) => {
    return [
      {
        icon: <ArrowUp size={20} />,
        label: "Reddit Score",
        value: post.reddit_score || 0,
      },
      {
        icon: <MessageCircle size={20} />,
        label: "Comments",
        value: post.reddit_num_comments || 0,
      },
      {
        icon: <TrendingUp size={20} />,
        label: "Upvote Ratio",
        value: post.reddit_upvote_ratio
          ? `${(post.reddit_upvote_ratio * 100).toFixed(1)}%`
          : "0%",
      },
      {
        icon: <Activity size={20} />,
        label: "Engagement Score",
        value: post.reddit_engagement_score?.toFixed(2) || 0,
      },
      {
        icon: <Award size={20} />,
        label: "Top Comment",
        value: post.reddit_top_comment ? "Available" : "None",
      },
      {
        icon: <BarChart3 size={20} />,
        label: "Total Engagement",
        value: post.engagement_score?.toFixed(2) || 0,
      },
    ];
  };

  const toggleGroup = (groupKey) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <div className="social-media-analysis-container">
      <div className="social-media-analysis-header">
        <div className="social-media-analysis-header-content">
          <h1>Social Media Analysis</h1>
          <p>
            Real-time sentiment and flood report analysis from social platforms
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

          {/* <div className="social-media-analysis-tabs">
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
          </div> */}
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div className="social-media-analysis-view-toggle">
            <button
              onClick={() => setViewMode("individual")}
              className={`social-media-analysis-view-toggle-btn ${
                viewMode === "individual" ? "active" : ""
              }`}
            >
              <MessageSquare size={16} />
              Individual
            </button>
            <button
              onClick={() => setViewMode("grouped")}
              className={`social-media-analysis-view-toggle-btn ${
                viewMode === "grouped" ? "active" : ""
              }`}
            >
              <BarChart3 size={16} />
              Grouped
            </button>
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
      </div>
      {loading && (
        <div
          className="social-media-analysis-loading-state"
          style={{ height: "300px" }}
        >
          <div className="social-media-analysis-spinner"></div>
          <p>Updating...</p>
        </div>
      )}

      {!loading && viewMode === "individual" && (
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
                    <span
                      className="social-media-analysis-subreddit"
                      style={{
                        backgroundColor: getPlatformInfo(post).color + "20",
                        color: getPlatformInfo(post).color,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {getPlatformInfo(post).icon}
                      {post.platform || "Unknown"}
                    </span>
                    {post.eventType && (
                      <span className="social-media-analysis-event-type">
                        <Zap size={12} />
                        {post.eventType}
                      </span>
                    )}
                  </div>
                  <div className="social-media-analysis-date">
                    <Calendar size={14} style={{ marginRight: 6 }} />
                    {formatDate(post.postTimestamp || post.date)}
                  </div>
                </div>
                <div className="social-media-analysis-card-content">
                  <p className="social-media-analysis-text">
                    {post.text && post.text.length > 200
                      ? `${post.text.substring(0, 200)}...`
                      : post.text || "No content available"}
                  </p>

                  {post.eventType && (
                    <div style={{ marginTop: "12px" }}>
                      <span className="social-media-analysis-event-type">
                        <Zap size={12} />
                        {post.eventType}
                      </span>
                    </div>
                  )}

                  {post.keywords_list && post.keywords_list.length > 0 && (
                    <div className="social-media-analysis-keywords">
                      {post.keywords_list.slice(0, 3).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="social-media-analysis-keyword-tag"
                        >
                          {keyword}
                        </span>
                      ))}
                      {post.keywords_list.length > 3 && (
                        <span className="social-media-analysis-keyword-tag">
                          +{post.keywords_list.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="social-media-analysis-card-footer">
                  <div className="social-media-analysis-location">
                    <MapPin size={14} style={{ marginRight: 6 }} />
                    <span>
                      {post.latitude ? post.latitude.toFixed(4) : "0.00"},{" "}
                      {post.longitude ? post.longitude.toFixed(4) : "0.00"}
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

      {!loading && viewMode === "grouped" && (
        <div className="social-media-analysis-groups-container">
          {groupedPosts.length === 0 && filteredPosts.length > 0 ? (
            <div className="social-media-analysis-groups-loading">
              <div className="social-media-analysis-groups-loading-spinner"></div>
              <p>Loading groups...</p>
            </div>
          ) : groupedPosts.length === 0 ? (
            <div className="social-media-analysis-no-groups">
              <MessageSquare
                size={48}
                style={{ opacity: 0.2, marginBottom: 16 }}
              />
              <h3>No grouped posts found</h3>
              <p>Posts need eventType and valid coordinates to be grouped</p>
            </div>
          ) : (
            groupedPosts.map((group, index) => {
              const groupKey = `${group.eventType}_${group.location}`;
              const isExpanded = expandedGroups.has(groupKey);

              return (
                <div
                  key={groupKey}
                  className="social-media-analysis-group-card"
                >
                  <div
                    className="social-media-analysis-group-header"
                    onClick={() => toggleGroup(groupKey)}
                  >
                    <div className="social-media-analysis-group-info">
                      <div className="social-media-analysis-group-icon">
                        <Zap size={24} />
                      </div>
                      <div className="social-media-analysis-group-details">
                        <h3 className="social-media-analysis-group-title">
                          {group.eventType}
                          <span style={{ opacity: 0.7, fontWeight: 500 }}>
                            {" "}
                            • {group.location}
                          </span>
                        </h3>
                        <div className="social-media-analysis-group-meta">
                          <span>
                            <Calendar size={14} style={{ marginRight: 4 }} />
                            Last updated: {formatDate(group.latestDate)}
                          </span>
                          {/* <span>
                              <Activity size={14} style={{ marginRight: 4 }} />
                              Avg Engagement:{" "}
                              {(
                                group.totalEngagement / group.posts.length
                              ).toFixed(2)}
                            </span> */}
                        </div>
                      </div>
                    </div>
                    <div className="social-media-analysis-group-count">
                      <MessageSquare size={16} />
                      {group.posts.length} posts
                    </div>
                    <div
                      className={`social-media-analysis-group-expand-icon ${
                        isExpanded ? "expanded" : ""
                      }`}
                    >
                      <ChevronRight size={20} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="social-media-analysis-group-posts">
                      <div className="social-media-analysis-group-posts-grid">
                        {group.posts.map((post) => (
                          <div
                            key={post._id || Math.random()}
                            className="social-media-analysis-post-card"
                          >
                            <div className="social-media-analysis-card-header">
                              <div className="social-media-analysis-meta-top">
                                <span
                                  className="social-media-analysis-subreddit"
                                  style={{
                                    backgroundColor:
                                      getPlatformInfo(post).color + "20",
                                    color: getPlatformInfo(post).color,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                  }}
                                >
                                  {getPlatformInfo(post).icon}
                                  {post.platform || "Unknown"}
                                </span>
                              </div>
                              <div className="social-media-analysis-date">
                                <Calendar
                                  size={14}
                                  style={{ marginRight: 6 }}
                                />
                                {formatDate(post.postTimestamp || post.date)}
                              </div>
                            </div>
                            <div className="social-media-analysis-card-content">
                              <p className="social-media-analysis-text">
                                {post.text && post.text.length > 200
                                  ? `${post.text.substring(0, 200)}...`
                                  : post.text || "No content available"}
                              </p>

                              {post.keywords_list &&
                                post.keywords_list.length > 0 && (
                                  <div className="social-media-analysis-keywords">
                                    {post.keywords_list
                                      .slice(0, 3)
                                      .map((keyword, idx) => (
                                        <span
                                          key={idx}
                                          className="social-media-analysis-keyword-tag"
                                        >
                                          {keyword}
                                        </span>
                                      ))}
                                    {post.keywords_list.length > 3 && (
                                      <span className="social-media-analysis-keyword-tag">
                                        +{post.keywords_list.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                )}
                            </div>
                            <div className="social-media-analysis-card-footer">
                              <div className="social-media-analysis-location">
                                <MapPin size={14} style={{ marginRight: 6 }} />
                                <span>
                                  {post.latitude
                                    ? post.latitude.toFixed(4)
                                    : "0.00"}
                                  ,{" "}
                                  {post.longitude
                                    ? post.longitude.toFixed(4)
                                    : "0.00"}
                                </span>
                              </div>
                              <button
                                onClick={() => openModal(post)}
                                className="social-media-analysis-link social-media-analysis-view-detail-btn"
                              >
                                View Details{" "}
                                <ExternalLink
                                  size={14}
                                  style={{ marginLeft: 4 }}
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
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
                <span
                  className="social-media-analysis-subreddit"
                  style={{
                    backgroundColor: getPlatformInfo(selectedPost).color + "20",
                    color: getPlatformInfo(selectedPost).color,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {getPlatformInfo(selectedPost).icon}
                  {selectedPost.platform || "Unknown"}
                </span>
                {selectedPost.eventType && (
                  <span className="social-media-analysis-event-type">
                    <Zap size={12} />
                    {selectedPost.eventType}
                  </span>
                )}
              </div>
              <div className="social-media-analysis-date">
                <Calendar size={14} style={{ marginRight: 6 }} />
                {formatDate(selectedPost.postTimestamp || selectedPost.date)}
              </div>
            </div>

            <div className="social-media-analysis-modal-body">
              <div className="social-media-analysis-modal-text-section">
                <h3>Content</h3>
                <p className="social-media-analysis-modal-text">
                  {selectedPost.text || "No content available"}
                </p>
              </div>

              {/* Event Type Section */}
              {selectedPost.eventType && (
                <div className="social-media-analysis-modal-event-section">
                  <h3>
                    <Zap size={18} />
                    Event Type
                  </h3>
                  <span className="social-media-analysis-modal-event-type">
                    {selectedPost.eventType}
                  </span>
                </div>
              )}

              {/* Keywords Section */}
              {selectedPost.keywords_list &&
                selectedPost.keywords_list.length > 0 && (
                  <div className="social-media-analysis-modal-keywords-section">
                    <h3>
                      <Tag
                        size={18}
                        style={{ display: "inline", marginRight: "8px" }}
                      />
                      Keywords
                    </h3>
                    <div className="social-media-analysis-modal-keywords-list">
                      {selectedPost.keywords_list.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="social-media-analysis-modal-keyword-tag"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Engagement Metrics - Enhanced for Reddit */}
              <div className="social-media-analysis-modal-engagement-section">
                <h3>
                  Engagement Metrics - {getPlatformInfo(selectedPost).name}
                </h3>
                {selectedPost.platform === "Reddit" ? (
                  <div className="social-media-analysis-reddit-metrics-grid">
                    {getRedditDetailedMetrics(selectedPost).map(
                      (metric, index) => (
                        <div
                          key={index}
                          className="social-media-analysis-reddit-metric-card"
                        >
                          <div className="social-media-analysis-reddit-metric-header">
                            <div className="social-media-analysis-reddit-metric-icon">
                              {metric.icon}
                            </div>
                            <span className="social-media-analysis-reddit-metric-label">
                              {metric.label}
                            </span>
                          </div>
                          <span className="social-media-analysis-reddit-metric-value">
                            {metric.value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="social-media-analysis-engagement-grid">
                    {getEngagementMetrics(selectedPost).map((metric, index) => (
                      <div
                        key={index}
                        className="social-media-analysis-engagement-card"
                      >
                        <div className="social-media-analysis-engagement-icon">
                          {metric.icon}
                        </div>
                        <div className="social-media-analysis-engagement-data">
                          <span className="social-media-analysis-engagement-label">
                            {metric.label}
                          </span>
                          <span className="social-media-analysis-engagement-value">
                            {metric.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="social-media-analysis-modal-map-section">
                <h3>Location</h3>
                <div className="social-media-analysis-modal-map">
                  <MapContainer
                    center={[
                      selectedPost.latitude || 0,
                      selectedPost.longitude || 0,
                    ]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[
                        selectedPost.latitude || 0,
                        selectedPost.longitude || 0,
                      ]}
                      icon={icon}
                    >
                      <Popup>
                        <strong>Post Location</strong>
                        <br />
                        Lat: {selectedPost.latitude?.toFixed(4)}
                        <br />
                        Lon: {selectedPost.longitude?.toFixed(4)}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
                <div className="social-media-analysis-modal-coordinates">
                  <MapPin size={16} />
                  <span>
                    {selectedPost.latitude?.toFixed(6)},{" "}
                    {selectedPost.longitude?.toFixed(6)}
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
  );
};

export default SocialMediaAnalysis;
