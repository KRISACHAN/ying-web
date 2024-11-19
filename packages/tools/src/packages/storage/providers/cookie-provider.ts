import { isBrowser, logger } from '../../../utils';
import type { StorageProvider } from '../types';

export class CookieProvider implements StorageProvider {
    private prefix: string = '';

    constructor(prefix: string = '') {
        this.prefix = prefix;
    }

    get(key: string): any {
        if (!isBrowser()) {
            logger.warn('Storage is not available in the current environment.');
            return null;
        }

        const fullKey = `${this.prefix}_${key}`;
        const value = document.cookie.match(
            `(^|;)\\s*${fullKey}\\s*=\\s*([^;]+)`,
        );

        if (!value) return null;

        const cookieValue = decodeURIComponent(value[2]);
        const [storedValue, expires] = cookieValue.split('|');

        const now = new Date().getTime();
        if (expires !== '-1' && now > parseInt(expires)) {
            this.remove(key);
            return null;
        }

        return storedValue;
    }

    set(key: string, value: any, expires: string = '-1'): void {
        if (!isBrowser()) {
            logger.warn('Storage is not available in the current environment.');
            return;
        }

        const fullKey = `${this.prefix}_${key}`;
        const date = new Date();
        const expiresTime =
            expires === '-1'
                ? '-1'
                : (
                      date.getTime() +
                      parseInt(expires) * 24 * 60 * 60 * 1000
                  ).toString();

        try {
            document.cookie = `${fullKey}=${encodeURIComponent(value + '|' + expiresTime)}; expires=${new Date(parseInt(expiresTime)).toUTCString()}; path=/`;
        } catch (error) {
            logger.error(`Error setting item ${key}:`, error);
        }
    }
    remove(key: string): void {
        if (!isBrowser()) {
            logger.warn('Storage is not available in the current environment.');
            return;
        }
        this.set(key, '', '-1');
    }

    clear(): void {
        if (!isBrowser()) {
            logger.warn('Storage is not available in the current environment.');
            return;
        }
        document.cookie.split(';').forEach(cookie => {
            const key = cookie.split('=')[0].trim();
            if (key.startsWith(this.prefix)) {
                this.remove(key.replace(`${this.prefix}_`, ''));
            }
        });
    }
}
