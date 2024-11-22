import { isBrowser, logger } from '../../../utils';
import type { StorageProvider } from '../types';

export class WebStorageProvider implements StorageProvider {
    private storage: Storage;
    private prefix?: string;

    constructor(storage: Storage, prefix?: string) {
        this.storage = storage;
        this.prefix = prefix ?? '';
    }

    get(key: string): any {
        if (!isBrowser()) {
            logger.warn('Storage is not available in the current environment.');
            return null;
        }
        try {
            const fullKey = `${this.prefix}_${key}`;
            const item = this.storage.getItem(fullKey);
            if (!item) return null;

            const data = JSON.parse(item);
            const now = new Date().getTime();
            if (
                data.expires !== '-1' &&
                now > new Date(data.expires).getTime()
            ) {
                this.remove(key);
                return null;
            }
            try {
                const res = JSON.parse(data.value);
                return res;
            } catch (error) {
                return data.value;
            }
        } catch (error) {
            logger.error(`Error getting item ${key}:`, error);
            return null;
        }
    }

    set(key: string, value: any, expires: string = '-1'): void {
        if (!isBrowser()) {
            logger.warn('Storage is not available in the current environment.');
            return;
        }
        try {
            const fullKey = `${this.prefix}_${key}`;
            const data = {
                key: fullKey,
                expires,
                value,
            };
            this.storage.setItem(fullKey, JSON.stringify(data)); // Use fullKey to set the item
        } catch (error) {
            logger.error(`Error setting item ${key}:`, error);
        }
    }

    remove(key: string): void {
        if (!isBrowser()) {
            logger.warn('Storage is not available in the current environment.');
            return;
        }
        try {
            const fullKey = `${this.prefix}_${key}`;
            this.storage.removeItem(fullKey); // Use fullKey to remove the item
        } catch (error) {
            logger.error(`Error removing item ${key}:`, error);
        }
    }

    clear(): void {
        if (!isBrowser()) {
            logger.warn('Storage is not available in the current environment.');
            return;
        }
        try {
            this.storage.clear();
        } catch (error) {
            logger.error('Error clearing storage:', error);
        }
    }
}
