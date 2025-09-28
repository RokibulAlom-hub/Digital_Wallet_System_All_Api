import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
const createUser = async (payload: Partial<IUser>) => {
    const {name, email} = payload;
    const user = await User.create({
        name,
        email
    })
    return user
}
const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
};

const updateUserProfile = async (
  userId: string,
  payload: Partial<IUser>,
  decoded: JwtPayload
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.role) {
    if (decoded.role === Role.USER || decoded.role === Role.AGENT) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to change user roles"
      );
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decoded.role === Role.USER || decoded.role === Role.AGENT) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to change user roles"
      );
    }
  }
  const updateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

//   if (payload.picture && user.picture) {
//     await deleteImageFromCLoudinary(user.picture);
//   }
  return updateUser;
};
export const UserServices = {
    createUser,
    getAllUsers,
    updateUserProfile
}