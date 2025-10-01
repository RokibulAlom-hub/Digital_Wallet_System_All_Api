import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";

import { IUser } from "../user/user.interface";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";



const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }
    // const jwtPayload = {
    //     userId: isUserExist._id,
    //     email: isUserExist.email,
    //     role: isUserExist.role
    // }
    // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

        const userTokens = createUserTokens(isUserExist)

    return {
        accessToken: userTokens.accessToken,
        refershToken: userTokens.refreshToken
    }

}
const getNewAccesToken = async (refreshToken: string) =>{
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return{
        accessToken: newAccessToken
    }
}
//user - login - token (email, role, _id) - booking / payment / booking / payment cancel - token 

const resetPassword = async (oldPassword:string, newPassword:string,decodedToken:JwtPayload)=>{
    const isExistUser = await User.findById(decodedToken?.userId)
    if (!isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "ID does not exist");
  }
    const isOldPasswordMatch= await bcrypt.compare(oldPassword,isExistUser?.password as string)
        if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
    }
isExistUser.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
isExistUser?.save()
}
export const AuthServices = {
    credentialsLogin,
    getNewAccesToken,
    resetPassword
}