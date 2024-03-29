import { UserModel } from '../../models/User';
import {
  TEST_USER_EMAIL_ALTERNATE,
  TEST_USER_FIRST_NAME,
  TEST_USER_LAST_NAME,
  TEST_USER_PASSWORD,
} from './constants';

export default async function createTestUser(
  profileId = '60a7b1b9e1b9b3e6a4b9e1b9',
  email: string = TEST_USER_EMAIL_ALTERNATE.trim().toLowerCase(),
) {
  const fullName = `${TEST_USER_FIRST_NAME} ${TEST_USER_LAST_NAME}`;
  const user = await UserModel.create({
    firstName: TEST_USER_FIRST_NAME,
    lastName: TEST_USER_LAST_NAME,
    fullName,
    email,
    password: TEST_USER_PASSWORD,
    createdBy: fullName,
    lastModifiedBy: fullName,
    profileId,
  });

  return { user };
}
