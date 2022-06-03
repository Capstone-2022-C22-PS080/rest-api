import { onRequestHookHandler } from 'fastify';
import firebaseAdminAuth from '../services/firebaseAdminAuth';

type Decoded = {
  uid: string;
  iat: number;
};

export const onRequest: onRequestHookHandler = async function (req, res) {
  /**
   * Skip auth check for these routes
   */
  if (
    req.routerPath.includes('/auth/token') ||
    req.routerPath.includes('/static') ||
    req.routerPath.includes('/json') ||
    req.routerPath.includes('/docs')
  ) {
    return;
  }

  /**
   * auth checks jwt by using Authorization header, with firebase uid as payload in jwt
   */
  try {
    await req.jwtVerify();
    const decoded = req.user as Decoded;
    await firebaseAdminAuth.getUser(decoded.uid);
  } catch (err) {
    res.send(err);
  }
};
