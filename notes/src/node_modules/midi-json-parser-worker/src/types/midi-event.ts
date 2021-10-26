import { TMidiMetaEvent } from './midi-meta-event';
import { TMidiStatusEvent } from './midi-status-event';

export type TMidiEvent = TMidiMetaEvent | TMidiStatusEvent;
