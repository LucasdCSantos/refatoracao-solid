class DiscountService {
  calculate(order, subtotal) {
    let discount = 0;

    // Desconto por perfil de cliente
    if (order.customer.type === "vip") {
      discount += subtotal * 0.08;
    } else if (order.customer.type === "employee") {
      discount += subtotal * 0.15;
    }

    // Desconto por cupom promocional
    if (order.couponCode === "TECH10") {
      discount += subtotal * 0.1;
    }

    // Desconto progressivo por volume de compra
    if (subtotal > 8000) {
      discount += 250;
    }

    return discount;
  }
}

module.exports = DiscountService;