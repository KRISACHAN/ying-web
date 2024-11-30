import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isBrowser, isServer } from '../env';

describe('[@ying-web/tools] utils/env', () => {
    describe('isBrowser', () => {
        const originalWindow = globalThis.window;

        beforeEach(() => {
            // Reset window after each test
            vi.stubGlobal('window', originalWindow);
        });

        afterEach(() => {
            // Restore window after each test
            vi.unstubAllGlobals();
        });

        it('should return true when window is defined', () => {
            vi.stubGlobal('window', { /* mock window object */ });
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
            // Reset window after each test
            vi.stubGlobal('window', originalWindow);
        });

        afterEach(() => {
            // Restore window after each test
            vi.unstubAllGlobals();
        });

        it('should return true when window is undefined', () => {
            vi.stubGlobal('window', undefined);
            expect(isServer()).toBe(true);
        });

        it('should return false when window is defined', () => {
            vi.stubGlobal('window', { /* mock window object */ });
            expect(isServer()).toBe(false);
        });

        it('should return opposite of isBrowser', () => {
            vi.stubGlobal('window', { /* mock window object */ });
            expect(isServer()).toBe(!isBrowser());
            
            vi.stubGlobal('window', undefined);
            expect(isServer()).toBe(!isBrowser());
        });
    });
});
