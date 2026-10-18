class PaymentService {
  process(order, subtotal) {
    let paymentFee = 0;
    let paymentDiscount = 0;
    let status = "pending";

    switch (order.paymentMethod) {
      case "pix":
        status = "approved";
        paymentDiscount = subtotal * 0.03;
        break;

      case "credit_card":
        if (order.installments > 1) {
          paymentFee = subtotal * 0.025;
        }
        status = "approved";
        break;

      case "boleto":
        status = "waiting_payment";
        break;

      default:
        throw new Error("Forma de pagamento invalida.");
    }

    return {
      fee: paymentFee,
      discount: paymentDiscount,
      status
    };
  }
}

module.exports = PaymentService;