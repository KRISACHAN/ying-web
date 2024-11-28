import { isBrowser, logger } from '../../../utils';
import type { StorageProvider } from '../types';

export class IndexedProvider implements StorageProvider {
    private prefix: string;
    private dbName: string = 'UniversalStorage';
    private storeName: string = 'keyValueStore';
    private db: IDBDatabase | null = null;

    constructor(prefix: string = '') {
        this.prefix = prefix;
        if (isBrowser()) {
            this.initDB();
        }
    }

    private async initDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => {
                logger.error('IndexedDB initialization failed');
                reject();
            };

            request.onsuccess = event => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve();
            };

            request.onupgradeneeded = event => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }

    private getFullKey(key: string): string {
        return `${this.prefix}_${key}`;
    }

    async get(key: string): Promise<any> {
        if (!isBrowser() || !this.db) {
            logger.warn(
                'IndexedDB is not available in the current environment.',
            );
            return null;
        }

        return new Promise(resolve => {
            const transaction = this.db!.transaction(
                this.storeName,
                'readonly',
            );
            const store = transaction.objectStore(this.storeName);
            const request = store.get(this.getFullKey(key));

            request.onsuccess = () => {
                const data = request.result;
                if (!data) {
                    resolve(null);
                    return;
                }

                const now = new Date().getTime();
                if (data.expires !== '-1' && now > parseInt(data.expires)) {
                    this.remove(key);
                    resolve(null);
                    return;
                }

                try {
                    resolve(JSON.parse(data.value));
                } catch {
                    resolve(data.value);
                }
            };

            request.onerror = () => {
                logger.error(`Error getting item ${key}`);
                resolve(null);
            };
        });
    }

    async set(key: string, value: any, expires: string = '-1'): Promise<void> {
        if (!isBrowser() || !this.db) {
            logger.warn(
                'IndexedDB is not available in the current environment.',
            );
            return;
        }

        const expiresTime =
            expires === '-1'
                ? '-1'
                : (
                      new Date().getTime() +
                      parseInt(expires) * 24 * 60 * 60 * 1000
                  ).toString();

        return new Promise(resolve => {
            const transaction = this.db!.transaction(
                this.storeName,
                'readwrite',
            );
            const store = transaction.objectStore(this.storeName);
            const data = {
                value: JSON.stringify(value),
                expires: expiresTime,
            };

            store.put(data, this.getFullKey(key));

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => {
                logger.error(`Error setting item ${key}`);
                resolve();
            };
        });
    }

    async remove(key: string): Promise<void> {
        if (!isBrowser() || !this.db) {
            logger.warn(
                'IndexedDB is not available in the current environment.',
            );
            return;
        }

        return new Promise(resolve => {
            const transaction = this.db!.transaction(
                this.storeName,
                'readwrite',
            );
            const store = transaction.objectStore(this.storeName);
            store.delete(this.getFullKey(key));

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => {
                logger.error(`Error removing item ${key}`);
                resolve();
            };
        });
    }

    async clear(): Promise<void> {
        if (!isBrowser() || !this.db) {
            logger.warn(
                'IndexedDB is not available in the current environment.',
            );
            return;
        }

        return new Promise(resolve => {
            const transaction = this.db!.transaction(
                this.storeName,
                'readwrite',
            );
            const store = transaction.objectStore(this.storeName);
            store.clear();

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => {
                logger.error('Error clearing storage');
                resolve();
            };
        });
    }
}
