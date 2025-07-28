import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import {
  Notification,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { EmailService } from '@shared/services/email.service';
import { SMSService } from '@shared/services/sms.service';
import { PushNotificationService } from '@shared/services/push-notification.service';
import { User } from '@core/domain/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel(User.name) private userModel: Model<User>,
    private emailService: EmailService,
    private smsService: SMSService,
    private pushNotificationService: PushNotificationService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = new this.notificationModel(createNotificationDto);
    return notification.save();
  }

  async sendNotification(sendNotificationDto: SendNotificationDto): Promise<Notification> {
    const notification = await this.create(sendNotificationDto);
    
    try {
      await this.sendByChannel(notification);
      
      notification.status = NotificationStatus.SENT;
      notification.sentAt = new Date();
    } catch (error) {
      notification.status = NotificationStatus.FAILED;
      notification.errorMessage = error.message;
      notification.retryCount += 1;
    }

    await notification.save();
    return notification;
  }

  async sendOrderConfirmation(userId: string, orderData: any): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) return;

    const enhancedOrderData = {
      ...orderData,
      customerName: `${user.firstName} ${user.lastName}`,
    };

    // Send email notification
    await this.sendNotification({
      userId,
      type: NotificationType.ORDER_CONFIRMED,
      channel: NotificationChannel.EMAIL,
      title: 'Order Confirmed',
      message: `Your order #${orderData.orderNumber} has been confirmed and is being processed.`,
      data: enhancedOrderData,
    });

    if (user.phone) {
      await this.sendNotification({
        userId,
        type: NotificationType.ORDER_CONFIRMED,
        channel: NotificationChannel.SMS,
        title: 'Order Confirmed',
        message: `Hi ${user.firstName}! Your order ${orderData.orderNumber} has been confirmed.`,
        data: enhancedOrderData,
      });
    }

    if (orderData.deviceToken) {
      await this.sendNotification({
        userId,
        type: NotificationType.ORDER_CONFIRMED,
        channel: NotificationChannel.PUSH,
        title: 'Order Confirmed',
        message: `Order #${orderData.orderNumber} confirmed`,
        data: { ...enhancedOrderData, deviceToken: orderData.deviceToken },
      });
    }

    // Always create in-app notification
    await this.sendNotification({
      userId,
      type: NotificationType.ORDER_CONFIRMED,
      channel: NotificationChannel.IN_APP,
      title: 'Order Confirmed',
      message: `Order #${orderData.orderNumber} confirmed`,
      data: enhancedOrderData,
    });
  }

  async sendOrderShipped(userId: string, orderData: any): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) return;

    const enhancedOrderData = {
      ...orderData,
      customerName: `${user.firstName} ${user.lastName}`,
    };

    // Send email notification
    await this.sendNotification({
      userId,
      type: NotificationType.ORDER_SHIPPED,
      channel: NotificationChannel.EMAIL,
      title: 'Order Shipped',
      message: `Your order #${orderData.orderNumber} has been shipped. Tracking: ${orderData.trackingNumber}`,
      data: enhancedOrderData,
    });

    // Send SMS if user has phone number
    if (user.phone) {
      await this.sendNotification({
        userId,
        type: NotificationType.ORDER_SHIPPED,
        channel: NotificationChannel.SMS,
        title: 'Order Shipped',
        message: `Your order ${orderData.orderNumber} has shipped!`,
        data: enhancedOrderData,
      });
    }

    // Send push notification if device token available
    if (orderData.deviceToken) {
      await this.sendNotification({
        userId,
        type: NotificationType.ORDER_SHIPPED,
        channel: NotificationChannel.PUSH,
        title: 'Order Shipped',
        message: `Order #${orderData.orderNumber} shipped`,
        data: { ...enhancedOrderData, deviceToken: orderData.deviceToken },
      });
    }

    // In-app notification
    await this.sendNotification({
      userId,
      type: NotificationType.ORDER_SHIPPED,
      channel: NotificationChannel.IN_APP,
      title: 'Order Shipped',
      message: `Order #${orderData.orderNumber} shipped - Track: ${orderData.trackingNumber}`,
      data: enhancedOrderData,
    });
  }

  async sendPaymentSuccess(userId: string, paymentData: any): Promise<void> {
    await this.sendNotification({
      userId,
      type: NotificationType.PAYMENT_SUCCESS,
      channel: NotificationChannel.IN_APP,
      title: 'Payment Successful',
      message: `Payment of $${paymentData.amount} has been processed successfully.`,
      data: paymentData,
    });
  }

  async sendPaymentFailed(userId: string, paymentData: any): Promise<void> {
    await this.sendNotification({
      userId,
      type: NotificationType.PAYMENT_FAILED,
      channel: NotificationChannel.EMAIL,
      title: 'Payment Failed',
      message: `Payment of $${paymentData.amount} could not be processed. Please try again.`,
      data: paymentData,
    });
  }

  async sendWelcomeNotification(userId: string, userData: any): Promise<void> {
    await this.sendNotification({
      userId,
      type: NotificationType.WELCOME,
      channel: NotificationChannel.EMAIL,
      title: 'Welcome to Fashion Store!',
      message: `Welcome ${userData.firstName}! Thank you for joining our fashion community.`,
      data: userData,
    });
  }

  // Event Listeners
  @OnEvent('user.registered')
  async handleUserRegistered(payload: any) {
    try {
      await this.sendWelcomeNotification(payload.userId, payload.userData);
    } catch (error) {
      console.error('Failed to handle user registered event:', error);
    }
  }

  @OnEvent('order.created')
  async handleOrderCreated(payload: any) {
    try {
      await this.sendOrderConfirmation(payload.userId, payload.orderData);
    } catch (error) {
      console.error('Failed to handle order created event:', error);
    }
  }

  @OnEvent('order.shipped')
  async handleOrderShipped(payload: any) {
    try {
      await this.sendOrderShipped(payload.userId, payload.orderData);
    } catch (error) {
      console.error('Failed to handle order shipped event:', error);
    }
  }

  @OnEvent('payment.processed')
  async handlePaymentProcessed(payload: any) {
    try {
      if (payload.success) {
        await this.sendPaymentSuccess(payload.userId, payload.paymentData);
      } else {
        await this.sendPaymentFailed(payload.userId, payload.paymentData);
      }
    } catch (error) {
      console.error('Failed to handle payment processed event:', error);
    }
  }

  async findUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments({ userId }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: id, userId },
      { status: NotificationStatus.READ, readAt: new Date() },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { userId, status: { $ne: NotificationStatus.READ } },
      { status: NotificationStatus.READ, readAt: new Date() },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      userId,
      status: { $ne: NotificationStatus.READ },
    });
  }

  private async sendByChannel(notification: Notification): Promise<void> {
    switch (notification.channel) {
      case NotificationChannel.EMAIL:
        await this.sendEmail(notification);
        break;
      case NotificationChannel.SMS:
        await this.sendSMS(notification);
        break;
      case NotificationChannel.PUSH:
        await this.sendPushNotification(notification);
        break;
      case NotificationChannel.IN_APP:
        // In-app notifications are stored in database only
        break;
      default:
        throw new Error('Unsupported notification channel');
    }
  }

  private async sendEmail(notification: Notification): Promise<void> {
    const user = await this.userModel.findById(notification.userId);
    if (!user) throw new Error('User not found');

    let success = false;

    switch (notification.type) {
      case NotificationType.ORDER_CONFIRMED:
        success = await this.emailService.sendOrderConfirmationEmail(user.email, notification.data);
        break;
      case NotificationType.ORDER_SHIPPED:
        success = await this.emailService.sendOrderShippedEmail(user.email, notification.data);
        break;
      case NotificationType.WELCOME:
        success = await this.emailService.sendWelcomeEmail(user.email, notification.data);
        break;
      case NotificationType.PAYMENT_FAILED:
        success = await this.emailService.sendPaymentFailedEmail(user.email, notification.data);
        break;
      default:
        // Generic email for other types
        success = await this.emailService.sendEmail({
          to: user.email,
          subject: notification.title,
          html: `<p>${notification.message}</p>`,
        });
    }

    if (!success) {
      throw new Error('Failed to send email');
    }
  }

  private async sendSMS(notification: Notification): Promise<void> {
    const user = await this.userModel.findById(notification.userId);
    if (!user || !user.phone) throw new Error('User phone not found');

    let success = false;

    switch (notification.type) {
      case NotificationType.ORDER_CONFIRMED:
        success = await this.smsService.sendOrderConfirmationSMS(user.phone, notification.data);
        break;
      case NotificationType.ORDER_SHIPPED:
        success = await this.smsService.sendOrderShippedSMS(user.phone, notification.data);
        break;
      case NotificationType.ORDER_DELIVERED:
        success = await this.smsService.sendOrderDeliveredSMS(user.phone, notification.data);
        break;
      case NotificationType.PAYMENT_FAILED:
        success = await this.smsService.sendPaymentFailedSMS(user.phone, notification.data);
        break;
      case NotificationType.PROMOTION:
        success = await this.smsService.sendPromotionalSMS(user.phone, notification.data);
        break;
      default:
        // Generic SMS for other types
        success = await this.smsService.sendSMS({
          to: user.phone,
          message: notification.message,
        });
    }

    if (!success) {
      throw new Error('Failed to send SMS');
    }
  }

  private async sendPushNotification(notification: Notification): Promise<void> {
    const deviceToken = notification.data?.deviceToken;
    if (!deviceToken) throw new Error('Device token not found');

    let success = false;

    switch (notification.type) {
      case NotificationType.ORDER_CONFIRMED:
        success = await this.pushNotificationService.sendOrderConfirmationPush(deviceToken, notification.data);
        break;
      case NotificationType.ORDER_SHIPPED:
        success = await this.pushNotificationService.sendOrderShippedPush(deviceToken, notification.data);
        break;
      case NotificationType.ORDER_DELIVERED:
        success = await this.pushNotificationService.sendOrderDeliveredPush(deviceToken, notification.data);
        break;
      case NotificationType.PAYMENT_SUCCESS:
        success = await this.pushNotificationService.sendPaymentSuccessPush(deviceToken, notification.data);
        break;
      case NotificationType.PAYMENT_FAILED:
        success = await this.pushNotificationService.sendPaymentFailedPush(deviceToken, notification.data);
        break;
      case NotificationType.PRODUCT_BACK_IN_STOCK:
        success = await this.pushNotificationService.sendProductBackInStockPush(deviceToken, notification.data);
        break;
      default:
        // Generic push notification for other types
        success = await this.pushNotificationService.sendPushNotification({
          token: deviceToken,
          title: notification.title,
          body: notification.message,
          data: notification.data,
        });
    }

    if (!success) {
      throw new Error('Failed to send push notification');
    }
  }
}