import JWT from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

        if(!token){
            throw new ApiError(400,"unauthorized request")
        }

        const decoded = JWT.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded?._id)

        if (!user) {
            throw new ApiError(400,"user does not exist")
        }
        req.user =user;
        next();

    } catch (error) {
        throw new ApiError(500, error?.message || "Invalid access token")
    }
}
)

export { verifyJWT }