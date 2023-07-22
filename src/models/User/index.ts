import { Schema, model } from 'mongoose';
import validator from 'validator';
import * as argon2 from 'argon2';
import { IUserDocument } from 'interfaces/user';
import { defaultAvatar } from '../../lib/constants';

const userSchema = new Schema<IUserDocument>({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el: string): boolean {
        return el === (this as any).password;
      },
      message: 'Passwords are not the same!',
    },
  },

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  bio: { type: String, required: false },
  avatar: { type: String, default: defaultAvatar },
  isDisabled: { type: Boolean, default: false, select: false },
  isActive: { type: Boolean, default: false },
  profile: { type: Schema.Types.ObjectId, ref: 'UserProfile' },

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  createdBy: { type: String, default: 'admin', select: false },
  lastModifiedBy: { type: String, default: 'admin', select: false },
  role: { type: String, default: 'user' },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await argon2.hash(this.password as string);

  // Delete passwordConfirm field
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Assuming this is the correct implementation of the argon2.verify function
    argon2
      .verify(userPassword, candidatePassword)
      .then((passwordCheck) => {
        console.log('----------------------->', passwordCheck);
        resolve(passwordCheck);
      })
      .catch((error) => {
        console.error('Error during password verification:', error);
        reject(error);
      });
  });
  // return argon2.verify(userPassword, candidatePassword);
};

const UserModel = model<IUserDocument>('User', userSchema);

export { UserModel };
