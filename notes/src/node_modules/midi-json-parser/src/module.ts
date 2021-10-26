import { load } from 'midi-json-parser-broker';
import { worker } from './worker/worker';

const blob: Blob = new Blob([worker], { type: 'application/javascript; charset=utf-8' });

const url: string = URL.createObjectURL(blob);

const midiJsonParser = load(url);

export const connect = midiJsonParser.connect;

export const disconnect = midiJsonParser.disconnect;

export const isSupported = midiJsonParser.isSupported;

// @todo Remove type annotation when possible.
export const parseArrayBuffer: typeof midiJsonParser.parseArrayBuffer = midiJsonParser.parseArrayBuffer;

URL.revokeObjectURL(url);
