import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: any;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    } else {
      this.logger.warn('SendGrid API key not configured');
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const msg = {
        to: options.to,
        from: {
          email: this.configService.get<string>('FROM_EMAIL'),
          name: this.configService.get<string>('FROM_NAME'),
        },
        subject: options.subject,
        text: options.text,
        html: options.html,
        templateId: options.templateId,
        dynamicTemplateData: options.dynamicTemplateData,
      };

      await sgMail.send(msg);
      this.logger.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  async sendOrderConfirmationEmail(
    email: string,
    orderData: any
  ): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Dear ${orderData.customerName},</p>
        <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
          <p><strong>Total Amount:</strong> $${orderData.totalAmount}</p>
          <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString()}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3>Items Ordered</h3>
          ${orderData.items
            .map(
              (item: any) => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
              <p><strong>${item.productName}</strong></p>
              <p>Quantity: ${item.quantity} | Price: $${item.unitPrice}</p>
              ${item.size ? `<p>Size: ${item.size}</p>` : ''}
              ${item.color ? `<p>Color: ${item.color}</p>` : ''}
            </div>
          `
            )
            .join('')}
        </div>

        <div style="background-color: #f0f8ff; padding: 20px; margin: 20px 0;">
          <h3>Shipping Address</h3>
          <p>${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}</p>
          <p>${orderData.shippingAddress.street}</p>
          <p>${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}</p>
          <p>${orderData.shippingAddress.country}</p>
        </div>

        <p>We'll send you another email when your order ships.</p>
        <p>Thank you for shopping with us!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>Fashion Store | E-commerce Platform</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      html,
    });
  }

  async sendOrderShippedEmail(email: string, orderData: any): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Order Has Shipped!</h2>
        <p>Dear ${orderData.customerName},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
          <h3>Shipping Details</h3>
          <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
          <p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>
          <p><strong>Shipped Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <p>You can track your package using the tracking number above.</p>
        <p>Estimated delivery: 3-5 business days</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>Fashion Store | E-commerce Platform</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Your Order Has Shipped - ${orderData.orderNumber}`,
      html,
    });
  }

  async sendWelcomeEmail(email: string, userData: any): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Fashion Store!</h2>
        <p>Dear ${userData.firstName},</p>
        <p>Welcome to our fashion community! We're excited to have you join us.</p>
        
        <div style="background-color: #f0f8ff; padding: 20px; margin: 20px 0;">
          <h3>What's Next?</h3>
          <ul>
            <li>Browse our latest collections</li>
            <li>Get exclusive member discounts</li>
            <li>Enjoy free shipping on orders over $100</li>
            <li>Stay updated with fashion trends</li>
          </ul>
        </div>

        <p>Start shopping now and discover your new favorite pieces!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>Fashion Store | E-commerce Platform</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Fashion Store!',
      html,
    });
  }

  async sendPaymentFailedEmail(
    email: string,
    paymentData: any
  ): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Payment Failed</h2>
        <p>Dear Customer,</p>
        <p>We were unable to process your payment for order ${paymentData.orderNumber}.</p>
        
        <div style="background-color: #ffebee; padding: 20px; margin: 20px 0; border-left: 4px solid #d32f2f;">
          <h3>Payment Details</h3>
          <p><strong>Amount:</strong> $${paymentData.amount}</p>
          <p><strong>Order Number:</strong> ${paymentData.orderNumber}</p>
          <p><strong>Reason:</strong> ${paymentData.failureReason || 'Payment declined'}</p>
        </div>

        <p>Please try again with a different payment method or contact your bank.</p>
        <p>Your order is still reserved for 24 hours.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>Fashion Store | E-commerce Platform</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Payment Failed - ${paymentData.orderNumber}`,
      html,
    });
  }
}
