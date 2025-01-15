import { cloneDeep } from 'lodash';
import {
    luckyNumberTheme,
    type LuckyNumberTheme,
} from '../../LuckyNumber/styles/index';

// @TODO: Make luckyNumberTheme be a global theme

export const optionDrawTheme = cloneDeep(luckyNumberTheme);

export type OptionDrawTheme = LuckyNumberTheme;
