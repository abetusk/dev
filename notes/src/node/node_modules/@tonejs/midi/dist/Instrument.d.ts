import { MidiTrackData } from "midi-file";
import { Track } from "./Track";
/**
 * Describes the midi instrument of a track
 */
export declare class Instrument {
    /**
     * The instrument number
     */
    number: number;
    /**
     * @param trackData
     * @param track
     */
    constructor(trackData: MidiTrackData, track: Track);
    /**
     * The common name of the instrument
     */
    get name(): string;
    set name(n: string);
    /**
     * The instrument family, e.g. "piano".
     */
    get family(): string;
    /**
     * If the instrument is a percussion instrument
     */
    get percussion(): boolean;
    /**
     * Convert it to JSON form
     */
    toJSON(): InstrumentJSON;
    /**
     * Convert from JSON form
     */
    fromJSON(json: InstrumentJSON): void;
}
export interface InstrumentJSON {
    number: number;
    name: string;
    family: string;
}
