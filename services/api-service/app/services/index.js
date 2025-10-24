// Service layer unified export
export { AdminService, adminService } from './admin/admin.service';
export { AuthService, authService } from './auth.service';
export { BaseService } from './base.service';
export {
    LuckyNumberActivityService,
    luckyNumberActivityService,
} from './lucky-number/activity.service';
export {
    OptionDrawActivityService,
    optionDrawActivityService,
} from './option-draw/activity.service';
export { PromiseService, promiseService } from './promise/promise.service';

// Default export all service instances
export default {
    authService,
    adminService,
    luckyNumberActivityService,
    optionDrawActivityService,
    promiseService,
};
