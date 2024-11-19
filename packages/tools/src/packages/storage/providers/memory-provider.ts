import { StorageProvider } from '../types';

interface StoredData {
    key: string;
    expires: string;
    value: any;
}

export class MemoryProvider implements StorageProvider {
    private storage: Map<string, StoredData> = new Map();
    private prefix?: string;

    constructor(prefix?: string) {
        this.prefix = prefix ?? '';
    }

    get(key: string): any {
        const fullKey = `${this.prefix}_${key}`;
        const data = this.storage.get(fullKey);

        if (!data) return null;

        const now = new Date().getTime();
        if (data.expires !== '-1' && now > new Date(data.expires).getTime()) {
            this.remove(key);
            return null;
        }

        return data.value;
    }

    set(key: string, value: any, expires: string = '-1'): void {
        const fullKey = `${this.prefix}_${key}`;
        const data: StoredData = {
            key: fullKey,
            expires,
            value,
        };
        this.storage.set(fullKey, data);
    }

    remove(key: string): void {
        const fullKey = `${this.prefix}_${key}`;
        this.storage.delete(fullKey);
    }

    clear(): void {
        this.storage.clear();
    }
}
