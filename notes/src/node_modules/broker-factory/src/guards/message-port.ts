export const isMessagePort = (sender: MessagePort | Worker): sender is MessagePort => {
    return typeof (<MessagePort>sender).start === 'function';
};
