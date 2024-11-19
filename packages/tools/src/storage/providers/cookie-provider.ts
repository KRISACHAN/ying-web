import { StorageProvider } from '../types';

export class CookieProvider implements StorageProvider {
    constructor(
        private defaultExpires = 7,
        private defaultPath = '/',
        private prefix?: string,
    ) {}

    get(key: string): any {
        if (typeof document === 'undefined') return null;

        const value = document.cookie.match(
            `(^|;)\\s*${this.prefix ? `${this.prefix}_${key}` : key}\\s*=\\s*([^;]+)`,
        );
        try {
            return value ? JSON.parse(decodeURIComponent(value[2])) : null;
        } catch (error) {
            console.error(
                `[@ying-web/tools] ERROR: Error getting item ${key}:`,
                error,
            );
            return null;
        }
    }

    set(
        key: string,
        value: any,
        expires = this.defaultExpires,
        path = this.defaultPath,
    ): void {
        if (typeof document === 'undefined') return;

        const date = new Date();
        date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);

        try {
            document.cookie = `${this.prefix ? `${this.prefix}_${key}` : key}=${encodeURIComponent(JSON.stringify(value))}; expires=${date.toUTCString()}; path=${path}`;
        } catch (error) {
            console.error(
                `[@ying-web/tools] ERROR: Error setting item ${key}:`,
                error,
            );
        }
    }

    remove(key: string): void {
        if (typeof document === 'undefined') return;
        this.set(`${this.prefix ? `${this.prefix}_${key}` : key}`, '', -1);
    }

    clear(): void {
        if (typeof document === 'undefined') return;
        document.cookie.split(';').forEach(cookie => {
            const key = cookie.split('=')[0].trim();
            this.remove(key);
        });
    }
}
