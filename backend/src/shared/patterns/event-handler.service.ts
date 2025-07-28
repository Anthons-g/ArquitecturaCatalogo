import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  orderData: any;
  deviceToken?: string;
}

export interface PaymentProcessedEvent {
  paymentId: string;
  orderId: string;
  userId: string;
  success: boolean;
  paymentData: any;
}

export interface UserRegisteredEvent {
  userId: string;
  userData: any;
}

export interface ProductStockUpdatedEvent {
  productId: string;
  previousStock: number;
  currentStock: number;
  productData: any;
}

@Injectable()
export class EventHandlerService {
  constructor(private eventEmitter: EventEmitter2) {}

  // Event emitters
  emitOrderCreated(event: OrderCreatedEvent) {
    this.eventEmitter.emit('order.created', event);
  }

  emitOrderShipped(orderId: string, orderData: any, deviceToken?: string) {
    this.eventEmitter.emit('order.shipped', { orderId, orderData, deviceToken });
  }

  emitOrderDelivered(orderId: string, orderData: any, deviceToken?: string) {
    this.eventEmitter.emit('order.delivered', { orderId, orderData, deviceToken });
  }

  emitPaymentProcessed(event: PaymentProcessedEvent) {
    this.eventEmitter.emit('payment.processed', event);
  }

  emitUserRegistered(event: UserRegisteredEvent) {
    this.eventEmitter.emit('user.registered', event);
  }

  emitProductStockUpdated(event: ProductStockUpdatedEvent) {
    this.eventEmitter.emit('product.stock.updated', event);
  }

  // Event listeners
  @OnEvent('order.created')
  async handleOrderCreated(event: OrderCreatedEvent) {
    console.log(`Order created event received: ${event.orderId}`);
    // This will be handled by NotificationsService
  }

  @OnEvent('order.shipped')
  async handleOrderShipped(event: any) {
    console.log(`Order shipped event received: ${event.orderId}`);
    // This will be handled by NotificationsService
  }

  @OnEvent('order.delivered')
  async handleOrderDelivered(event: any) {
    console.log(`Order delivered event received: ${event.orderId}`);
    // This will be handled by NotificationsService
  }

  @OnEvent('payment.processed')
  async handlePaymentProcessed(event: PaymentProcessedEvent) {
    console.log(`Payment processed event received: ${event.paymentId}, Success: ${event.success}`);
    // This will be handled by NotificationsService
  }

  @OnEvent('user.registered')
  async handleUserRegistered(event: UserRegisteredEvent) {
    console.log(`User registered event received: ${event.userId}`);
    // This will be handled by NotificationsService
  }

  @OnEvent('product.stock.updated')
  async handleProductStockUpdated(event: ProductStockUpdatedEvent) {
    console.log(`Product stock updated: ${event.productId}, Stock: ${event.currentStock}`);
    
    // If product was out of stock and now has stock, notify interested users
    if (event.previousStock === 0 && event.currentStock > 0) {
      this.eventEmitter.emit('product.back.in.stock', {
        productId: event.productId,
        productData: event.productData,
      });
    }
  }

  @OnEvent('product.back.in.stock')
  async handleProductBackInStock(event: any) {
    console.log(`Product back in stock: ${event.productId}`);
    // This will be handled by NotificationsService to notify users who were waiting
  }
}