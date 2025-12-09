import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createPost, deletePost } from "../api/postApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../components/Pagination";
import Alert from "../components/Alert";
import "../styles/home.css";
import { useLocation, useNavigate } from "react-router-dom";

import DotGrid from "../component/DotGrid";
// import ElectricBorder from "../component/ElectricBorder";
import TextType from '../component/TextType';
import { useAlert } from "../context/AlertContext";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  // const [alert, setAlert] = useState(null);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image_url: "",
    tags: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const params = new URLSearchParams(location.search);
  const currentPage = parseInt(params.get("page")) || 1;
  const search = params.get("search");
  const tag = params.get("tag");
  const category = params.get("category");
  useEffect(() => {
    async function fetchPosts() {
      try {
        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("limit", 10);
        if (search) params.append("search", search);
        if (tag) params.append("tag", tag);
        if (category) params.append("category", category);

        const url = `${
          import.meta.env.VITE_API_URL
        }/api/post?${params.toString()}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.data && data.data.posts) {
          setPosts(data.data.posts);
          setPagination(data.data.pagination);
        } else {
          setPosts(data.data);
        }
      } catch (err) {
        console.error(err);
        setPosts([]);
      }
    }

    fetchPosts();
  }, [location.search, currentPage, search, tag, category]);

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      showAlert("success", "Post deleted");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/post?page=${currentPage}&limit=10`
      );
      const data = await res.json();
      if (data.data && data.data.posts) {
        setPosts(data.data.posts);
        setPagination(data.data.pagination);
      } else {
        setPosts(data.data);
      }
    } catch (err) {
      showAlert("error", err.message || "Failed to delete post");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showAlert("error", "Please login to create a post");
      return;
    }

    setIsCreating(true);
    try {
      const tagsArray = formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [];

      const postData = {
        title: formData.title,
        description: formData.description,
        ...(formData.category && { category: formData.category }),
        ...(formData.image_url && { image_url: formData.image_url }),
        ...(tagsArray.length > 0 && { tags: tagsArray }),
      };

      await createPost(postData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        image_url: "",
        tags: "",
      });

      setIsExpanded(false);
      showAlert("success", "Post created successfully!");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/post?page=${currentPage}&limit=10`
      );
      const data = await res.json();

      if (data.data && data.data.posts) {
        setPosts(data.data.posts);
        setPagination(data.data.pagination);
      } else {
        setPosts(data.data);
      }
    } catch (err) {
      showAlert("error", err.message || "Failed to create post");
    } finally {
      setIsCreating(false);
    }
  };
  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    navigate(`?${params.toString()}`);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        zIndex: 1,
      }}
    >
      <DotGrid
        dotSize={1.5}
        gap={18}
        baseColor="#ff0707ff"
        activeColor="#FFF"
        proximity={80}
        shockRadius={150}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />
      <div
        className="home-container"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            fixed
          />
        )} */}

        <div className="create-post">
          <div
            className="create-post-header"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ cursor: "pointer" }}
          >
            <h2><TextType 
  text={["Create a Post"]}
  typingSpeed={75}
  pauseDuration={1500}
  showCursor={true}
  cursorCharacter="..."
/>
            </h2>
            <FontAwesomeIcon
              icon={isExpanded ? faChevronUp : faChevronDown}
              className="create-post-toggle-icon"
            />
          </div>
          {isExpanded && (
            <>
              {!user ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    padding: "20px",
                  }}
                >
                  Please{" "}
                  <a href="/login" style={{ color: "#dc4d34" }}>
                    login
                  </a>{" "}
                  to create a post
                </p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="title">Title *</label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter post title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="What's on your mind?"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="category">Category</label>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      placeholder="Enter category (optional)"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="image_url">Image URL</label>
                    <input
                      id="image_url"
                      name="image_url"
                      type="url"
                      placeholder="Enter image URL"
                      value={formData.image_url}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="tags">Tags</label>
                    <input
                      id="tags"
                      name="tags"
                      type="text"
                      className="create-post-tags-input"
                      placeholder="funny, meme, viral (comma separated)"
                      value={formData.tags}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Post"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        <div className="posts-container">
          {Array.isArray(posts) && posts.length > 0 ? (
            <>
              {posts.map((post) => (
                
                 

                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handleDeletePost}
                  />
              ))}
              {pagination && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination?.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>
              No posts yet. Be the first to create one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
