import { TMessage } from './message';

export type TMessageReceiverWithParams<T extends TMessage['params'], U extends TMessage['response']> = (params: T) => U | Promise<U>;
