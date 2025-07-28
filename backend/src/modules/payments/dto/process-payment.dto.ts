import { IsString, IsEnum, IsObject, IsOptional } from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';

export class ProcessPaymentDto {
  @IsString()
  orderId: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsObject()
  paymentDetails: {
    // For credit/debit cards
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    cardHolderName?: string;
    
    // For PayPal
    paypalEmail?: string;
    paypalToken?: string;
    
    // For Stripe
    stripeToken?: string;
    stripePaymentMethodId?: string;
    
    // Billing address
    billingAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };

  @IsOptional()
  @IsString()
  notes?: string;
}