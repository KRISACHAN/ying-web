import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { isBrowser, isServer } from '../env';

describe('[@ying-web/tools] utils/env', () => {
    describe('isBrowser', () => {
        const originalWindow = globalThis.window;

        beforeEach(() => {
            vi.stubGlobal('window', originalWindow);
        });

        afterEach(() => {
            vi.unstubAllGlobals();
        });

        it('should return true when window is defined', () => {
            vi.stubGlobal('window', {});
            expect(isBrowser()).toBe(true);
        });

        it('should return false when window is undefined', () => {
            vi.stubGlobal('window', undefined);
            expect(isBrowser()).toBe(false);
        });
    });

    describe('isServer', () => {
        const originalWindow = globalThis.window;

        beforeEach(() => {
            vi.stubGlobal('window', originalWindow);
        });

        afterEach(() => {
            vi.unstubAllGlobals();
        });

        it('should return true when window is undefined', () => {
            vi.stubGlobal('window', undefined);
            expect(isServer()).toBe(true);
        });

        it('should return false when window is defined', () => {
            vi.stubGlobal('window', {});
            expect(isServer()).toBe(false);
        });

        it('should return opposite of isBrowser', () => {
            vi.stubGlobal('window', {});
            expect(isServer()).toBe(!isBrowser());

            vi.stubGlobal('window', undefined);
            expect(isServer()).toBe(!isBrowser());
        });
    });
});
