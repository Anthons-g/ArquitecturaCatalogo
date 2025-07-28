import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface PushNotificationOptions {
  token: string;
  title: string;
  body: string;
  data?: { [key: string]: string };
  imageUrl?: string;
}

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);

  constructor(private configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
      const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');

      if (projectId && privateKey && clientEmail) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey,
            clientEmail,
          }),
        });
        this.logger.log('Firebase Admin initialized successfully');
      } else {
        this.logger.warn('Firebase credentials not configured');
      }
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin:', error);
    }
  }

  async sendPushNotification(options: PushNotificationOptions): Promise<boolean> {
    try {
      const message = {
        notification: {
          title: options.title,
          body: options.body,
          imageUrl: options.imageUrl,
        },
        data: options.data || {},
        token: options.token,
        android: {
          notification: {
            icon: 'ic_notification',
            color: '#FF6B6B',
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Push notification sent successfully: ${response}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to send push notification:', error);
      return false;
    }
  }

  async sendToMultipleDevices(
    tokens: string[],
    title: string,
    body: string,
    data?: { [key: string]: string },
  ): Promise<{ successCount: number; failureCount: number }> {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: data || {},
        tokens,
      };

      const response = await admin.messaging().sendMulticast(message);
      this.logger.log(`Multicast notification sent. Success: ${response.successCount}, Failure: ${response.failureCount}`);
      
      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      this.logger.error('Failed to send multicast notification:', error);
      return { successCount: 0, failureCount: tokens.length };
    }
  }

  async sendOrderConfirmationPush(token: string, orderData: any): Promise<boolean> {
    return this.sendPushNotification({
      token,
      title: 'Order Confirmed! 🎉',
      body: `Your order ${orderData.orderNumber} has been confirmed. Total: $${orderData.totalAmount}`,
      data: {
        type: 'order_confirmed',
        orderId: orderData._id.toString(),
        orderNumber: orderData.orderNumber,
      },
    });
  }

  async sendOrderShippedPush(token: string, orderData: any): Promise<boolean> {
    return this.sendPushNotification({
      token,
      title: 'Order Shipped! 📦',
      body: `Your order ${orderData.orderNumber} is on its way. Track: ${orderData.trackingNumber}`,
      data: {
        type: 'order_shipped',
        orderId: orderData._id.toString(),
        trackingNumber: orderData.trackingNumber,
      },
    });
  }

  async sendOrderDeliveredPush(token: string, orderData: any): Promise<boolean> {
    return this.sendPushNotification({
      token,
      title: 'Order Delivered! ✅',
      body: `Your order ${orderData.orderNumber} has been delivered. Enjoy your new items!`,
      data: {
        type: 'order_delivered',
        orderId: orderData._id.toString(),
      },
    });
  }

  async sendPaymentSuccessPush(token: string, paymentData: any): Promise<boolean> {
    return this.sendPushNotification({
      token,
      title: 'Payment Successful! 💳',
      body: `Payment of $${paymentData.amount} processed successfully`,
      data: {
        type: 'payment_success',
        paymentId: paymentData.paymentId,
      },
    });
  }

  async sendPaymentFailedPush(token: string, paymentData: any): Promise<boolean> {
    return this.sendPushNotification({
      token,
      title: 'Payment Failed ❌',
      body: `Payment of $${paymentData.amount} failed. Please try again`,
      data: {
        type: 'payment_failed',
        orderId: paymentData.orderId,
      },
    });
  }

  async sendPromotionalPush(tokens: string[], promoData: any): Promise<{ successCount: number; failureCount: number }> {
    return this.sendToMultipleDevices(
      tokens,
      `🛍️ ${promoData.title}`,
      promoData.description,
      {
        type: 'promotion',
        promoCode: promoData.code,
        discount: promoData.discount.toString(),
      },
    );
  }

  async sendProductBackInStockPush(token: string, productData: any): Promise<boolean> {
    return this.sendPushNotification({
      token,
      title: 'Back in Stock! 🔥',
      body: `${productData.name} is now available. Get it before it's gone!`,
      data: {
        type: 'product_back_in_stock',
        productId: productData._id.toString(),
      },
      imageUrl: productData.images?.[0],
    });
  }
}