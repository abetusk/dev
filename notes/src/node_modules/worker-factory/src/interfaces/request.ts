import { TValue } from '../types';

export interface IRequest {
    params?: TValue[] | { [key: string]: TValue };

    response: {
        result: TValue;

        transferables?: Transferable[];
    };

    transferables?: Transferable[];
}
