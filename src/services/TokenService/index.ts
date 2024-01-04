import { verifyJwtAsymmetric, signJwtAsymmetric } from '../../utils/jwt';

export class TokenService {
  verifyToken(token: string, publicKey: string) {
    return verifyJwtAsymmetric(token, publicKey);
  }
  signToken(payload: object, privateKey: string, options?: object) {
    return signJwtAsymmetric(payload, privateKey, options);
  }
}
