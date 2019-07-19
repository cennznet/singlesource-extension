import {
  InitCommand,
  InPageMsgTypes,
  BgMsgTypes,
  RuntimeMessageWith,
  SignCommand
} from '../types';
import openPanel from './openPanel';
import { PortStreams } from './streams';
import { getAccounts, getEnvironment } from './state';

export default {
  [InPageMsgTypes.SIGN]: function(message: RuntimeMessageWith<SignCommand>) {
    const {payload} = message;
    openPanel({ noheader: true, sign: payload, parent: message.origin });
  },
  [InPageMsgTypes.INIT]: function({origin}: RuntimeMessageWith<InitCommand>, router: PortStreams) {
    getEnvironment().then(environment => {
      router.send({
        type: BgMsgTypes.ENVIRONMENT,
        environment
      }, origin);
    });
    getAccounts().then(accounts => {
      router.send({
        type: BgMsgTypes.ACCOUNTS,
        accounts,
      }, origin);
    });
  }
}
