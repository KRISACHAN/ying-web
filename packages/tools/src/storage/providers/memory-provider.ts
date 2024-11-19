import { StorageProvider } from '../types';

export class MemoryProvider implements StorageProvider {
    private storage: Map<string, any> = new Map();
    private prefix?: string;

    constructor(prefix?: string) {
        this.prefix = prefix ?? '';
    }

    get(key: string): any {
        return this.storage.get(this.prefix ? `${this.prefix}_${key}` : key);
    }

    set(key: string, value: any): void {
        this.storage.set(this.prefix ? `${this.prefix}_${key}` : key, value);
    }

    remove(key: string): void {
        this.storage.delete(this.prefix ? `${this.prefix}_${key}` : key);
    }

    clear(): void {
        this.storage.clear();
    }
}
