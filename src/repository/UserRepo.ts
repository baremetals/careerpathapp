import { UserModel } from '../models/User';
import { IUserDocument } from '@/interfaces/user';

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

  async save(user: IUserDocument) {
    return await UserModel.updateOne({ _id: user._id }, user, {
      validateBeforeSave: false,
    });
  }

  async updateUserWithProfileId(userId: string, profileId: string) {
    const user: IUserDocument = (await UserModel.findById(
      userId,
    )) as IUserDocument;
    if (!user) return null;

    user.profileId = profileId.toString();
    user.updatedAt = new Date();
    user.lastModifiedBy = user.fullName;
    await this.save(user);
    // await UserModel.updateOne({ _id: user._id }, user, {
    //   validateBeforeSave: false,
    // });

    return user;
  }
}
