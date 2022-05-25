import { onReadyAsyncHookHandler } from 'fastify';
import constants from '../common/constants';

const onReady: onReadyAsyncHookHandler = async function () {
  this.listen(constants.PORT, (_err, addr) => {
    console.log(`Server running in ${addr}`);
  });
};

export default onReady;
