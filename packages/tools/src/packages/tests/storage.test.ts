import { beforeEach, describe, expect, it } from 'vitest';
import { UniversalStorage } from '../storage/universal-storage';

describe('[@ying-web/tools] packages/storage', () => {
    describe('UniversalStorage', () => {
        let storage: UniversalStorage;

        beforeEach(() => {
            storage = new UniversalStorage();
            storage.clear();
        });

        it('should create instance with default options', () => {
            expect(storage).toBeInstanceOf(UniversalStorage);
        });

        it('should store and retrieve values', () => {
            const testKey = 'test-key';
            const testValue = { foo: 'bar' };

            storage.set(testKey, testValue);
            const retrieved = storage.get(testKey);

            expect(retrieved).toEqual(testValue);
        });

        it('should remove values', () => {
            const testKey = 'test-key';
            const testValue = 'test-value';

            storage.set(testKey, testValue);
            storage.remove(testKey);

            expect(storage.get(testKey)).toBeNull();
        });

        it('should clear all values', () => {
            const testData = {
                key1: 'value1',
                key2: 'value2',
            };

            Object.entries(testData).forEach(([key, value]) => {
                storage.set(key, value);
            });

            storage.clear();

            Object.keys(testData).forEach(key => {
                expect(storage.get(key)).toBeNull();
            });
        });

        it('should handle different storage types', () => {
            const types = [
                'local',
                'session',
                'cookie',
                'indexed',
                'memory',
            ] as const;

            types.forEach(type => {
                const typeStorage = new UniversalStorage({ type });
                expect(typeStorage).toBeInstanceOf(UniversalStorage);
            });
        });

        it('should handle prefix in keys', () => {
            const prefix = 'test_prefix_';
            const storage = new UniversalStorage({ prefix });
            const testKey = 'test-key';
            const testValue = 'test-value';

            storage.set(testKey, testValue);

            expect(storage.get(testKey)).toBe(testValue);
        });
    });
});
