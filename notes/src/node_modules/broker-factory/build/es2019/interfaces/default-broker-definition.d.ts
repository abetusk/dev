import { IBrokerDefinition } from './broker-definition';
export interface IDefaultBrokerDefinition extends IBrokerDefinition {
    connect(): Promise<MessagePort>;
    disconnect(port: MessagePort): Promise<void>;
    isSupported(): Promise<boolean>;
}
//# sourceMappingURL=default-broker-definition.d.ts.map