import { catchAsync } from "../utils/catchAsync.mjs";
import AppError from "../utils/AppError.mjs";
import Meme from "../models/meme.mjs";
import Tag from "../models/tag.mjs";
import User from "../models/user.mjs";
import MemeTag from "../models/memeTag.mjs";
import Like from "../models/like.mjs";
import Comment from "../models/comment.mjs";
import { sendResponse } from "../utils/helpers/sendResponse.mjs";
import { Op } from "sequelize";

// --- get all posts ---
export const getAllPosts = catchAsync(async (req, res, next) => {
  const { search, tag } = req.query;
  const where = {}

  if(search) {
    where.title = {[Op.like]: `%${search}%`}
  }

  let posts;

  if (tag) {
    const taggedPosts = await Meme.findAll({
      include: [
        {
          model: Tag,
          as: "tags",
          where: { tag_name: { [Op.like]: `%${tag}%` } },
          attributes: [],
          through: { attributes: [] },
          required: true,
        },
      ],
      attributes: ["id"],
    });
    const postIds = taggedPosts.map((p) => p.id);
    posts = await Meme.findAll({
      where: { ...where, id: postIds },
      include: [
        {
          model: Tag,
          as: "tags",
          through: { attributes: [] },
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
        { model: Like, as: "likes", attributes: ["id"] },
        { model: Comment, as: "comments", attributes: ["id"] },
      ],
      order: [["createdAt", "DESC"]],
    });
  } else {
    posts = await Meme.findAll({
      where,
      include: [
        {
          model: Tag,
          as: "tags",
          through: { attributes: [] },
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
        { model: Like, as: "likes", attributes: ["id"] },
        { model: Comment, as: "comments", attributes: ["id"] },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  const postsWithCounts = posts.map((post) => {
    const p = post.toJSON();
    return {
      ...p,
      likesCount: p.likes.length,
      commentsCount: p.comments.length,
    };
  });
  sendResponse(res, 200, postsWithCounts);
});

// --- create a post ---

export const createPost = catchAsync(async (req, res, next) => {
  const {
    user,
    body: { title, description, category, image_url, tags },
  } = req;
  if (!title || !description)
    return next(new AppError("Title and description are required", 400));

  const post = await Meme.create({
    title,
    description,
    category,
    image_url,
    user_id: user.id,
  });

  if (tags && Array.isArray(tags) && tags.length) {
    for (let tagName of tags) {
      const [tag] = await Tag.findOrCreate({
        where: { tag_name: tagName },
      });

      await MemeTag.findOrCreate({
        where: {
          meme_id: post.id,
          tag_id: tag.id,
        },
      });
    }
  }
  sendResponse(res, 201, post);
});

// --- get one post by id ---

export const getOnePost = catchAsync(async (req, res, next) => {
  const {
    params: { id },
  } = req;
  const post = await Meme.findByPk(id, {
    include: {
      model: Tag,
      as: "tags",
      through: { attributes: [] },
    },
  });
  if (!post) return next(new AppError("Post not found", 404));
  sendResponse(res, 200, post);
});

// --- update a field ---

export const updatePost = catchAsync(async (req, res, next) => {
  const {
    params: { id },
    body: { title, description, category, image_url, tags },
    user,
  } = req;

  const post = await Meme.findByPk(id);
  if (!post) return next(new AppError("Post not found", 404));
  if (post.user_id !== user.id)
    return next(new AppError("Not the author", 403));

  if (title) post.title = title;
  if (description) post.description = description;
  if (category) post.category = category;
  if (image_url) post.image_url = image_url;

  if (tags && Array.isArray(tags)) {
    await MemeTag.destroy({ where: { meme_id: post.id } });

    for (const tagName of tags) {
      const [tag] = await Tag.findOrCreate({
        where: { tag_name: tagName },
      });
      await MemeTag.findOrCreate({
        where: { meme_id: post.id, tag_id: tag.id },
      });
    }
  }

  const updated = await post.save();
  sendResponse(res, 200, updated);
});

// --- delete post by id ---

export const deletePost = catchAsync(async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;

  const post = await Meme.findByPk(id);
  if (!post) return next(new AppError("Post not found", 404));

  if (post.user_id !== user.id)
    return next(new AppError("Not the author", 403));

  await MemeTag.destroy({ where: { meme_id: id } });
  await post.destroy();

  sendResponse(res, 200, { msg: "Post deleted successfully" });
});

// --- toggle like for post ---

export const toggleLike = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user.id;

  const post = await Meme.findByPk(postId);
  if (!post) return next(new AppError("Post not found", 404));

  const existingLike = await Like.findOne({
    where: { user_id: userId, meme_id: postId },
  });

  let liked;

  if (existingLike) {
    await existingLike.destroy();
    liked = false;
  } else {
    await Like.create({
      user_id: userId,
      meme_id: postId,
    });
    liked = true;
  }

  const likeCount = await Like.count({
    where: { meme_id: postId },
  });
  sendResponse(res, 200, {
    likes: likeCount,
    liked: liked,
  });
});
