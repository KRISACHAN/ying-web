import { UniversalStorage } from '@ying-web/tools';

export const localStorage = new UniversalStorage({
    type: 'local',
    prefix: 'ying-admin',
});
