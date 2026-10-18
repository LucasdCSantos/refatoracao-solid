class OrderService {
  constructor({
    productRepository,
    orderRepository,
    notificationService,
    logger,
    validator,
    discountService,
    freightService,
    paymentService
  }) {
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
    this.notificationService = notificationService;
    this.logger = logger;
    this.validator = validator;
    this.discountService = discountService;
    this.freightService = freightService;
    this.paymentService = paymentService;
  }

  process(order) {
    this.logger.info(`Iniciando processamento do pedido ${order.id}.`);

    // 1. Validação do pedido e checagem de estoque
    this.validator.validate(order);

    // 2. Cálculos financeiros e frete
    const subtotal = order.getSubtotal();
    const freight = Number(this.freightService.calculate(order).toFixed(2));
    const baseDiscount = this.discountService.calculate(order, subtotal);
    const payment = this.paymentService.process(order, subtotal);

    const discount = Number((baseDiscount + payment.discount).toFixed(2));
    const paymentFee = Number(payment.fee.toFixed(2));
    const total = Number((subtotal - discount + freight + paymentFee).toFixed(2));

    if (total <= 0) {
      throw new Error("Total do pedido invalido.");
    }

    // 3. Atualização de estoque
    for (const item of order.items) {
      this.productRepository.updateStock(item.product.id, item.quantity);
    }

    // 4. Atualização de status e persistência
    order.status = payment.status === "approved" ? "confirmed" : "waiting_payment";

    const orderSummary = {
      id: order.id,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      city: order.customer.address.city,
      state: order.customer.address.state,
      items: order.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        subtotal: item.getSubtotal()
      })),
      subtotal,
      discount,
      freight,
      paymentFee,
      total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt
    };

    this.orderRepository.save(orderSummary);

    // 5. Notificação e log
    if (order.status === "confirmed") {
      this.notificationService.sendOrderConfirmation(order.customer, order.id, total);
    } else {
      this.logger.warn(`Pedido ${order.id} aguardando pagamento.`);
    }

    this.logger.info(`Pedido ${order.id} processado com sucesso. Total: R$ ${total.toFixed(2)}`);

    return orderSummary;
  }
}

module.exports = OrderService;