"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailablePacks = getAvailablePacks;
exports.calculatePriceForCredits = calculatePriceForCredits;
const constants_1 = require("../config/constants");
const math_1 = require("../utils/math");
function getAvailablePacks() {
    return constants_1.PACKS;
}
function calculatePriceForCredits(credits) {
    const matchingPack = constants_1.PACKS.find((pack) => pack.credits === credits);
    if (matchingPack) {
        return matchingPack.price;
    }
    return (0, math_1.roundCurrency)(credits * 0.35);
}
