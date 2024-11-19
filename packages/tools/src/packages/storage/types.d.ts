export type StorageType = 'local' | 'session' | 'cookie' | 'memory';

export interface StorageOptions {
    type?: StorageType;
    expires?: string;
    path?: string; // Used in cookie mode
    prefix?: string;
}

export interface StorageProvider {
    get(key: string): any;
    set(key: string, value: any, expires?: string): void; // Added expires parameter
    remove(key: string): void;
    clear(): void;
}
