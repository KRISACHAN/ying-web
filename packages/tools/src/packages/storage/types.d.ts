export type StorageType = 'local' | 'session' | 'cookie' | 'memory' | 'indexed';

export interface StorageOptions {
    type?: StorageType;
    expires?: string;
    prefix?: string;
}

export interface StorageProvider {
    get(key: string): any;
    set(key: string, value: any, expires?: string): void;
    remove(key: string): void;
    clear(): void;
}
