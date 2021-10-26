import { IError } from './error';

export interface IWorkerErrorMessage {
    error: IError;

    id: null | number;
}
