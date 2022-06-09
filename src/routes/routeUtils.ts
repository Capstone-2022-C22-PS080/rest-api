import { onRequestHookHandler } from 'fastify';
import firebaseAdminAuth from '../services/firebaseAdminAuth';

type Decoded = {
  uid: string;
  iat: number;
};

export const onRequestAuthorize: onRequestHookHandler = async function (
  req,
  res
) {
  /**
   * auth checks jwt by using Authorization header, with firebase uid as payload in jwt
   */
  try {
    await req.jwtVerify({ ignoreExpiration: true });
    const decoded = req.user as Decoded;
    await firebaseAdminAuth.getUser(decoded.uid);
  } catch (err) {
    this.log.error(err);
    res.send(err);
  }
};
