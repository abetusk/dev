export interface IBrokerDefinition {
    [method: string]: (...args: any[]) => void | Promise<any>; // tslint:disable-line:invalid-void
}
