import { isMidiStatusEvent } from './guards/midi-status-event';
import { hexify } from './helpers/hexify';
import { hexifyNumber } from './helpers/hexify-number';
import { stringify } from './helpers/stringify';
import {
    IMidiChannelPrefixEvent,
    IMidiChannelPressureEvent,
    IMidiControlChangeEvent,
    IMidiCopyrightNoticeEvent,
    IMidiDeviceNameEvent,
    IMidiEndOfTrackEvent,
    IMidiInstrumentNameEvent,
    IMidiKeyPressureEvent,
    IMidiKeySignatureEvent,
    IMidiLyricEvent,
    IMidiMarkerEvent,
    IMidiMidiPortEvent,
    IMidiNoteOffEvent,
    IMidiNoteOnEvent,
    IMidiPitchBendEvent,
    IMidiProgramChangeEvent,
    IMidiProgramNameEvent,
    IMidiSequencerSpecificEvent,
    IMidiSetTempoEvent,
    IMidiSmpteOffsetEvent,
    IMidiSysexEvent,
    IMidiTextEvent,
    IMidiTimeSignatureEvent,
    IMidiTrackNameEvent,
    IMidiUnknownTextEvent
} from './interfaces';
import { TMidiEvent, TMidiMetaEvent, TMidiStatusEvent } from './types';

export const parseArrayBuffer = (arrayBuffer: ArrayBuffer) => {
    const dataView = new DataView(arrayBuffer);

    const header = _parseHeaderChunk(dataView); // tslint:disable-line:no-use-before-declare

    let offset = 14;

    const tracks = [];

    for (let i = 0, length = header.numberOfTracks; i < length; i += 1) {
        let track;

        ({ offset, track } = _parseTrackChunk(dataView, offset)); // tslint:disable-line:no-use-before-declare

        tracks.push(track);
    }

    return {
        division: header.division,
        format: header.format,
        tracks
    };
};

const _parseEvent = (
    dataView: DataView,
    offset: number,
    lastStatusByte: null | number
): { event: TMidiEvent; eventTypeByte: number; offset: number } => {
    let result: { event: TMidiEvent; offset: number };

    const { offset: nextOffset, value: delta } = _readVariableLengthQuantity(
        // tslint:disable-line:no-use-before-declare
        dataView,
        offset
    );

    const eventTypeByte = dataView.getUint8(nextOffset);

    if (eventTypeByte === 0xf0) {
        // tslint:disable-line:no-bitwise
        result = _parseSysexEvent(dataView, nextOffset + 1); // tslint:disable-line:no-use-before-declare
    } else if (eventTypeByte === 0xff) {
        // tslint:disable-line:no-bitwise
        result = _parseMetaEvent(dataView, nextOffset + 1); // tslint:disable-line:no-use-before-declare
    } else {
        result = _parseMidiEvent(eventTypeByte, dataView, nextOffset + 1, lastStatusByte); // tslint:disable-line:no-use-before-declare
    }

    return { ...result, event: { ...result.event, delta }, eventTypeByte };
};

const _parseHeaderChunk = (dataView: DataView) => {
    if (stringify(dataView, 0, 4) !== 'MThd') {
        throw new Error(`Unexpected characters "${stringify(dataView, 0, 4)}" found instead of "MThd"`);
    }

    if (dataView.getUint32(4) !== 6) {
        throw new Error(`The header has an unexpected length of ${dataView.getUint32(4)} instead of 6`);
    }

    const format = dataView.getUint16(8);

    const numberOfTracks = dataView.getUint16(10);

    const division = dataView.getUint16(12);

    return {
        division,
        format,
        numberOfTracks
    };
};

