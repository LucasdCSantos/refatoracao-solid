class NotificationService {
  sendOrderConfirmation(customer, orderId, total) {
    console.log(`[NOTIFICAÇÃO] Pedido ${orderId} confirmado para ${customer.name} no valor de R$ ${total.toFixed(2)}.`);
  }
}

module.exports = NotificationService;