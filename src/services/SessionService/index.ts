import Redis from 'ioredis';

export class SessionService {
  private redis = new Redis();

  private async closeRedis() {
    await this.redis.quit();
  }

  async setSession(key: string, value: string, expiration: number) {
    await this.redis.set(key, value, 'EX', expiration);
    return this.closeRedis();
  }

  async getSession(key: string) {
    const session = await this.redis.get(key);
    await this.closeRedis();
    return session;
  }

  async deleteSession(key: string) {
    await this.redis.del(key);
    return this.closeRedis();
  }
}
