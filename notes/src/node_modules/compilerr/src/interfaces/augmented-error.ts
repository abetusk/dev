import { IAWSError } from './aws-error';

export interface IAugmentedError extends Error {
    cause?: Error | IAWSError;

    code?: string;

    status?: number;
}
