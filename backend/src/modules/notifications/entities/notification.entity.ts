import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from '@core/domain/entities/base.entity';

export enum NotificationType {
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  PRODUCT_BACK_IN_STOCK = 'product_back_in_stock',
  PROMOTION = 'promotion',
  WELCOME = 'welcome',
  NEWSLETTER = 'newsletter',
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  READ = 'read',
}

@Schema({ collection: 'notifications' })
export class Notification extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ type: String, enum: NotificationChannel, required: true })
  channel: NotificationChannel;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object })
  data?: any;

  @Prop({ type: String, enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Prop()
  sentAt?: Date;

  @Prop()
  readAt?: Date;

  @Prop()
  externalId?: string;

  @Prop()
  errorMessage?: string;

  @Prop({ default: 0 })
  retryCount: number;

  @Prop()
  scheduledFor?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);