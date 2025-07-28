import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Headers,
  RawBodyRequest,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  // Protected routes (require authentication)
  @Post('process')
  @UseGuards(AuthGuard('jwt'))
  processPayment(@Request() req, @Body() processPaymentDto: ProcessPaymentDto) {
    return this.paymentsService.processPayment(req.user.id, processPaymentDto);
  }

  @Post(':paymentId/refund')
  @UseGuards(AuthGuard('jwt'))
  refundPayment(
    @Param('paymentId') paymentId: string,
    @Body() refundPaymentDto: RefundPaymentDto
  ) {
    return this.paymentsService.refundPayment(paymentId, refundPaymentDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findUserPayments(@Request() req) {
    return this.paymentsService.findPaymentsByUser(req.user.id);
  }

  @Get('order/:orderId')
  @UseGuards(AuthGuard('jwt'))
  findPaymentByOrder(@Param('orderId') orderId: string) {
    return this.paymentsService.findPaymentByOrder(orderId);
  }

  // Webhook routes (no authentication required)
  @Post('webhook/paypal')
  @HttpCode(HttpStatus.OK)
  async handlePayPalWebhook(
    @Body() payload: any,
    @Headers() headers: Record<string, string>,
    @Req() req: RawBodyRequest<Request>
  ) {
    this.logger.log('PayPal webhook received');

    try {
      // Verify PayPal webhook signature
      const isValid = await this.paymentsService.verifyPayPalWebhook(
        payload,
        headers,
        req.rawBody
      );

      if (!isValid) {
        this.logger.error('Invalid PayPal webhook signature');
        return { status: 'error', message: 'Invalid signature' };
      }

      // Process PayPal webhook event
      const result = await this.paymentsService.handlePayPalWebhook(payload);

      this.logger.log(`PayPal webhook processed: ${payload.event_type}`);
      return { status: 'success', data: result };
    } catch (error) {
      this.logger.error('PayPal webhook error:', error);
      return { status: 'error', message: error.message };
    }
  }

  @Post('webhook/stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>
  ) {
    this.logger.log('Stripe webhook received');

    try {
      // Verify Stripe webhook signature
      const event = await this.paymentsService.verifyStripeWebhook(
        req.rawBody,
        signature
      );

      // Process Stripe webhook event
      const result = await this.paymentsService.handleStripeWebhook(event);

      this.logger.log(`Stripe webhook processed: ${event.type}`);
      return { status: 'success', data: result };
    } catch (error) {
      this.logger.error('Stripe webhook error:', error);
      return { status: 'error', message: error.message };
    }
  }

  // Health check for webhooks
  @Get('webhook/health')
  @HttpCode(HttpStatus.OK)
  webhookHealthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      webhooks: {
        paypal: '/api/payments/webhook/paypal',
        stripe: '/api/payments/webhook/stripe',
      },
    };
  }
}
