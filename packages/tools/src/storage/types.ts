/**
 * Available storage types
 */
export type StorageType = 'local' | 'session' | 'cookie' | 'memory';

/**
 * Storage options interface
 */
export interface StorageOptions {
    /** Storage type to use */
    type?: StorageType;
    /** Cookie expiration in days (only for cookie storage) */
    expires?: number;
    /** Cookie path (only for cookie storage) */
    path?: string;
    /** Enable encryption of stored data */
    encrypt?: boolean;
    /** Prefix for storage keys */
    prefix?: string;
}

/**
 * Storage provider interface
 */
export interface StorageProvider {
    get(key: string): any;
    set(key: string, value: any): void;
    remove(key: string): void;
    clear(): void;
}
