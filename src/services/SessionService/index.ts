import Redis from 'ioredis';

export class SessionService {
  private redis = new Redis();

  async setSession(key: string, value: string, expiration: number) {
    return this.redis.set(key, value, 'EX', expiration);
  }

  async getSession(key: string) {
    return this.redis.get(key);
  }

  async deleteSession(key: string) {
    return this.redis.del(key);
  }
}
