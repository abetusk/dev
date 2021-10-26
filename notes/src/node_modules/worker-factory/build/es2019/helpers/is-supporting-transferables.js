// Bug #1: Safari does currently not support to use transferables.
export const isSupportingTransferables = () => new Promise((resolve) => {
    const arrayBuffer = new ArrayBuffer(0);
    const { port1, port2 } = new MessageChannel();
    port1.onmessage = ({ data }) => resolve(data !== null);
    port2.postMessage(arrayBuffer, [arrayBuffer]);
});
//# sourceMappingURL=is-supporting-transferables.js.map