const _parseMetaEvent = (dataView: DataView, offset: number): { event: TMidiMetaEvent; offset: number } => {
    let event: TMidiMetaEvent;

    const metaTypeByte = dataView.getUint8(offset);
    const { offset: nextOffset, value: length } = _readVariableLengthQuantity(
        // tslint:disable-line:no-use-before-declare
        dataView,
        offset + 1
    );

    if (metaTypeByte === 0x01) {
        // tslint:disable-line:no-bitwise
        event = <IMidiTextEvent>{
            text: stringify(dataView, nextOffset, length)
        };
    } else if (metaTypeByte === 0x02) {
        // tslint:disable-line:no-bitwise
        event = <IMidiCopyrightNoticeEvent>{
            copyrightNotice: stringify(dataView, nextOffset, length)
        };
    } else if (metaTypeByte === 0x03) {
        // tslint:disable-line:no-bitwise
        event = <IMidiTrackNameEvent>{
            trackName: stringify(dataView, nextOffset, length)
        };
    } else if (metaTypeByte === 0x04) {
        // tslint:disable-line:no-bitwise
        event = <IMidiInstrumentNameEvent>{
            instrumentName: stringify(dataView, nextOffset, length)
        };
    } else if (metaTypeByte === 0x05) {
        // tslint:disable-line:no-bitwise
        event = <IMidiLyricEvent>{
            lyric: stringify(dataView, nextOffset, length)
        };
    } else if (metaTypeByte === 0x06) {
        // tslint:disable-line:no-bitwise
        event = <IMidiMarkerEvent>{
            marker: stringify(dataView, nextOffset, length)
        };
    } else if (metaTypeByte === 0x08) {
        // tslint:disable-line:no-bitwise
        event = <IMidiProgramNameEvent>{
            programName: stringify(dataView, nextOffset, length)
        };
    } else if (metaTypeByte === 0x09) {
        // tslint:disable-line:no-bitwise
        event = <IMidiDeviceNameEvent>{
            deviceName: stringify(dataView, nextOffset, length)
        };
    } else if (
        metaTypeByte === 0x0a ||
        metaTypeByte === 0x0b ||
        metaTypeByte === 0x0c ||
        metaTypeByte === 0x0d ||
        metaTypeByte === 0x0e ||
        metaTypeByte === 0x0f
    ) {
        // tslint:disable-line:no-bitwise
        event = <IMidiUnknownTextEvent>{
            metaTypeByte: hexifyNumber(metaTypeByte),
            text: stringify(dataView, nextOffset, length)
        };
    } else if (metaTypeByte === 0x20) {
        // tslint:disable-line:no-bitwise
        event = <IMidiChannelPrefixEvent>{
            channelPrefix: dataView.getUint8(nextOffset)
        };
    } else if (metaTypeByte === 0x21) {
        // tslint:disable-line:no-bitwise
        event = <IMidiMidiPortEvent>{
            midiPort: dataView.getUint8(nextOffset)
        };
    } else if (metaTypeByte === 0x2f) {
        // tslint:disable-line:no-bitwise

        // @todo length must be 0

        event = <IMidiEndOfTrackEvent>{
            endOfTrack: true
        };
    } else if (metaTypeByte === 0x51) {
        // tslint:disable-line:no-bitwise

        // @todo length must be 5

        event = <IMidiSetTempoEvent>{
            setTempo: {
                microsecondsPerQuarter:
                    (dataView.getUint8(nextOffset) << 16) + // tslint:disable-line:no-bitwise
                    (dataView.getUint8(nextOffset + 1) << 8) + // tslint:disable-line:no-bitwise
                    dataView.getUint8(nextOffset + 2)
            }
        };
    } else if (metaTypeByte === 0x54) {
        // tslint:disable-line:no-bitwise
        let frameRate;

        // @todo length must be 5

        const hourByte = dataView.getUint8(nextOffset);

        // tslint:disable-next-line:no-bitwise
        if ((hourByte & 0x60) === 0x00) {
            frameRate = 24;
            // tslint:disable-next-line:no-bitwise
        } else if ((hourByte & 0x60) === 0x20) {
            frameRate = 25;
            // tslint:disable-next-line:no-bitwise
        } else if ((hourByte & 0x60) === 0x40) {
            frameRate = 29;
            // tslint:disable-next-line:no-bitwise
        } else if ((hourByte & 0x60) === 0x60) {
            frameRate = 30;
        }

        event = <IMidiSmpteOffsetEvent>{
            smpteOffset: {
                frame: dataView.getUint8(nextOffset + 3),
                frameRate,
                hour: hourByte & 0x1f, // tslint:disable-line:no-bitwise
                minutes: dataView.getUint8(nextOffset + 1),
                seconds: dataView.getUint8(nextOffset + 2),
                subFrame: dataView.getUint8(nextOffset + 4)
            }
        };
    } else if (metaTypeByte === 0x58) {
        // tslint:disable-line:no-bitwise
        event = <IMidiTimeSignatureEvent>{
            timeSignature: {
                denominator: Math.pow(2, dataView.getUint8(nextOffset + 1)),
                metronome: dataView.getUint8(nextOffset + 2),
                numerator: dataView.getUint8(nextOffset),
                thirtyseconds: dataView.getUint8(nextOffset + 3)
            }
        };
    } else if (metaTypeByte === 0x59) {
        // tslint:disable-line:no-bitwise

        // @todo length must be 2

        event = <IMidiKeySignatureEvent>{
            keySignature: {
                key: dataView.getInt8(nextOffset),
                scale: dataView.getInt8(nextOffset + 1)
            }
        };
    } else if (metaTypeByte === 0x7f) {
        // tslint:disable-line:no-bitwise
        event = <IMidiSequencerSpecificEvent>{
            sequencerSpecificData: hexify(dataView, nextOffset, length)
        };
    } else {
        throw new Error(`Cannot parse a meta event with a type of "${hexifyNumber(metaTypeByte)}"`);
    }

    return {
        event,
        offset: nextOffset + length
    };
};

