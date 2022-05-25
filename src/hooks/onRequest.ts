import { onRequestHookHandler } from 'fastify';

const onRequest: onRequestHookHandler = async (req, res) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    res.send(err);
  }
};

export default onRequest;
