import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import "../styles/login.css";
import { useAlert } from "../context/AlertContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [alert, setAlert] = useState(null);
  const { changePassword } = useAuth();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showAlert("error", "Passwords do not match");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      showAlert("success", "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showAlert("error", err.message || "Failed to change password");
    }
  };

  return (
    <div className="login-container">
      {/* {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          fixed
        />
      )} */}
      <div className="login-box">
        <h1>Change Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="password-wrapper">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <div
              className="toggle-password"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
            >
              <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
            </div>
          </div>
          <div className="password-wrapper">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <div
              className="toggle-password"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
            </div>
          </div>
          <div className="password-wrapper">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div
              className="toggle-password"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </div>
          </div>
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
}
