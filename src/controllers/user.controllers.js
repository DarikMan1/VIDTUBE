import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
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

const loginUser = asyncHandler(async (req,res)=>{
    //get data from body
    const {email,username,password}=req.body
    //validation
    if(!email && !username){
        throw new ApiError(400,"Email or username is required")
    }
    if(!password){
        throw new ApiError(400,"Password is required")
    }
    //check if user exists
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(400,"Invalid credentials")
    }
    //check if password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid credentials")
    }
    const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!loggedInUser){
        throw new ApiError(500,"Something went wrong while logging in")
    }

    const options = {
        httpOnly:true,
        secure: process.env.NODE_ENV === "production"
    }
    
    return res
    .status(200)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,loggedInUser,"User logged in successfully"))
})

const logoutUser = asyncHandler(async (req,res)=>{
     await User.findByIdAndUpdate(
      req.user._id,
      {
        $set:{
          refreshToken: undefined,
        }
      },
      {new:true}
     )

     const options = {
      httpOnly:true,
      secure: process.env.NODE_ENV === "production",
     }

     return res
      .status(200)
      .clearCookie("refreshToken",options)
      .clearCookie("accessToken",options)
      .json(new ApiResponse(200,{},"User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken||req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(400,"Refresh token is required")
    }
    try {
        const decoded = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decoded?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
        if(user.refreshToken !== incomingRefreshToken){
            throw new ApiError(401,"Invalid refresh token")
        }
        const options = {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production"
        }
        const {accessToken,refreshToken:newRefreshToken} = await generateAccessTokenAndRefreshToken(user._id)

        return res
        .status(200)
        .cookie("refreshToken",newRefreshToken,options)
        .cookie("accessToken",accessToken,options)
        .json(new ApiResponse(200,"Access token refreshed successfully"))


    } catch (error) {
        throw new ApiError(500,"Something went wrong while refreshing access token")
        
    }
})

export { registerUser,loginUser,refreshAccessToken,logoutUser };
