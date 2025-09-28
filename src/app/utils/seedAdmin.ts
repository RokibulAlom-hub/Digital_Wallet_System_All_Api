import { envVars } from "../config/env";
import { IAuthsProviders, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const isAdminExists = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
      role: "ADMIN",
    });
    if (isAdminExists) {
      console.log("Admin already exists");
      return;
    }
    const hashedPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthsProviders = {
      provider: "credential",
      providerID: envVars.SUPER_ADMIN_EMAIL,
    };
    const payload: IUser = {
      name: "Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.ADMIN,
      isVerified: true,
      auths: [authProvider],
    };
    await User.create(payload);
  } catch (error) {
    console.log(error);
  }
};