import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ChangePassword() {
  const [currentPsw, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { changePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      await changePassword(currentPsw, password);
      alert("Password changed successfully!");
      navigate("/profile");
    } catch (err) {
      alert(err.message || "Failed to change password");
    }
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Change Password</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPsw"
              type="password"
              placeholder="Enter current password"
              value={currentPsw}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
}