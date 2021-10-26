import { TMessage } from './message';

export type TMessageReceiverWithoutParams<T extends TMessage['response']> = () => T | Promise<T>;
