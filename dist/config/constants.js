"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_USER_ID = exports.PACKS = void 0;
exports.getPackByName = getPackByName;
exports.PACKS = [
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
exports.DEFAULT_USER_ID = 'seed-user';
function getPackByName(name) {
    return exports.PACKS.find((pack) => pack.name.toLowerCase() === name.toLowerCase());
}
