import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

export interface SMSOptions {
  to: string;
  message: string;
}

@Injectable()
export class SMSService {
  private readonly logger = new Logger(SMSService.name);
  private twilioClient: Twilio | null = null;
  private fromNumber: string;
  private isConfigured: boolean = false;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');

    // Verificar que las credenciales estén configuradas y sean válidas
    if (
      accountSid &&
      authToken &&
      accountSid.startsWith('AC') &&
      this.fromNumber
    ) {
      try {
        this.twilioClient = new Twilio(accountSid, authToken);
        this.isConfigured = true;
        this.logger.log('Twilio SMS service configured successfully');
      } catch (error) {
        this.logger.warn('Failed to initialize Twilio client:', error.message);
        this.isConfigured = false;
      }
    } else {
      this.logger.warn(
        'Twilio SMS service not configured - missing or invalid credentials'
      );
      this.isConfigured = false;
    }
  }

  async sendSMS(options: SMSOptions): Promise<boolean> {
    if (!this.twilioClient) {
      this.logger.error('Twilio client not initialized');
      return false;
    }

    try {
      const message = await this.twilioClient.messages.create({
        body: options.message,
        from: this.fromNumber,
        to: options.to,
      });

      this.logger.log(
        `SMS sent successfully to ${options.to}, SID: ${message.sid}`
      );
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${options.to}:`, error);
      return false;
    }
  }

  async sendOrderConfirmationSMS(
    phone: string,
    orderData: any
  ): Promise<boolean> {
    const message = `Hi ${orderData.customerName}! Your order ${orderData.orderNumber} has been confirmed. Total: $${orderData.totalAmount}. We'll notify you when it ships. - Fashion Store`;

    return this.sendSMS({
      to: phone,
      message,
    });
  }

  async sendOrderShippedSMS(phone: string, orderData: any): Promise<boolean> {
    const message = `Great news! Your order ${orderData.orderNumber} has shipped. Tracking: ${orderData.trackingNumber}. Expected delivery: 3-5 days. - Fashion Store`;

    return this.sendSMS({
      to: phone,
      message,
    });
  }

  async sendOrderDeliveredSMS(phone: string, orderData: any): Promise<boolean> {
    const message = `Your order ${orderData.orderNumber} has been delivered! Thank you for shopping with Fashion Store. Rate your experience: [link]`;

    return this.sendSMS({
      to: phone,
      message,
    });
  }

  async sendPaymentFailedSMS(
    phone: string,
    paymentData: any
  ): Promise<boolean> {
    const message = `Payment failed for order ${paymentData.orderNumber}. Please update your payment method to complete your purchase. - Fashion Store`;

    return this.sendSMS({
      to: phone,
      message,
    });
  }

  async sendPromotionalSMS(phone: string, promoData: any): Promise<boolean> {
    const message = `🛍️ ${promoData.title}: ${promoData.description} Use code: ${promoData.code}. Valid until ${promoData.expiryDate}. Shop now! - Fashion Store`;

    return this.sendSMS({
      to: phone,
      message,
    });
  }
}
