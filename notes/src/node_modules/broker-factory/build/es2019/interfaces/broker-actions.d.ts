import { IWorkerDefinition } from 'worker-factory';
export interface IBrokerActions<T extends IWorkerDefinition> {
    call<U extends keyof T>(method: U, params?: T[U]['params'], transferables?: T[U]['transferables']): Promise<T[U]['response']['result']>;
    notify<U extends keyof T>(method: U, params: T[U]['params'], transferables?: T[U]['transferables']): void;
}
//# sourceMappingURL=broker-actions.d.ts.map