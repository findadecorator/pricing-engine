"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGION_LIMITS = void 0;
exports.allowedRegionsForPlan = allowedRegionsForPlan;
exports.isRegionAllowed = isRegionAllowed;
exports.REGION_LIMITS = {
    PLATINUM: 'unlimited',
    PREMIUM: 5,
    GROWTH: 2,
    PRO: 1,
    STARTER: 1,
};
function allowedRegionsForPlan(plan) {
    return exports.REGION_LIMITS[plan.toUpperCase()] ?? 0;
}
function isRegionAllowed(user, regionCode) {
    if (!user)
        return false;
    if (user.isExclusive)
        return true; // exclusive leads bypass
    const allowed = allowedRegionsForPlan(user.plan ?? 'STARTER');
    if (allowed === 'unlimited')
        return true;
    // user.regionsAllowed could be number or array; handle both
    if (Array.isArray(user.allowedRegions))
        return user.allowedRegions.includes(regionCode);
    if (typeof allowed === 'number')
        return true; // simplification: assume regionCode count not enforced here
    return false;
}
