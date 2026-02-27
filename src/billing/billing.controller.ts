import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('api/v1/billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  async getPlans() {
    const plans = await this.billingService.getPlans();
    return { success: true, data: plans };
  }

  @Post('checkout')
  async createCheckoutSession(@Request() req: any, @Body() body: { planId: string }) {
    const session = await this.billingService.createCheckoutSession(req.user.id, body.planId);
    return { success: true, data: session };
  }

  @Get('subscription')
  async getSubscription(@Request() req: any) {
    const sub = await this.billingService.getSubscription(req.user.id);
    return { success: true, data: sub };
  }

  @Post('cancel')
  async cancelSubscription(@Request() req: any) {
    const result = await this.billingService.cancelSubscription(req.user.id);
    return result;
  }

  @Post('portal')
  async createPortalSession(@Request() req: any) {
    const session = await this.billingService.createPortalSession(req.user.id);
    return { success: true, data: session };
  }
}
