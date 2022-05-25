import { onRequestHookHandler } from 'fastify';

const onRequest: onRequestHookHandler = async (req, res) => {
  const publiclyAuthorizedPath = ['/token', '/static', '/json'];

  if (
    req.routerPath.includes('tokens') ||
    req.routerPath.includes('static') ||
    req.routerPath.includes('json')
  ) {
    return;
  }

  try {
    await req.jwtVerify();
  } catch (err) {
    res.send(err);
  }
};

export default onRequest;
