import { PORT_MAP } from './port-map';
export const extendBrokerImplementation = (partialBrokerImplementation) => ({
    ...partialBrokerImplementation,
    connect: ({ call }) => {
        return async () => {
            const { port1, port2 } = new MessageChannel();
            const portId = await call('connect', { port: port1 }, [port1]);
            PORT_MAP.set(port2, portId);
            return port2;
        };
    },
    disconnect: ({ call }) => {
        return async (port) => {
            const portId = PORT_MAP.get(port);
            if (portId === undefined) {
                throw new Error('The given port is not connected.');
            }
            await call('disconnect', { portId });
        };
    },
    isSupported: ({ call }) => {
        return () => call('isSupported');
    }
});
//# sourceMappingURL=extend-broker-implementation.js.map