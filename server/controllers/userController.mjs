import { catchAsync } from "../utils/catchAsync.mjs";
import User from "../models/user.mjs";
import AppError from "../utils/AppError.mjs";
import Meme from "../models/meme.mjs";
import Follow from "../models/follow.mjs";
import { compareHashedPassword } from "../utils/helpers/hashPassword.mjs";
import { sendResponse } from "../utils/helpers/sendResponse.mjs";

// --- get all users (for checks or admin user only) ---
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll();
  console.log(users);

  sendResponse(res, 200, users);
});

// --- get single user by id ---

export const getOneUser = catchAsync(async (req, res, next) => {
  let id = req.params.id;
  if (id === "me") {
    if (!req.user) return next(new AppError("Not authenticated", 401));
    id = req.user.id;
  }
  const user = await User.findByPk(id, {
    attributes: ["id", "username", "email", "createdOn"],
    include: [
      { model: Follow, as: "followers", attributes: [] },
      { model: Follow, as: "following", attributes: [] },
      { model: Meme, as: "memes", attributes: [] },
    ],
  });
  if (!user) return next(new AppError("User not found", 404));
  const userData = {
    ...user.toJSON(),
    followersCount: await user.countFollowers(),
    followingCount: await user.countFollowing(),
    memesCount: await user.countMemes(),
  };
  sendResponse(res, 200, userData);
});

// --- update user by id ---

export const updateUser = catchAsync(async (req, res, next) => {
  try {
    const {
      user: { id },
      body: { username, email, password, currentPsw },
    } = req;

    const user = await User.findByPk(id);
    if (!user) return next(new AppError("User not found", 404));

    if (password) {
      if (!currentPsw)
        return next(new AppError("Current password is required", 400));
      const isMatch = compareHashedPassword(currentPsw, user.password);
      if (!isMatch)
        return next(new AppError("Current password incorrect", 400));
      if (password) user.password = password;
    }

    if (username) user.username = username;
    if (email) user.email = email;

    const updated = await user.save();
    if (!updated) return next(new AppError("User not found", 404));
    sendResponse(res, 200, updated);
  } catch (err) {
    console.error("updateUser error:", err);
    next(err);
  }
});

// --- delete user profile ---

export const deleteUser = catchAsync(async (req, res, next) => {
  const {
    user: { id },
  } = req;
  // delete all his post if user delete profile
  await Meme.destroy({ where: { user_id: id } });
  const deleted = await User.destroy({ where: { id } });
  if (!deleted) return next(new AppError("User not found", 404));

  req.logout((err) => {
    if (err) return next(err);
  });

  req.session.destroy((err) => {
    if (err) console.error("Session destroy error:", err);
  });

  res.clearCookie("connect.sid", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  sendResponse(res, 200, { msg: "Account deleted successfully" });
});
