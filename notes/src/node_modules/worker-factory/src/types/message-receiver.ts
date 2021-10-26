import { TMessage } from './message';
import { TMessageReceiverWithParams } from './message-receiver-with-params';
import { TMessageReceiverWithoutParams } from './message-receiver-without-params';

export type TMessageReceiver<T extends TMessage> = T['params'] extends undefined
    ? TMessageReceiverWithoutParams<T['response']>
    : TMessageReceiverWithParams<T['params'], T['response']>;
