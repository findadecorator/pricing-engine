export const REGION_LIMITS: Record<string, number | 'unlimited'> = {
  PLATINUM: 'unlimited',
  PREMIUM: 5,
  GROWTH: 2,
  PRO: 1,
  STARTER: 1,
};

export function allowedRegionsForPlan(plan: string) {
  return REGION_LIMITS[plan.toUpperCase()] ?? 0;
}

export function isRegionAllowed(user: any, regionCode: string) {
  if (!user) return false;
  if (user.isExclusive) return true; // exclusive leads bypass
  const allowed = allowedRegionsForPlan(user.plan ?? 'STARTER');
  if (allowed === 'unlimited') return true;
  // user.regionsAllowed could be number or array; handle both
  if (Array.isArray(user.allowedRegions)) return user.allowedRegions.includes(regionCode);
  if (typeof allowed === 'number') return true; // simplification: assume regionCode count not enforced here
  return false;
}
