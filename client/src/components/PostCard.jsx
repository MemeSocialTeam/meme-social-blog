import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faShare,
  faUser,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { toggleLike } from "../api/postApi";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import CommentsPopup from "./CommentsPopup";
import "../styles/postCard.css";
import { useAlert } from "../context/AlertContext";


const DEFAULT_POST_IMAGE = "https://freesvg.org/img/Troll-Face.png";

export default function PostCard({ post, onDelete }) {
  const { showAlert, clearAlert } = useAlert();
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const canDelete = user && post.user_id === user.id;

  const handleToggleLike = async () => {
    if (!user) return;
    try {
      const likeStatus = await toggleLike(post.id);
      setLikesCount(likeStatus.data.likes);
    } catch (err) {
      console.error("Like action failed", err);
    }
  };

  const handleDeleteClick = () => {
    showAlert("error", "Are you sure you want to delete this post?");
    setShowConfirmAlert(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmAlert(false);
    clearAlert();
    if (onDelete) {
    await onDelete(post.id);
    showAlert("success", "Post deleted successfully!");
  }
  };
  const handleCancelDelete = () => {
    setShowConfirmAlert(false);
    clearAlert();
  };

  return (
    <>
      {showConfirmAlert && (
       
          <div className="post-confirm-buttons">
            <button
              onClick={handleConfirmDelete}
              className="post-confirm-delete-btn"
            >
              Delete
            </button>
            <button
              onClick={handleCancelDelete}
              className="post-confirm-cancel-btn"
            >
              Cancel
            </button>
          </div>
      )}

      <div className="post">
        <div className="post-user user">
          <FontAwesomeIcon icon={faUser} />
          <span className="user-username">{post.user.username}</span>
          {canDelete && (
            <button
              onClick={handleDeleteClick}
              className="post-delete-btn"
              aria-label="Delete post"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>

        <div className="post-image">
          <img
            src={post.image_url?.trim() ? post.image_url : DEFAULT_POST_IMAGE}
            alt="post"
          />
        </div>

        <div className="post-actions">
          <Button
            text={<FontAwesomeIcon icon={faHeart} />}
            onClick={handleToggleLike}
          />
          <span>{likesCount}</span>
          <Button
            text={<FontAwesomeIcon icon={faComment} />}
            onClick={() => setShowComments(true)}
          />
          <span>{commentsCount}</span>
          <Button text={<FontAwesomeIcon icon={faShare} />} />
        </div>

        <div className="post-info">
          <span className="post-username">{post.user.username}</span>
          {post.title && <span className="post-title">{post.title}</span>}
          <span className="post-description">{post.description}</span>
        </div>

        <div className="post-tags">
          {post.tags?.map((tag) => (
            <span
              key={tag.id}
              onClick={() => navigate(`/?search=${tag.tag_name}`)}
            >
              #{tag.tag_name}{" "}
            </span>
          ))}
        </div>
      </div>
      {showComments && (
        <CommentsPopup
          postId={post.id}
          handleClose={() => setShowComments(false)}
          handleNewComment={() => setCommentsCount((prev) => prev + 1)}
        />
      )}
    </>
  );
}
