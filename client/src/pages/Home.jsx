import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createPost } from "../api/postApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "../styles/home.css";
import { useLocation } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image_url: "",
    tags: "",
  });
  const location = useLocation();
const params = new URLSearchParams(location.search);
const searchQuery = params.get("query");
const tag = params.get("tag");

  useEffect(() => {
    async function fetchPosts() {
      try {
        let url = "http://localhost:3000/api/post";

      if (searchQuery) {
        url += `?search=${searchQuery}`;
      }
      if (tag) {
        url += `?tag=${tag}`;
      }

        const res = await fetch(url);
        const data = await res.json();
        // console.log(data);
        setPosts(data.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchPosts();
  }, [searchQuery, tag]);

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
      alert("Please login to create a post");
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

      const res = await fetch("http://localhost:3000/api/post");
      const data = await res.json();
      setPosts(data.data);
    } catch (err) {
      alert(err.message || "Failed to create post");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="home-container">
      <div className="create-post">
        <div
          className="create-post-header"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ cursor: "pointer" }}
        >
          <h2>Create a Post</h2>
          <FontAwesomeIcon
            icon={isExpanded ? faChevronUp : faChevronDown}
            className="create-post-toggle-icon"
          />
        </div>
        {isExpanded && (
          <>
            {!user ? (
              <p
                style={{ textAlign: "center", color: "#666", padding: "20px" }}
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
                    placeholder="Enter image URL (optional)"
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
                  <p className="create-post-tags-hint">
                    Separate tags with commas
                  </p>
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
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>
            No posts yet. Be the first to create one!
          </p>
        )}
      </div>
    </div>
  );
}
