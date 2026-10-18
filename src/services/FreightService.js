class FreightService {
  constructor() {
    this.rates = {
      sudeste: { base: 20, multiplier: 4 },
      sul: { base: 28, multiplier: 5 },
      "centro-oeste": { base: 35, multiplier: 6 },
      nordeste: { base: 45, multiplier: 7 },
      norte: { base: 60, multiplier: 9 }
    };
    this.defaultRate = { base: 50, multiplier: 8 };
  }

  calculate(order) {
    if (order.couponCode === "FRETEGRATIS") {
      return 0;
    }

    const region = order.customer.address?.region;
    const rate = this.rates[region] || this.defaultRate;
    const totalWeight = order.getTotalWeight();

    return rate.base + totalWeight * rate.multiplier;
  }
}

module.exports = FreightService;