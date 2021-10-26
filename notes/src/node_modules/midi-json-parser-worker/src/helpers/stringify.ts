/**
 * This function turns a part of a given ArrayBuffer into a String.
 */
export const stringify = (dataView: DataView, offset = 0, length = dataView.byteLength - (offset - dataView.byteOffset)) => {
    const byteOffset = offset + dataView.byteOffset;

    const array = new Uint8Array(dataView.buffer, byteOffset, length);

    // String.fromCharCode() does normally expect numbers but it can also handle a typed array.
    return String.fromCharCode.apply(null, <number[]>(<any>array));
};
