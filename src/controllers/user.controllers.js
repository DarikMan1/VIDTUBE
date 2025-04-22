import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.models.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req,res)=>{
    const {fullName,username,email,password} = req.body;
    
    //validation
    if([fullName,email,password].some((field)=>field?.trim()==="")){
        throw new ApiError("All fields are required",400);
    }
    const existedUser = await User.findOne({
        $or:[{email},{username}]
    })
    if(existedUser){
        throw new ApiError("User already exists",400);
    }
    //uploading images
    const avatarLocalPath = req.files?.avatar[0]?.avatarLocalPath
    const coverLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError("Avatar is required",400);
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    let coverImage = "";
    if(coverLocalPath){
        coverImage = await uploadOnCloudinary(coverLocalPath);
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"

    )

    if(!createdUser){
        throw new ApiError(500,"Somthing went wrong while registering a user");
    }

    return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"))

})

export {registerUser};