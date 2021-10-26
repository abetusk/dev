import { IWorkerDefinition } from './worker-definition';

export interface IDefaultWorkerDefinition extends IWorkerDefinition {
    connect: {
        params: {
            port: MessagePort;
        };

        response: {
            result: number;
        };
    };

    disconnect: {
        params: {
            portId: number;
        };

        response: {
            result: null;
        };
    };

    isSupported: {
        response: {
            result: boolean;
        };
    };
}
