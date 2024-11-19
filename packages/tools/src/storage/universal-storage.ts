import { StorageOptions, StorageProvider, StorageType } from './types';
import { MemoryProvider } from './providers/memory-provider';
import { WebStorageProvider } from './providers/web-storage-provider';
import { CookieProvider } from './providers/cookie-provider';

/**
 * UniversalStorage class provides a unified interface for different storage types
 * with fallback mechanisms for server-side environments
 */
export class UniversalStorage {
    private provider: StorageProvider;
    private static memoryInstance: MemoryProvider;

    constructor(
        options: StorageOptions = {
            type: 'local',
            prefix: 'ying_',
        },
    ) {
        this.provider = this.getProvider(options.type || 'local', options);
    }

    private getProvider(
        type: StorageType,
        options: StorageOptions,
    ): StorageProvider {
        if (typeof window === 'undefined') {
            return this.getMemoryProvider();
        }

        switch (type) {
            case 'local':
                try {
                    return new WebStorageProvider(
                        window.localStorage,
                        options.prefix,
                    );
                } catch {
                    return this.getMemoryProvider();
                }
            case 'session':
                try {
                    return new WebStorageProvider(
                        window.sessionStorage,
                        options.prefix,
                    );
                } catch {
                    return this.getMemoryProvider();
                }
            case 'cookie':
                return new CookieProvider(
                    options.expires,
                    options.path,
                    options.prefix,
                );
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

    /**
     * Get a value from storage
     * @param key - Storage key
     * @returns The stored value or null if not found
     */
    get<T>(key: string): T | null {
        return this.provider.get(key);
    }

    /**
     * Set a value in storage
     * @param key - Storage key
     * @param value - Value to store
     */
    set<T>(key: string, value: T): void {
        this.provider.set(key, value);
    }

    /**
     * Remove a value from storage
     * @param key - Storage key
     */
    remove(key: string): void {
        this.provider.remove(key);
    }

    /**
     * Clear all values from storage
     */
    clear(): void {
        this.provider.clear();
    }
}
