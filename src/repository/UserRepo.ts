import { IUserDocument } from '@/interfaces/user';
import * as argon2 from 'argon2';
import { UserModel } from '../models/User';
import { UserStatuses } from '@/lib/auth-validation-config';

export class UserRepo {
  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const newUser = await UserModel.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName,
      email: email.trim().toLowerCase(),
      password,
      role: 'user',
      createdBy: fullName,
      lastModifiedBy: fullName,
    });

    return newUser;
  }

  async findOne(query: object) {
    return UserModel.findOne(query);
  }

  async findById(id: string) {
    return UserModel.findById(id);
  }

  async save(user: IUserDocument, validate = false) {
    return await UserModel.updateOne({ _id: user._id }, user, {
      validateBeforeSave: validate,
    });
  }

  async updateUserWithProfileId(userId: string, profileId: string) {
    const user: IUserDocument = (await this.findById(userId)) as IUserDocument;
    if (!user) return null;

    user.profileId = profileId.toString();
    user.updatedAt = new Date();
    user.lastModifiedBy = user.fullName;
    await this.save(user);
    return user;
  }
  async resetPassword(
    userId: string,
    password: string,
    confirmPassword: string,
  ) {
    const user: IUserDocument = (await this.findById(userId)) as IUserDocument;
    if (!user) return null;
    const hashedPassword = await argon2.hash(password);
    user.password = hashedPassword;
    user.confirmPassword = confirmPassword;
    user.updatedAt = new Date();
    user.lastModifiedBy = user.fullName;
    await this.save(user);
    return user;
  }

  async softDeleteUser(id: string) {
    const user = await this.findById(id);
    if (!user) return null;
    user.status = UserStatuses.DELETED;
    user.lastModifiedBy = user.fullName;
    user.updatedAt = new Date();
    await this.save(user);
    return user;
  }
}