const _parseMidiEvent = (
    statusByte: number,
    dataView: DataView,
    offset: number,
    lastStatusByte: null | number
): { event: TMidiEvent; offset: number } => {
    const sanitizedLastStatusByte = (statusByte & 0x80) === 0 ? lastStatusByte : null; // tslint:disable-line:no-bitwise
    const eventType = (sanitizedLastStatusByte === null ? statusByte : sanitizedLastStatusByte) >> 4; // tslint:disable-line:no-bitwise

    let event: TMidiStatusEvent;
    let sanitizedOffset = sanitizedLastStatusByte === null ? offset : offset - 1; // tslint:disable-line:no-bitwise

    if (eventType === 0x08) {
        // tslint:disable-line:no-bitwise
        event = <IMidiNoteOffEvent>{
            noteOff: {
                noteNumber: dataView.getUint8(sanitizedOffset),
                velocity: dataView.getUint8(sanitizedOffset + 1)
            }
        };

        sanitizedOffset += 2;
    } else if (eventType === 0x09) {
        // tslint:disable-line:no-bitwise
        const noteNumber = dataView.getUint8(sanitizedOffset);
        const velocity = dataView.getUint8(sanitizedOffset + 1);

        if (velocity === 0) {
            event = <IMidiNoteOffEvent>{
                noteOff: {
                    noteNumber,
                    velocity
                }
            };
        } else {
            event = <IMidiNoteOnEvent>{
                noteOn: {
                    noteNumber,
                    velocity
                }
            };
        }

        sanitizedOffset += 2;
    } else if (eventType === 0x0a) {
        // tslint:disable-line:no-bitwise
        event = <IMidiKeyPressureEvent>{
            keyPressure: {
                pressure: dataView.getUint8(sanitizedOffset)
            }
        };

        sanitizedOffset += 1;
    } else if (eventType === 0x0b) {
        // tslint:disable-line:no-bitwise
        event = <IMidiControlChangeEvent>{
            controlChange: {
                type: dataView.getUint8(sanitizedOffset),
                value: dataView.getUint8(sanitizedOffset + 1)
            }
        };

        sanitizedOffset += 2;
    } else if (eventType === 0x0c) {
        // tslint:disable-line:no-bitwise
        event = <IMidiProgramChangeEvent>{
            programChange: {
                programNumber: dataView.getUint8(sanitizedOffset)
            }
        };

        sanitizedOffset += 1;
    } else if (eventType === 0x0d) {
        // tslint:disable-line:no-bitwise
        event = <IMidiChannelPressureEvent>{
            channelPressure: {
                noteNumber: dataView.getUint8(sanitizedOffset),
                pressure: dataView.getUint8(sanitizedOffset + 1)
            }
        };

        sanitizedOffset += 2;
    } else if (eventType === 0x0e) {
        // tslint:disable-line:no-bitwise
        event = <IMidiPitchBendEvent>{
            pitchBend: dataView.getUint8(sanitizedOffset) | (dataView.getUint8(sanitizedOffset + 1) << 7) // tslint:disable-line:no-bitwise
        };

        sanitizedOffset += 2;
    } else {
        throw new Error(`Cannot parse a midi event with a type of "${hexifyNumber(eventType)}"`);
    }

    event.channel = (sanitizedLastStatusByte === null ? statusByte : sanitizedLastStatusByte) & 0x0f; // tslint:disable-line:no-bitwise

    return { event, offset: sanitizedOffset };
};

const _parseSysexEvent = (dataView: DataView, offset: number): { event: IMidiSysexEvent; offset: number } => {
    const { offset: nextOffset, value: length } = _readVariableLengthQuantity(
        // tslint:disable-line:no-use-before-declare
        dataView,
        offset
    );

    return {
        event: <IMidiSysexEvent>{
            sysex: hexify(dataView, nextOffset, length)
        },
        offset: nextOffset + length
    };
};

const _parseTrackChunk = (dataView: DataView, offset: number) => {
    if (stringify(dataView, offset, 4) !== 'MTrk') {
        throw new Error(`Unexpected characters "${stringify(dataView, offset, 4)}" found instead of "MTrk"`);
    }

    const events = [];
    const length = dataView.getUint32(offset + 4) + offset + 8;

    let lastStatusByte: null | number = null;
    let nextOffset = offset + 8;

    while (nextOffset < length) {
        const result = _parseEvent(dataView, nextOffset, lastStatusByte);
        const { event, eventTypeByte } = result;

        events.push(event);
        nextOffset = result.offset;

        // tslint:disable-next-line:no-bitwise
        if (isMidiStatusEvent(event) && (eventTypeByte & 0x80) > 0) {
            lastStatusByte = eventTypeByte;
        }
    }

    return {
        offset: nextOffset,
        track: events
    };
};

const _readVariableLengthQuantity = (dataView: DataView, offset: number) => {
    let nextOffset = offset;
    let value = 0;

    while (true) {
        const byte = dataView.getUint8(nextOffset);

        nextOffset += 1;

        if (byte > 127) {
            value += byte & 0x7f; // tslint:disable-line:no-bitwise
            value <<= 7; // tslint:disable-line:no-bitwise
        } else {
            value += byte;

            return {
                offset: nextOffset,
                value
            };
        }
    }
};
