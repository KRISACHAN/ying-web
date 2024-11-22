import { UniversalStorage } from '@ying-web/tools';

export const localCache = new UniversalStorage({
    type: 'local',
    prefix: 'ying-events',
});
