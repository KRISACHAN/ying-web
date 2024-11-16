import { to } from 'await-to-js';
import server from './server';

describe('Test app', () => {
    test('Test health', async done => {
        const app = server();
        const [err, res] = await to(app.get('/health'));
        if (err) {
            done(err);
        }
        expect(res.statusCode).toBe(200);
        done();
    });
});
