import dotenv from 'dotenv';
import { afterAll, beforeAll } from 'vitest';

beforeAll(() => {
    dotenv.config({ path: '.env.test' });
});

afterAll(() => {});
