export type PricingPack = {
  name: string;
  credits: number;
  price: number;
  description: string;
};

export const PACKS: PricingPack[] = [
  {
    name: 'Small Pack',
    credits: 30,
    price: 9.99,
    description: 'Starter credits for a first transaction',
  },
  {
    name: 'Growth Pack',
    credits: 100,
    price: 24.99,
    description: 'Balanced credits for frequent usage',
  },
  {
    name: 'Scale Pack',
    credits: 250,
    price: 49.99,
    description: 'High-volume credits for scaling teams',
  },
];

export const DEFAULT_USER_ID = 'seed-user';

export function getPackByName(name: string): PricingPack | undefined {
  return PACKS.find((pack) => pack.name.toLowerCase() === name.toLowerCase());
}
