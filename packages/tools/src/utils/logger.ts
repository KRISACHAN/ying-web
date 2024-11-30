export type LoggerType = {
    log: (...args: any[]) => void;
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    debug: (...args: any[]) => void;
};

export class Logger {
    private instance: LoggerType = console;
    private prefix: string = '';

    constructor(instance = console, prefix: string = '[@ying-web/tools]') {
        this.instance = instance;
        this.prefix = prefix;
    }

    log(...args: any[]) {
        this.instance.log(`${this.prefix} LOG: `, ...args);
    }

    info(...args: any[]) {
        this.instance.info(`${this.prefix} INFO: `, ...args);
    }

    error(...args: any[]) {
        this.instance.error(`${this.prefix} ERROR: `, ...args);
    }

    warn(...args: any[]) {
        this.instance.warn(`${this.prefix} WARN: `, ...args);
    }

    debug(...args: any[]) {
        this.instance.debug(`${this.prefix} DEBUG: `, ...args);
    }
}

export const logger = new Logger();

export default Logger;
