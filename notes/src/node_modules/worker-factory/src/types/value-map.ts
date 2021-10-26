import { IValueMap } from '../interfaces';

export type TValueMap<T extends IValueMap = IValueMap> = {
    [P in keyof T]: T[P];
};
