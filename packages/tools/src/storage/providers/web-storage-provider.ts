import { isBrowser } from '../../utils/env';
import { StorageProvider } from '../types';

export class WebStorageProvider implements StorageProvider {
    private prefix?: string;

    constructor(
        private storage: Storage,
        prefix?: string,
    ) {
        this.prefix = prefix ?? '';
    }

    get(key: string): any {
        try {
            if (!isBrowser) {
                console.warn(
                    `[@ying-web/tools] WARNING: Storage is not available in the current environment.`,
                );
                return null;
            }
            const item = this.storage.getItem(
                this.prefix ? `${this.prefix}_${key}` : key,
            );
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(
                `[@ying-web/tools] ERROR: Error getting item ${key}:`,
                error,
            );
            return null;
        }
    }

    set(key: string, value: any): void {
        if (!isBrowser) {
            console.warn(
                `[@ying-web/tools] WARNING: Storage is not available in the current environment.`,
            );
            return;
        }
        try {
            this.storage.setItem(
                this.prefix ? `${this.prefix}_${key}` : key,
                JSON.stringify(value),
            );
        } catch (error) {
            console.error(
                `[@ying-web/tools] ERROR: Error setting item ${key}:`,
                error,
            );
        }
    }

    remove(key: string): void {
        if (!isBrowser) {
            console.warn(
                `[@ying-web/tools] WARNING: Storage is not available in the current environment.`,
            );
            return;
        }
        try {
            this.storage.removeItem(
                this.prefix ? `${this.prefix}_${key}` : key,
            );
        } catch (error) {
            console.error(
                `[@ying-web/tools] ERROR: Error removing item ${key}:`,
                error,
            );
        }
    }

    clear(): void {
        if (!isBrowser) {
            console.warn(
                `[@ying-web/tools] WARNING: Storage is not available in the current environment.`,
            );
            return;
        }
        try {
            this.storage.clear();
        } catch (error) {
            console.error(
                `[@ying-web/tools] ERROR: Error clearing storage:`,
                error,
            );
        }
    }
}
