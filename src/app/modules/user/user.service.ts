import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  //existising user validation 
  const isExistUser = await User.findOne({ email })
   if (isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }
  const session = await User.startSession();
  session.startTransaction()
  try {
     
  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
  const user = await User.create({
    email,
    password: hashedPassword,
    rest
  })
  const existingWallet = await Wallet.findOne({
    user: user._id,
  })
  if (existingWallet) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Wallet already exists for this user"
    );
  }
  await Wallet.create({
    user: user._id,
    balance: 50,
  });
  return user
}
   catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error
  }
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