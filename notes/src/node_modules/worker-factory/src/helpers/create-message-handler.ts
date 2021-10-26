import { IAugmentedError } from 'compilerr';
import { IBrokerEvent, IErrorNotification, IErrorResponse, IReceiver, IRequest, IWorkerDefinition } from '../interfaces';
import { TMessageReceiverWithParams, TMessageReceiverWithoutParams, TWorkerImplementation } from '../types';
import { renderMethodNotFoundError, renderMissingResponseError, renderUnexpectedResultError } from './error-renderers';

export const createMessageHandler = <T extends IWorkerDefinition>(receiver: IReceiver, workerImplementation: TWorkerImplementation<T>) => {
    return async ({ data: { id, method, params } }: IBrokerEvent<T>) => {
        const messageHandler = workerImplementation[method];

        try {
            if (messageHandler === undefined) {
                throw renderMethodNotFoundError({ method });
            }

            const response =
                params === undefined
                    ? (messageHandler as TMessageReceiverWithoutParams<T[typeof method]['response']>)()
                    : (messageHandler as TMessageReceiverWithParams<T[typeof method]['params'], T[typeof method]['response']>)(params);

            if (response === undefined) {
                throw renderMissingResponseError({ method });
            }

            const synchronousResponse = response instanceof Promise ? await response : response;

            if (id === null) {
                if (synchronousResponse.result !== undefined) {
                    throw renderUnexpectedResultError({ method });
                }
            } else {
                if (synchronousResponse.result === undefined) {
                    throw renderUnexpectedResultError({ method });
                }

                const { result, transferables = [] } = <IRequest['response']>synchronousResponse;

                receiver.postMessage({ id, result }, transferables);
            }
        } catch (err) {
            const { message, status = -32603 } = <IAugmentedError>err;

            receiver.postMessage(<IErrorNotification | IErrorResponse>{ error: { code: status, message }, id });
        }
    };
};
