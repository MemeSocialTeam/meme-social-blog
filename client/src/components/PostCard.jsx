import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faShare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { toggleLike } from "../api/postApi";
import { useNavigate } from "react-router-dom";

const DEFAULT_POST_IMAGE = "https://i.imgflip.com/1bhk.jpg";

export default function PostCard({ post }) {
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleToggleLike = async () => {
    if (!user) return;
    try {
      console.log("Toggling like for post id:", post.id);
      const likeStatus = await toggleLike(post.id);
      console.log("Like status:", likeStatus);
      setLikesCount(likeStatus.data.likes);
    } catch (err) {
      console.error("Like action failed", err);
    }
  };

  return (
    <div className="post">
      <div className="post-user user">
        {/* <img
          src={post.userAvatar}
          alt={post.username}
          className="user-img"
        /> */}
        <FontAwesomeIcon icon={faUser} />
        <span className="user-username">{post.user.username}</span>
      </div>

      <div className="post-image">
        <img
          src={
            post.image_url && post.image_url.trim() !== ""
              ? post.image_url
              : DEFAULT_POST_IMAGE
          }
          alt="post"
        />
      </div>

      <div className="post-actions">
        <Button
          text={<FontAwesomeIcon icon={faHeart} />}
          onClick={handleToggleLike}
        ></Button>{" "}
        <span>{likesCount}</span>
        <Button text={<FontAwesomeIcon icon={faComment} />}></Button>{" "}
        <span>{post.commentsCount}</span>
        <Button text={<FontAwesomeIcon icon={faShare} />}></Button>
      </div>
      <div className="post-info">
        <span className="post-username">{post.user.username}</span>
        {post.title && <span className="post-title">{post.title}</span>}
        <span className="post-description">{post.description}</span>
      </div>
      <div className="post-tags">
        {post.tags?.map((tag) => (
          <span key={tag.id} onClick={() => navigate(`/?tag=${tag.tag_name}`)}>#{tag.tag_name}</span>
        ))}
      </div>
    </div>
  );
}
