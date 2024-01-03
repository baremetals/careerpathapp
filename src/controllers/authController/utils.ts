import { ACCOUNT_ACTIVATION_PARTIAL_URL } from '@/lib/constants';
import { SQSService } from '@/services/NotificationService/SQSSERVICE';
import { accountActivationTemplate } from '@/services/NotificationService/email-templates/accountActivationTemplate';
import { TokenService } from '@/services/TokenService';

export async function addToSQSQueue(
  email: string,
  firstName: string,
  token: string,
) {
  const sqsService = new SQSService();
  const url = `${process.env.Client_URL}/${ACCOUNT_ACTIVATION_PARTIAL_URL}/${token}`;
  const htmlTemplate = accountActivationTemplate(firstName, url);
  const receiver = [email];

  await sqsService.sendMessage(
    process.env.ACCOUNT_ACTIVATION_QUEUE_URL as string,
    {
      to: receiver,
      subject: 'Activate Account',
      htmlTemplate,
    },
  );
}

export async function createToken(email: string) {
  const tokenService = new TokenService();
  const token = tokenService.signToken(
    { email },
    process.env.ACCOUNT_ACTIVATION_TOKEN_PRIVATE_KEY as string,
    {
      expiresIn: parseInt(
        process.env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION as string,
      ),
    },
  );
  return token as string;
}
