import { sendMessageToQueue } from '@/lib/aws-config';
import AppError from '@/utils/appError';

export class SQSService {
  public async sendMessage(
    queueUrl: string,
    messageBody: Record<string, unknown>,
  ): Promise<void> {
    try {
      const data = await sendMessageToQueue(
        queueUrl,
        JSON.stringify(messageBody),
      );
      console.log('Message sent:', data);
    } catch (error) {
      console.error('Error sending message:', error);
      throw new AppError('Error sending message', 500);
    }
  }
}
