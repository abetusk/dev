import { TMidiEvent, TMidiStatusEvent } from '../types';

export const isMidiStatusEvent = (midiEvent: TMidiEvent): midiEvent is TMidiStatusEvent => {
    return (<TMidiStatusEvent>midiEvent).channel !== undefined;
};
