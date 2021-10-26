import { IValueArray } from '../interfaces';
import { TTypedArray } from './typed-array';
import { TValueMap } from './value-map';

export type TValue = boolean | null | number | string | IValueArray | RegExp | TTypedArray | TValueMap | Transferable;
