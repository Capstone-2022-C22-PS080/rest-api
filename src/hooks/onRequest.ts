import { onRequestHookHandler } from 'fastify';

export const onRequest: onRequestHookHandler = async (req, res) => {
  /**
   * Skip auth check for these routes
   */
  if (
    req.routerPath.includes('/auth/token') ||
    req.routerPath.includes('/static') ||
    req.routerPath.includes('/json') ||
    req.routerPath.includes('/')
  ) {
    return;
  }

  /**
   * auth checks jwt by using Authorization header, with firebase uid as payload in jwt
   */
  try {
    await req.jwtVerify();
  } catch (err) {
    res.send(err);
  }
};
