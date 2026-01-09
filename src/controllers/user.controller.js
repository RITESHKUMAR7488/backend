import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    //get user detail from frontend
    // validation - not empty
    // check user already registered : email,useername
    // check for images check for avatar
    // create user object - create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return res

    const{username,email,password,fullName} = req.body;
    console.log(email);

    if(
        [username,email,password,fullName].some((field) => field?.trim() ==="")
    ){
        throw new ApiError(400,"All fields are required");
    }

    const existedUser=User.findOne({
        $or :[ {username}, {email} ]
    })

    if(existedUser){
        throw new ApiError(409,"User already registered");
    }   

    const avatarLocalPath = req.file?.avatar[0]?.path;
    const coverImageLocalPath = req.file?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar image is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath) 
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar image is required");
    }

    const user = await User.create({
        fullName,
        username : username.toLowerCase(),
        email,
        password,
        avatar: avatar.url, 
        coverImage: coverImage?.url || ""
    })

   const createdUser = await User.findById(user._id).select("-password -refreshToken");

   if(!createdUser){
    throw new ApiError(500,"User registration failed");
   }

    return res.status(201).json(new ApiResponse(200,createdUser,"User registered successfully"));



})

export {registerUser    }