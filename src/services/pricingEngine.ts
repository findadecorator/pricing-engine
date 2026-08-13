import { PACKS, PricingPack } from '../config/constants';
import { roundCurrency } from '../utils/math';

export function getAvailablePacks(): PricingPack[] {
  return PACKS;
}

export function calculatePriceForCredits(credits: number): number {
  const matchingPack = PACKS.find((pack) => pack.credits === credits);
  if (matchingPack) {
    return matchingPack.price;
  }

  return roundCurrency(credits * 0.35);
}
