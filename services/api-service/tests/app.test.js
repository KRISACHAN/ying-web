import { describe, it, expect } from 'vitest';
import { to } from 'await-to-js';
import { createTestServer } from './server';

describe('Test app', () => {
    it('should return 200 for health check', async () => {
        const app = createTestServer();
        const [err, res] = await to(app.get('/health'));
        
        if (err) {
            throw err;
        }
        
        expect(res.statusCode).toBe(200);
    });
});
