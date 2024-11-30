import { beforeEach, describe, expect, it, vi } from 'vitest';
import Logger, { logger, type LoggerType } from '../logger';

describe('[@ying-web/tools] utils/logger', () => {
    let mockConsole: Console;
    let customLogger: LoggerType;

    beforeEach(() => {
        // Create mock console with spied methods
        mockConsole = {
            log: vi.fn(),
            info: vi.fn(),
            error: vi.fn(),
            warn: vi.fn(),
            debug: vi.fn(),
        } as unknown as Console;

        // Create logger instance with mock console
        customLogger = new Logger(mockConsole, '[TEST]');
    });

    it('should create logger instance with default prefix', () => {
        expect(logger).toBeDefined();
    });

    it('should create logger instance with custom prefix', () => {
        const customPrefix = '[CUSTOM]';
        const customPrefixLogger = new Logger(console, customPrefix);
        expect(customPrefixLogger).toBeInstanceOf(Logger);
    });

    it('should call console.log with prefix', () => {
        const message = 'test message';
        customLogger.log(message);

        expect(mockConsole.log).toHaveBeenCalledWith('[TEST] LOG: ', message);
    });

    it('should call console.info with prefix', () => {
        const message = 'test info';
        customLogger.info(message);

        expect(mockConsole.info).toHaveBeenCalledWith('[TEST] INFO: ', message);
    });

    it('should call console.error with prefix', () => {
        const message = 'test error';
        customLogger.error(message);

        expect(mockConsole.error).toHaveBeenCalledWith(
            '[TEST] ERROR: ',
            message,
        );
    });

    it('should call console.warn with prefix', () => {
        const message = 'test warning';
        customLogger.warn(message);

        expect(mockConsole.warn).toHaveBeenCalledWith('[TEST] WARN: ', message);
    });

    it('should call console.debug with prefix', () => {
        const message = 'test debug';
        customLogger.debug(message);

        expect(mockConsole.debug).toHaveBeenCalledWith(
            '[TEST] DEBUG: ',
            message,
        );
    });

    it('should handle multiple arguments', () => {
        const args = ['test', 123, { foo: 'bar' }];
        customLogger.log(...args);

        expect(mockConsole.log).toHaveBeenCalledWith('[TEST] LOG: ', ...args);
    });
});
