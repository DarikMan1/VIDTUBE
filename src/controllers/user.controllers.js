import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    return null;
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  // Validation: Check if any required field is missing
  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists with the same email or username
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  // Validate username (to handle undefined or null cases)
  const validUsername = username ? username.toLowerCase() : null;
  if (!validUsername) {
    throw new ApiError(400, "Username is required");
  }

  // Extract files from the request (uploaded avatar and cover image)
  const avatarFile =
    Array.isArray(req.files?.avatar) && req.files.avatar.length > 0
      ? req.files.avatar[0]
      : null;

  const coverFile =
    Array.isArray(req.files?.coverImage) && req.files.coverImage.length > 0
      ? req.files.coverImage[0]
      : null;

  const avatarLocalPath = avatarFile?.path;
  const coverLocalPath = coverFile?.path;

  if (!avatarLocalPath) {
    throw new ApiError("Avatar is required", 400);
  }

  // Upload the avatar and cover image to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  let coverImage = "";

  if (coverLocalPath) {
    coverImage = await uploadOnCloudinary(coverLocalPath);
  }

  // Create new user in the database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: validUsername,
  });

  // Fetch the created user (without password and refreshToken)
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  // Send response back to client
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
