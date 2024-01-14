import { redisClient } from '../redis/client';

export class SessionService {
  private redis = redisClient;

  constructor() {
    this.redis.connect();
  }

  private async closeRedis() {
    await this.redis.quit();
  }

  async setSession(key: string, value: string, expiration: number) {
    await this.redis.set(key, value, {
      EX: expiration,
      NX: true,
    });
    return this.closeRedis();
  }

  async getSession(key: string) {
    const session = await this.redis.get(key);
    await this.closeRedis();
    return session;
  }

  async deleteSession(key: string) {
    // this.redis.connect();
    await this.redis.del(key);
    return this.closeRedis();
  }
}
