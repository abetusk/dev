export interface IReceiver {
    addEventListener: typeof addEventListener;

    postMessage: typeof postMessage;

    removeEventListener: typeof removeEventListener;
}
