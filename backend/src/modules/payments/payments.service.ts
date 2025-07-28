import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from './entities/payment.entity';
import {
  Order,
  PaymentStatus as OrderPaymentStatus,
} from '@core/domain/entities/order.entity';
import { User } from '@core/domain/entities/user.entity';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { EventHandlerService } from '@shared/patterns/event-handler.service';
import axios from 'axios';
import * as crypto from 'crypto';
import { Logger } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    private notificationsService: NotificationsService,
    private eventHandlerService: EventHandlerService
  ) {}

  async processPayment(
    userId: string,
    processPaymentDto: ProcessPaymentDto
  ): Promise<Payment> {
    const { orderId, method, paymentDetails } = processPaymentDto;

    const order = await this.orderModel.findOne({ _id: orderId, userId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.paymentStatus === OrderPaymentStatus.PAID) {
      throw new BadRequestException('Order is already paid');
    }

    // Generate payment ID
    const paymentId = await this.generatePaymentId();

    // Create payment record
    const payment = new this.paymentModel({
      paymentId,
      orderId,
      userId,
      amount: order.totalAmount,
      method,
      status: PaymentStatus.PROCESSING,
    });

    try {
      // Process payment based on method
      const result = await this.processPaymentByMethod(method, {
        amount: order.totalAmount,
        currency: 'USD',
        paymentDetails,
        orderId: order.orderNumber,
      });

      // Update payment with transaction details
      payment.transactionId = result.transactionId;
      payment.gatewayResponse = result.gatewayResponse;
      payment.status = result.success
        ? PaymentStatus.COMPLETED
        : PaymentStatus.FAILED;
      payment.processedAt = new Date();

      if (!result.success) {
        payment.failureReason = result.error;
      }

      await payment.save();

      // Get user data for notifications
      const user = await this.userModel.findById(userId);

      // Send payment notifications
      try {
        const paymentData = {
          ...payment.toObject(),
          orderNumber: order.orderNumber,
          customerName: user
            ? `${user.firstName} ${user.lastName}`
            : 'Customer',
          customerEmail: user?.email,
        };

        if (result.success) {
          await this.notificationsService.sendPaymentSuccess(
            userId,
            paymentData
          );
        } else {
          await this.notificationsService.sendPaymentFailed(
            userId,
            paymentData
          );
        }

        // Emit payment processed event
        this.eventHandlerService.emitPaymentProcessed({
          paymentId: payment.paymentId,
          orderId: orderId.toString(),
          userId,
          success: result.success,
          paymentData,
        });
      } catch (error) {
        console.error('Failed to send payment notification:', error);
        // Don't fail payment processing if notification fails
      }

      // Update order payment status
      if (result.success) {
        await this.orderModel.findByIdAndUpdate(orderId, {
          paymentStatus: OrderPaymentStatus.PAID,
          paymentId: payment.paymentId,
        });
      }

      return payment;
    } catch (error) {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = error.message;
      await payment.save();
      throw error;
    }
  }

  async refundPayment(
    paymentId: string,
    refundPaymentDto: RefundPaymentDto
  ): Promise<Payment> {
    const payment = await this.paymentModel.findOne({ paymentId });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment cannot be refunded');
    }

    const { amount, reason } = refundPaymentDto;
    const refundAmount = amount || payment.amount;

    try {
      // Process refund based on original payment method
      const result = await this.processRefundByMethod(payment.method, {
        transactionId: payment.transactionId,
        amount: refundAmount,
        reason,
      });

      // Update payment record
      payment.refundId = result.refundId;
      payment.refundAmount = refundAmount;
      payment.status = PaymentStatus.REFUNDED;
      await payment.save();

      // Update order status
      await this.orderModel.findByIdAndUpdate(payment.orderId, {
        paymentStatus: OrderPaymentStatus.REFUNDED,
      });

      return payment;
    } catch (error) {
      throw new BadRequestException(`Refund failed: ${error.message}`);
    }
  }

  async findPaymentsByUser(userId: string): Promise<any[]> {
    const payments = await this.paymentModel
      .find({ userId })
      .populate('orderId', 'orderNumber totalAmount')
      .sort({ createdAt: -1 });

    // Transform the populated data to avoid React rendering issues
    return payments.map((payment) => {
      const paymentObj = payment.toObject() as any;
      if (paymentObj.orderId && typeof paymentObj.orderId === 'object') {
        paymentObj.order = {
          orderNumber: paymentObj.orderId.orderNumber,
          totalAmount: paymentObj.orderId.totalAmount,
        };
        paymentObj.orderId = paymentObj.orderId._id;
      }
      return paymentObj;
    });
  }

  async findPaymentByOrder(orderId: string): Promise<Payment> {
    return this.paymentModel.findOne({ orderId });
  }

  private async processPaymentByMethod(
    method: PaymentMethod,
    paymentData: any
  ): Promise<any> {
    // Mock payment processing - replace with actual payment gateway integration
    switch (method) {
      case PaymentMethod.STRIPE:
        return this.processStripePayment(paymentData);
      case PaymentMethod.PAYPAL:
        return this.processPayPalPayment(paymentData);
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
        return this.processCreditCardPayment(paymentData);
      default:
        throw new BadRequestException('Unsupported payment method');
    }
  }

  private async processRefundByMethod(
    method: PaymentMethod,
    refundData: any
  ): Promise<any> {
    // Mock refund processing - replace with actual payment gateway integration
    switch (method) {
      case PaymentMethod.STRIPE:
        return this.processStripeRefund(refundData);
      case PaymentMethod.PAYPAL:
        return this.processPayPalRefund(refundData);
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
        return this.processCreditCardRefund(refundData);
      default:
        throw new BadRequestException('Unsupported refund method');
    }
  }

  // PayPal Payment Processing using PayPal REST API
  private async processPayPalPayment(data: any): Promise<any> {
    try {
      const { amount, currency, paymentDetails, orderId } = data;

      // Get PayPal access token
      const accessToken = await this.getPayPalAccessToken();

      // Create PayPal payment
      const paymentRequest = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: orderId,
            amount: {
              currency_code: currency || 'USD',
              value: amount.toFixed(2),
            },
            description: `Payment for order ${orderId}`,
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              brand_name: 'Fashion Store',
              locale: 'en-US',
              landing_page: 'LOGIN',
              user_action: 'PAY_NOW',
              return_url: `${process.env.FRONTEND_URL}/payment/success`,
              cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            },
          },
        },
      };

      const response = await axios.post(
        `${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
        paymentRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'PayPal-Request-Id': this.generateRequestId(),
          },
        }
      );

      if (response.data.status === 'CREATED') {
        // For immediate capture, capture the payment
        const captureResponse = await this.capturePayPalPayment(
          response.data.id,
          accessToken
        );

        return {
          success: captureResponse.status === 'COMPLETED',
          transactionId: response.data.id,
          gatewayResponse: captureResponse,
          error:
            captureResponse.status !== 'COMPLETED'
              ? 'Payment capture failed'
              : null,
        };
      }

      return {
        success: false,
        transactionId: null,
        gatewayResponse: response.data,
        error: 'Payment creation failed',
      };
    } catch (error) {
      console.error(
        'PayPal payment error:',
        error.response?.data || error.message
      );
      return {
        success: false,
        transactionId: null,
        gatewayResponse: error.response?.data,
        error: error.response?.data?.message || 'PayPal payment failed',
      };
    }
  }

  private async processCreditCardPayment(data: any): Promise<any> {
    try {
      const { amount, currency, paymentDetails, orderId } = data;
      const { cardNumber, expiryMonth, expiryYear, cvc, cardholderName } =
        paymentDetails;

      // Create payment intent with Stripe
      const paymentIntentRequest = {
        amount: Math.round(amount * 100), // Stripe expects amount in cents
        currency: currency?.toLowerCase() || 'usd',
        payment_method_data: {
          type: 'card',
          card: {
            number: cardNumber.replace(/\s/g, ''),
            exp_month: parseInt(expiryMonth),
            exp_year: parseInt(expiryYear),
            cvc: cvc,
          },
          billing_details: {
            name: cardholderName,
          },
        },
        confirmation_method: 'manual',
        confirm: true,
        metadata: {
          order_id: orderId,
        },
      };

      const response = await axios.post(
        'https://api.stripe.com/v1/payment_intents',
        new URLSearchParams(
          this.flattenObject(paymentIntentRequest)
        ).toString(),
        {
          headers: {
            Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const paymentIntent = response.data;

      return {
        success: paymentIntent.status === 'succeeded',
        transactionId: paymentIntent.id,
        gatewayResponse: paymentIntent,
        error:
          paymentIntent.status !== 'succeeded'
            ? paymentIntent.last_payment_error?.message
            : null,
      };
    } catch (error) {
      console.error(
        'Credit card payment error:',
        error.response?.data || error.message
      );
      return {
        success: false,
        transactionId: null,
        gatewayResponse: error.response?.data,
        error:
          error.response?.data?.error?.message || 'Credit card payment failed',
      };
    }
  }

  private async processStripePayment(data: any): Promise<any> {
    try {
      const { amount, currency, paymentDetails, orderId } = data;

      const paymentIntentRequest = {
        amount: Math.round(amount * 100).toString(), // Stripe expects amount in cents as string
        currency: currency?.toLowerCase() || 'usd',
        payment_method: paymentDetails.paymentMethodId,
        confirmation_method: 'manual',
        confirm: 'true',
        'metadata[order_id]': orderId.toString(),
      };

      const response = await axios.post(
        'https://api.stripe.com/v1/payment_intents',
        new URLSearchParams(paymentIntentRequest).toString(),
        {
          headers: {
            Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const paymentIntent = response.data;

      return {
        success: paymentIntent.status === 'succeeded',
        transactionId: paymentIntent.id,
        gatewayResponse: paymentIntent,
        error:
          paymentIntent.status !== 'succeeded'
            ? paymentIntent.last_payment_error?.message
            : null,
      };
    } catch (error) {
      console.error(
        'Stripe payment error:',
        error.response?.data || error.message
      );
      return {
        success: false,
        transactionId: null,
        gatewayResponse: error.response?.data,
        error: error.response?.data?.error?.message || 'Stripe payment failed',
      };
    }
  }

  // PayPal Helper Methods
  private async getPayPalAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString('base64');

      const response = await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error(
        'PayPal token error:',
        error.response?.data || error.message
      );
      throw new BadRequestException('Failed to get PayPal access token');
    }
  }

  private async capturePayPalPayment(
    orderId: string,
    accessToken: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'PayPal-Request-Id': this.generateRequestId(),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        'PayPal capture error:',
        error.response?.data || error.message
      );
      throw new BadRequestException('Failed to capture PayPal payment');
    }
  }

  // Refund Methods with Real API Integration
  private async processStripeRefund(data: any): Promise<any> {
    try {
      const { transactionId, amount, reason } = data;

      const refundRequest = {
        payment_intent: transactionId,
        amount: Math.round(amount * 100).toString(), // Stripe expects amount in cents as string
        reason: reason || 'requested_by_customer',
      };

      const response = await axios.post(
        'https://api.stripe.com/v1/refunds',
        new URLSearchParams(refundRequest).toString(),
        {
          headers: {
            Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return {
        refundId: response.data.id,
        status: response.data.status,
      };
    } catch (error) {
      console.error(
        'Stripe refund error:',
        error.response?.data || error.message
      );
      throw new BadRequestException('Stripe refund failed');
    }
  }

  private async processPayPalRefund(data: any): Promise<any> {
    try {
      const { transactionId, amount, reason } = data;
      const accessToken = await this.getPayPalAccessToken();

      const refundRequest = {
        amount: {
          value: amount.toFixed(2),
          currency_code: 'USD',
        },
        note_to_payer: reason || 'Refund processed',
      };

      const response = await axios.post(
        `${process.env.PAYPAL_API_URL}/v2/payments/captures/${transactionId}/refund`,
        refundRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'PayPal-Request-Id': this.generateRequestId(),
          },
        }
      );

      return {
        refundId: response.data.id,
        status: response.data.status,
      };
    } catch (error) {
      console.error(
        'PayPal refund error:',
        error.response?.data || error.message
      );
      throw new BadRequestException('PayPal refund failed');
    }
  }

  private async processCreditCardRefund(data: any): Promise<any> {
    // For credit cards processed through Stripe, use Stripe refund
    return this.processStripeRefund(data);
  }

  // Utility Methods
  private generateRequestId(): string {
    return crypto.randomUUID();
  }

  private flattenObject(obj: any, prefix = ''): any {
    const flattened = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}[${key}]` : key;

        if (
          typeof obj[key] === 'object' &&
          obj[key] !== null &&
          !Array.isArray(obj[key])
        ) {
          Object.assign(flattened, this.flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }

    return flattened;
  }

  private async generatePaymentId(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PAY${timestamp}${random}`;
  }

  // Webhook Methods
  async verifyPayPalWebhook(
    payload: any,
    headers: Record<string, string>,
    rawBody: Buffer
  ): Promise<boolean> {
    try {
      const webhookId = process.env.PAYPAL_WEBHOOK_ID;
      if (!webhookId) {
        this.logger.warn('PayPal webhook ID not configured');
        return false;
      }

      const accessToken = await this.getPayPalAccessToken();

      // PayPal webhook verification request
      const verificationRequest = {
        auth_algo: headers['paypal-auth-algo'],
        cert_id: headers['paypal-cert-id'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: webhookId,
        webhook_event: payload,
      };

      const response = await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`,
        verificationRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data.verification_status === 'SUCCESS';
    } catch (error) {
      this.logger.error('PayPal webhook verification failed:', error);
      return false;
    }
  }

  async verifyStripeWebhook(rawBody: Buffer, signature: string): Promise<any> {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!endpointSecret) {
        throw new BadRequestException('Stripe webhook secret not configured');
      }

      // Verify Stripe webhook signature
      const elements = signature.split(',');
      const signatureElements = {};

      for (const element of elements) {
        const [key, value] = element.split('=');
        signatureElements[key] = value;
      }

      const timestamp = signatureElements['t'];
      const signatures = [signatureElements['v1']];

      if (!timestamp || !signatures[0]) {
        throw new BadRequestException('Invalid signature format');
      }

      // Create expected signature
      const payload = timestamp + '.' + rawBody.toString();
      const expectedSignature = crypto
        .createHmac('sha256', endpointSecret)
        .update(payload, 'utf8')
        .digest('hex');

      // Compare signatures
      const isValid = signatures.some((sig) =>
        crypto.timingSafeEqual(
          Buffer.from(expectedSignature, 'hex'),
          Buffer.from(sig, 'hex')
        )
      );

      if (!isValid) {
        throw new BadRequestException('Invalid signature');
      }

      // Parse the event
      return JSON.parse(rawBody.toString());
    } catch (error) {
      this.logger.error('Stripe webhook verification failed:', error);
      throw new BadRequestException('Webhook verification failed');
    }
  }

  async handlePayPalWebhook(payload: any): Promise<any> {
    const { event_type, resource } = payload;

    this.logger.log(`Processing PayPal webhook: ${event_type}`);

    try {
      switch (event_type) {
        case 'PAYMENT.CAPTURE.COMPLETED':
          return await this.handlePayPalPaymentCompleted(resource);

        case 'PAYMENT.CAPTURE.DENIED':
          return await this.handlePayPalPaymentDenied(resource);

        case 'PAYMENT.CAPTURE.REFUNDED':
          return await this.handlePayPalPaymentRefunded(resource);

        case 'CHECKOUT.ORDER.APPROVED':
          return await this.handlePayPalOrderApproved(resource);

        default:
          this.logger.log(`Unhandled PayPal webhook event: ${event_type}`);
          return { status: 'ignored', event_type };
      }
    } catch (error) {
      this.logger.error(
        `PayPal webhook handling failed for ${event_type}:`,
        error
      );
      throw error;
    }
  }

  async handleStripeWebhook(event: any): Promise<any> {
    const { type, data } = event;

    this.logger.log(`Processing Stripe webhook: ${type}`);

    try {
      switch (type) {
        case 'payment_intent.succeeded':
          return await this.handleStripePaymentSucceeded(data.object);

        case 'payment_intent.payment_failed':
          return await this.handleStripePaymentFailed(data.object);

        case 'charge.dispute.created':
          return await this.handleStripeChargeDispute(data.object);

        case 'invoice.payment_succeeded':
          return await this.handleStripeInvoicePaymentSucceeded(data.object);

        default:
          this.logger.log(`Unhandled Stripe webhook event: ${type}`);
          return { status: 'ignored', event_type: type };
      }
    } catch (error) {
      this.logger.error(`Stripe webhook handling failed for ${type}:`, error);
      throw error;
    }
  }

  // PayPal Webhook Handlers
  private async handlePayPalPaymentCompleted(resource: any): Promise<any> {
    const { id, amount, custom_id } = resource;

    try {
      // Find payment by transaction ID or custom ID
      const payment = await this.paymentModel.findOne({
        $or: [{ transactionId: id }, { paymentId: custom_id }],
      });

      if (payment && payment.status !== PaymentStatus.COMPLETED) {
        payment.status = PaymentStatus.COMPLETED;
        payment.processedAt = new Date();
        await payment.save();

        // Update order status
        await this.orderModel.findByIdAndUpdate(payment.orderId, {
          paymentStatus: OrderPaymentStatus.PAID,
        });

        this.logger.log(`PayPal payment completed: ${id}`);
      }

      return { status: 'processed', payment_id: id };
    } catch (error) {
      this.logger.error('PayPal payment completion handling failed:', error);
      throw error;
    }
  }

  private async handlePayPalPaymentDenied(resource: any): Promise<any> {
    const { id, custom_id } = resource;

    try {
      const payment = await this.paymentModel.findOne({
        $or: [{ transactionId: id }, { paymentId: custom_id }],
      });

      if (payment && payment.status !== PaymentStatus.FAILED) {
        payment.status = PaymentStatus.FAILED;
        payment.failureReason = 'Payment denied by PayPal';
        await payment.save();

        this.logger.log(`PayPal payment denied: ${id}`);
      }

      return { status: 'processed', payment_id: id };
    } catch (error) {
      this.logger.error('PayPal payment denial handling failed:', error);
      throw error;
    }
  }

  private async handlePayPalPaymentRefunded(resource: any): Promise<any> {
    const { id, amount } = resource;

    try {
      const payment = await this.paymentModel.findOne({ transactionId: id });

      if (payment) {
        payment.status = PaymentStatus.REFUNDED;
        payment.refundAmount = parseFloat(amount.value);
        payment.refundId = resource.id;
        await payment.save();

        // Update order status
        await this.orderModel.findByIdAndUpdate(payment.orderId, {
          paymentStatus: OrderPaymentStatus.REFUNDED,
        });

        this.logger.log(`PayPal payment refunded: ${id}`);
      }

      return { status: 'processed', refund_id: resource.id };
    } catch (error) {
      this.logger.error('PayPal refund handling failed:', error);
      throw error;
    }
  }

  private async handlePayPalOrderApproved(resource: any): Promise<any> {
    const { id } = resource;

    this.logger.log(`PayPal order approved: ${id}`);

    // This is typically handled in the frontend flow
    // but we can log it for tracking purposes
    return { status: 'logged', order_id: id };
  }

  // Stripe Webhook Handlers
  private async handleStripePaymentSucceeded(paymentIntent: any): Promise<any> {
    const { id, amount, metadata } = paymentIntent;

    try {
      const payment = await this.paymentModel.findOne({ transactionId: id });

      if (payment && payment.status !== PaymentStatus.COMPLETED) {
        payment.status = PaymentStatus.COMPLETED;
        payment.processedAt = new Date();
        await payment.save();

        // Update order status
        await this.orderModel.findByIdAndUpdate(payment.orderId, {
          paymentStatus: OrderPaymentStatus.PAID,
        });

        this.logger.log(`Stripe payment succeeded: ${id}`);
      }

      return { status: 'processed', payment_intent_id: id };
    } catch (error) {
      this.logger.error('Stripe payment success handling failed:', error);
      throw error;
    }
  }

  private async handleStripePaymentFailed(paymentIntent: any): Promise<any> {
    const { id, last_payment_error } = paymentIntent;

    try {
      const payment = await this.paymentModel.findOne({ transactionId: id });

      if (payment && payment.status !== PaymentStatus.FAILED) {
        payment.status = PaymentStatus.FAILED;
        payment.failureReason = last_payment_error?.message || 'Payment failed';
        await payment.save();

        this.logger.log(`Stripe payment failed: ${id}`);
      }

      return { status: 'processed', payment_intent_id: id };
    } catch (error) {
      this.logger.error('Stripe payment failure handling failed:', error);
      throw error;
    }
  }

  private async handleStripeChargeDispute(dispute: any): Promise<any> {
    const { id, charge, reason } = dispute;

    try {
      // Find payment by charge ID
      const payment = await this.paymentModel.findOne({
        'gatewayResponse.charges.data.id': charge,
      });

      if (payment) {
        // Mark payment as disputed
        payment.status = PaymentStatus.FAILED;
        payment.failureReason = `Disputed: ${reason}`;
        await payment.save();

        this.logger.log(`Stripe charge disputed: ${id}`);
      }

      return { status: 'processed', dispute_id: id };
    } catch (error) {
      this.logger.error('Stripe dispute handling failed:', error);
      throw error;
    }
  }

  private async handleStripeInvoicePaymentSucceeded(
    invoice: any
  ): Promise<any> {
    const { id, subscription } = invoice;

    this.logger.log(`Stripe invoice payment succeeded: ${id}`);

    // Handle subscription payments if applicable
    return { status: 'logged', invoice_id: id };
  }
}
