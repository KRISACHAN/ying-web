import { isBrowser, logger } from '../../utils';

import { CookieProvider } from './providers/cookie-provider';
import { IndexedProvider } from './providers/indexed-provider';
import { MemoryProvider } from './providers/memory-provider';
import { WebStorageProvider } from './providers/web-storage-provider';
import { StorageOptions, StorageProvider, StorageType } from './types';

export class UniversalStorage {
    private provider: StorageProvider;
    private static memoryInstance: MemoryProvider;

    constructor(
        options: StorageOptions = {
            type: 'local',
            prefix: 'ying_',
            expires: '-1',
        },
    ) {
        this.provider = this.getProvider(options.type || 'local', options);
    }

    private getProvider(
        type: StorageType,
        options: StorageOptions,
    ): StorageProvider {
        if (!isBrowser()) {
            return this.getMemoryProvider(options.prefix);
        }

        switch (type) {
            case 'local':
                try {
                    return new WebStorageProvider(
                        window.localStorage,
                        options.prefix,
                    );
                } catch (error) {
                    logger.error(error);
                    return this.getMemoryProvider(options.prefix);
                }
            case 'session':
                try {
                    return new WebStorageProvider(
                        window.sessionStorage,
                        options.prefix,
                    );
                } catch (error) {
                    logger.error(error);
                    return this.getMemoryProvider(options.prefix);
                }
            case 'cookie':
                return new CookieProvider(options.prefix);
            case 'indexed':
                return new IndexedProvider(options.prefix);
            case 'memory':
            default:
                return this.getMemoryProvider(options.prefix);
        }
    }

    private getMemoryProvider(prefix?: string): MemoryProvider {
        if (!UniversalStorage.memoryInstance) {
            UniversalStorage.memoryInstance = new MemoryProvider(prefix);
        }
        return UniversalStorage.memoryInstance;
    }

    get<T>(key: string): T | null {
        return this.provider.get(key);
    }

    set<T>(key: string, value: T, expires?: string): void {
        this.provider.set(key, value, expires);
    }

    remove(key: string): void {
        this.provider.remove(key);
    }

    clear(): void {
        this.provider.clear();
    }
}
